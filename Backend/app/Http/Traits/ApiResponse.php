<?php

namespace App\Http\Traits;

use Illuminate\Http\JsonResponse;

/**
 * Trait for standardizing API responses across the application
 * 
 * Usage in controller:
 *  use ApiResponse;
 *  return $this->successResponse($data, 'Message', 200);
 *  return $this->errorResponse('Error message', 400);
 */
trait ApiResponse
{
    /**
     * Return a successful API response
     * 
     * @param mixed $data The response data
     * @param string $message The response message
     * @param int $statusCode The HTTP status code
     * @return JsonResponse
     */
    public function successResponse($data = null, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    /**
     * Return an error API response
     * 
     * @param string $message The error message
     * @param int $statusCode The HTTP status code
     * @param array|null $errors Additional error details
     * @return JsonResponse
     */
    public function errorResponse(string $message, int $statusCode = 400, ?array $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Return a paginated response
     * 
     * @param \Illuminate\Pagination\AbstractPaginator $paginated
     * @param string $message
     * @param int $statusCode
     * @return JsonResponse
     */
    public function paginatedResponse($paginated, string $message = 'Success', int $statusCode = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $paginated->items(),
            'pagination' => [
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
            ],
        ], $statusCode);
    }
}
