// Admin Image Gallery Component
const AdminImageGallery = (() => {
    /**
     * Render image upload form
     */
    const renderUploadForm = (containerId, venueType, venueId) => {
        return `
            <div class="image-upload-section" id="imageUploadSection_${venueId}">
                <h4 class="mb-3">Upload Venue Images</h4>
                <div class="upload-area" id="uploadArea_${venueId}">
                    <input type="file" 
                           id="imageInput_${venueId}" 
                           class="image-input" 
                           multiple 
                           accept="image/jpeg,image/png,image/webp"
                           style="display: none;">
                    <div class="upload-box" style="border: 2px dashed #ccc; padding: 30px; text-align: center; border-radius: 8px; cursor: pointer;">
                        <i class="fas fa-cloud-upload-alt" style="font-size: 36px; color: #666; margin-bottom: 10px;"></i>
                        <p class="mb-2">Click to select images or drag and drop</p>
                        <small class="text-muted">Supported: JPG, PNG, WebP (Max 5MB per image)</small>
                    </div>
                    <div class="preview-container mt-3" id="previewContainer_${venueId}"></div>
                </div>
                <div class="mt-3">
                    <button class="btn btn-primary" id="uploadBtn_${venueId}" disabled>
                        <i class="fas fa-upload"></i> Upload Images
                    </button>
                </div>
            </div>
        `;
    };

    /**
     * Render image gallery grid
     */
    const renderGallery = (images, venueType, venueId) => {
        if (!images || images.length === 0) {
            return '<p class="text-muted">No images uploaded yet</p>';
        }

        return `
            <div class="image-gallery">
                <h4 class="mb-3">Uploaded Images</h4>
                <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 15px;">
                    ${images.map((img, index) => `
                        <div class="gallery-item" data-image-id="${img.id}">
                            <div class="image-wrapper" style="position: relative; background: #f5f5f5; border-radius: 8px; overflow: hidden;">
                                <img src="${img.image_path}" 
                                     alt="${img.alt_text || 'Gallery image'}" 
                                     style="width: 100%; height: 150px; object-fit: cover;"
                                     loading="lazy">
                                ${img.is_primary ? '<span class="badge badge-primary" style="position: absolute; top: 5px; right: 5px;">Featured</span>' : ''}
                            </div>
                            <div class="image-actions mt-2" style="font-size: 12px;">
                                <button class="btn btn-sm btn-outline-primary set-primary-btn" 
                                        data-image-id="${img.id}"
                                        ${img.is_primary ? 'disabled' : ''}
                                        style="width: 100%; margin-bottom: 5px;">
                                    Set as Featured
                                </button>
                                <button class="btn btn-sm btn-outline-danger delete-image-btn" 
                                        data-image-id="${img.id}"
                                        style="width: 100%;">
                                    Delete
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    };

    /**
     * Setup event listeners for image upload
     */
    const setupUploadListeners = (venueType, venueId, onUploadSuccess) => {
        const uploadArea = document.getElementById(`uploadArea_${venueId}`);
        const imageInput = document.getElementById(`imageInput_${venueId}`);
        const uploadBtn = document.getElementById(`uploadBtn_${venueId}`);
        const previewContainer = document.getElementById(`previewContainer_${venueId}`);

        console.log('setupUploadListeners called for venue:', venueType, venueId);
        console.log('Found elements:', {
            uploadArea: !!uploadArea,
            imageInput: !!imageInput,
            uploadBtn: !!uploadBtn,
            previewContainer: !!previewContainer
        });

        if (!uploadArea || !imageInput || !uploadBtn || !previewContainer) {
            console.error('Missing required elements for upload listeners', {
                uploadArea: `uploadArea_${venueId}`,
                imageInput: `imageInput_${venueId}`,
                uploadBtn: `uploadBtn_${venueId}`,
                previewContainer: `previewContainer_${venueId}`
            });
            return;
        }

        // Click to select files
        uploadArea.addEventListener('click', () => {
            console.log('Upload area clicked');
            imageInput.click();
        });

        // File selected from input
        imageInput.addEventListener('change', (e) => {
            console.log('Files selected:', e.target.files.length);
            handleFileSelection(e.target.files, previewContainer, uploadBtn, venueType, venueId, onUploadSuccess);
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.style.backgroundColor = '#f0f0f0';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.style.backgroundColor = 'transparent';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.style.backgroundColor = 'transparent';
            console.log('Files dropped:', e.dataTransfer.files.length);
            handleFileSelection(e.dataTransfer.files, previewContainer, uploadBtn, venueType, venueId, onUploadSuccess);
        });

        // Upload button
        uploadBtn.addEventListener('click', () => {
            console.log('Upload button clicked, files:', imageInput.files.length);
            uploadImages(imageInput.files, venueType, venueId, onUploadSuccess, uploadBtn);
        });
    };

    /**
     * Handle file selection and show previews
     */
    const handleFileSelection = (files, previewContainer, uploadBtn, venueType, venueId, onUploadSuccess) => {
        console.log('handleFileSelection called with', files.length, 'files');
        previewContainer.innerHTML = '';
        let validFiles = [];

        for (let file of files) {
            console.log('Checking file:', file.name, 'Type:', file.type, 'Size:', file.size);
            
            // Validate file type
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                console.warn(`Invalid file type: ${file.type}`);
                alert(`${file.name} is not a valid image format. Use JPG, PNG, or WebP.`);
                continue;
            }

            // Validate file size (5MB)
            if (file.size > 5242880) {
                console.warn(`File too large: ${file.size} bytes`);
                alert(`${file.name} is too large. Maximum file size is 5MB.`);
                continue;
            }

            validFiles.push(file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.createElement('div');
                preview.className = 'preview-item';
                preview.style.cssText = 'position: relative; display: inline-block; margin-right: 10px; margin-bottom: 10px;';
                preview.innerHTML = `
                    <img src="${e.target.result}" 
                         style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px; border: 2px solid #ddd;">
                    <span class="remove-preview" 
                          data-filename="${file.name}"
                          style="position: absolute; top: -8px; right: -8px; background: red; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: bold;">×</span>
                `;
                previewContainer.appendChild(preview);

                // Remove preview
                preview.querySelector('.remove-preview').addEventListener('click', () => {
                    preview.remove();
                    validFiles = validFiles.filter(f => f.name !== file.name);
                    if (validFiles.length === 0) {
                        uploadBtn.disabled = true;
                    }
                });
            };
            reader.readAsDataURL(file);
        }

        uploadBtn.disabled = validFiles.length === 0;
        imageInput.files = createFileList(validFiles);
    };

    /**
     * Upload images to server
     */
    const uploadImages = async (files, venueType, venueId, onUploadSuccess, uploadBtn) => {
        console.log('uploadImages called:', { venueType, venueId, fileCount: files.length });
        
        if (files.length === 0) {
            alert('Please select images to upload');
            return;
        }

        const originalText = uploadBtn.innerHTML;
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        try {
            console.log('Calling AdminImageService.uploadImages...');
            const result = await AdminImageService.uploadImages(venueType, venueId, files);
            console.log('Upload successful:', result);
            alert('Images uploaded successfully!');
            
            // Reset form
            const imageInput = document.getElementById(`imageInput_${venueId}`);
            const previewContainer = document.getElementById(`previewContainer_${venueId}`);
            if (imageInput) imageInput.value = '';
            if (previewContainer) previewContainer.innerHTML = '';
            
            // Reload gallery
            if (onUploadSuccess) {
                console.log('Calling onUploadSuccess callback');
                await onUploadSuccess();
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            uploadBtn.disabled = false;
            uploadBtn.innerHTML = originalText;
        }
    };

    /**
     * Setup event listeners for gallery actions
     */
    const setupGalleryListeners = (onImageDeleted, onPrimarySet) => {
        // Delete image buttons
        document.querySelectorAll('.delete-image-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const imageId = btn.dataset.imageId;
                
                if (confirm('Are you sure you want to delete this image?')) {
                    try {
                        await AdminImageService.deleteImage(imageId);
                        alert('Image deleted successfully');
                        if (onImageDeleted) await onImageDeleted();
                    } catch (error) {
                        alert('Failed to delete image: ' + error.message);
                    }
                }
            });
        });

        // Set as primary buttons
        document.querySelectorAll('.set-primary-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                const imageId = btn.dataset.imageId;
                
                try {
                    await AdminImageService.setPrimaryImage(imageId);
                    alert('Image set as featured');
                    if (onPrimarySet) await onPrimarySet();
                } catch (error) {
                    alert('Failed to set primary image: ' + error.message);
                }
            });
        });
    };

    /**
     * Create FileList-like object from array
     */
    const createFileList = (files) => {
        const dt = new DataTransfer();
        files.forEach(f => dt.items.add(f));
        return dt.files;
    };

    return {
        renderUploadForm,
        renderGallery,
        setupUploadListeners,
        setupGalleryListeners
    };
})();
