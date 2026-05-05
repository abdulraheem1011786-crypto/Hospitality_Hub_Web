<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Image;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    /**
     * Allowed file types and max size
     */
    protected const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    protected const MAX_FILE_SIZE = 5242880; // 5MB
    protected const STORAGE_PATH = 'uploads/venues';

    /**
     * Upload multiple images for a venue
     * POST /api/admin/images/upload
     */
    public function upload(Request $request)
    {
        $request->validate([
            'venue_type' => 'required|in:hotel,high_tea_venue,event_hall',
            'venue_id' => 'required|integer|min:1',
            'images.*' => 'required|image|mimes:jpeg,png,webp|max:5120', // max 5MB
            'alt_text.*' => 'nullable|string|max:255',
        ]);

        $venueType = $request->input('venue_type');
        $venueId = $request->input('venue_id');
        $uploadedImages = [];

        try {
            if (!$request->hasFile('images')) {
                return response()->json(['error' => 'No images provided'], 400);
            }

            $images = $request->file('images');
            if (!is_array($images)) {
                $images = [$images];
            }

            foreach ($images as $index => $file) {
                // Validate file
                if (!$this->isValidImage($file)) {
                    return response()->json([
                        'error' => "File at index {$index} is invalid or too large"
                    ], 422);
                }

                // Generate unique filename
                $filename = $this->generateFilename($file);
                $relativePath = "{$venueType}/{$filename}";

                // Store file in venue-type subdirectory
                $path = Storage::disk('public')->putFileAs(
                    self::STORAGE_PATH . '/' . $venueType,
                    $file,
                    $filename
                );

                if (!$path) {
                    \Log::error('Failed to store image file', [
                        'venue_type' => $venueType,
                        'venue_id' => $venueId,
                        'filename' => $filename
                    ]);
                    return response()->json(['error' => 'Failed to store image'], 500);
                }

                // Save to database with venue_type/filename path
                $image = Image::create([
                    'venue_type' => $venueType,
                    'venue_id' => $venueId,
                    'image_path' => $relativePath,
                    'file_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getMimeType(),
                    'file_size' => $file->getSize(),
                    'sort_order' => $this->getNextSortOrder($venueType, $venueId),
                    'is_primary' => false,
                    'alt_text' => $request->input("alt_text.{$index}"),
                ]);

                $uploadedImages[] = [
                    'id' => $image->id,
                    'image_path' => $image->getImageUrl(),
                    'file_name' => $image->file_name,
                    'alt_text' => $image->alt_text,
                ];
            }

            return response()->json([
                'message' => 'Images uploaded successfully',
                'images' => $uploadedImages,
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Image upload failed: ' . $e->getMessage(), [
                'venue_type' => $venueType ?? null,
                'venue_id' => $venueId ?? null,
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get all images for a venue
     * GET /api/admin/images/venue/{venueType}/{venueId}
     */
    public function getVenueImages($venueType, $venueId)
    {
        try {
            // Validate parameters
            if (!in_array($venueType, ['hotel', 'high_tea_venue', 'event_hall'])) {
                return response()->json(['error' => 'Invalid venue type'], 400);
            }

            if (!is_numeric($venueId) || $venueId <= 0) {
                return response()->json(['error' => 'Invalid venue ID'], 400);
            }

            $images = Image::forVenue($venueType, $venueId)->get();

            return response()->json([
                'images' => $images->map(fn($img) => [
                    'id' => $img->id,
                    'image_path' => $img->getImageUrl(),
                    'file_name' => $img->file_name,
                    'alt_text' => $img->alt_text,
                    'is_primary' => $img->is_primary,
                    'sort_order' => $img->sort_order,
                ]),
            ]);
        } catch (\Exception $e) {
            \Log::error('Get images failed: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch images: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Delete a single image
     * DELETE /api/admin/images/{id}
     */
    public function delete($id)
    {
        try {
            $image = Image::findOrFail($id);

            // Delete file from storage - image_path already includes venue_type
            $fullPath = self::STORAGE_PATH . '/' . $image->image_path;
            
            \Log::info('Deleting image', [
                'id' => $id,
                'fullPath' => $fullPath,
                'image_path' => $image->image_path
            ]);
            
            if (Storage::disk('public')->exists($fullPath)) {
                if (Storage::disk('public')->delete($fullPath)) {
                    \Log::info('File deleted successfully', ['path' => $fullPath]);
                } else {
                    \Log::warning('Failed to delete file', ['path' => $fullPath]);
                }
            } else {
                \Log::warning('File not found for deletion', ['path' => $fullPath]);
            }

            // Delete database record
            $image->delete();

            return response()->json(['message' => 'Image deleted successfully']);
        } catch (\Exception $e) {
            \Log::error('Image deletion failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to delete image'], 500);
        }
    }

    /**
     * Set image as primary
     * PATCH /api/admin/images/{id}/set-primary
     */
    public function setPrimary($id)
    {
        try {
            $image = Image::findOrFail($id);

            // Remove primary flag from other images of same venue
            Image::where('venue_type', $image->venue_type)
                ->where('venue_id', $image->venue_id)
                ->update(['is_primary' => false]);

            // Set this image as primary
            $image->update(['is_primary' => true]);

            return response()->json(['message' => 'Image set as primary']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to set primary image'], 500);
        }
    }

    /**
     * Update image metadata (alt text, sort order)
     * PATCH /api/admin/images/{id}
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'sort_order' => 'nullable|integer|min:0',
        ]);

        try {
            $image = Image::findOrFail($id);
            $image->update($request->only(['alt_text', 'sort_order']));

            return response()->json(['message' => 'Image updated successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update image'], 500);
        }
    }

    /**
     * Helper: Validate image file
     */
    protected function isValidImage($file): bool
    {
        return in_array($file->getMimeType(), self::ALLOWED_TYPES)
            && $file->getSize() <= self::MAX_FILE_SIZE;
    }

    /**
     * Helper: Generate unique filename
     */
    protected function generateFilename($file): string
    {
        $extension = $file->getClientOriginalExtension();
        $timestamp = now()->format('YmdHis');
        $random = Str::random(8);
        return "{$timestamp}_{$random}.{$extension}";
    }

    /**
     * Helper: Get next sort order for venue
     */
    protected function getNextSortOrder($venueType, $venueId): int
    {
        $maxOrder = Image::where('venue_type', $venueType)
            ->where('venue_id', $venueId)
            ->max('sort_order');

        return ($maxOrder ?? 0) + 1;
    }
}
