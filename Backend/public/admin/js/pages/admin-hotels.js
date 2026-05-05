// Admin Hotels Management Page
const AdminHotelsPage = (() => {
    let hotels = [];
    let editingId = null;
    let selectedFiles = []; // Store files for upload after creation
    let altTexts = []; // Store alt texts for images
    
    console.log('AdminHotelsPage module loaded');

    async function loadHotels() {
        try {
            hotels = await AdminAPIService.getHotels();
            renderHotelsTable();
        } catch (error) {
            alert('Error loading hotels: ' + error.message);
        }
    }

    function renderHotelsTable() {
        const tbody = document.getElementById('hotelsTableBody');
        if (hotels.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hotels yet</td></tr>';
            return;
        }

        tbody.innerHTML = hotels.map(hotel => `
            <tr>
                <td>${hotel.name}</td>
                <td>${hotel.location}</td>
                <td>Rs. ${hotel.price_per_night}</td>
                <td>${hotel.rating ? hotel.rating + ' ⭐' : 'N/A'}</td>
                <td>
                    <button class="btn-action" onclick="AdminHotelsPage.manageImages(${hotel.id}, '${hotel.name}')" title="Manage Images">
                        <i class="fas fa-images"></i>
                    </button>
                    <button class="btn-edit" onclick="AdminHotelsPage.editHotel(${hotel.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="AdminHotelsPage.deleteHotel(${hotel.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function setupEventListeners() {
        const addBtn = document.getElementById('addHotelBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('hotelFormElement');

        if (!addBtn || !cancelBtn || !form) {
            console.warn('AdminHotelsPage: Required form elements not found');
            return;
        }

        addBtn.addEventListener('click', () => {
            editingId = null;
            selectedFiles = [];
            altTexts = [];
            document.getElementById('formTitle').textContent = 'Add New Hotel';
            form.reset();
            document.getElementById('imagePreviewContainer').innerHTML = '';
            document.getElementById('hotelForm').style.display = 'block';
            setupImageUploadHandlers();
        });

        cancelBtn.addEventListener('click', () => {
            document.getElementById('hotelForm').style.display = 'none';
            form.reset();
            selectedFiles = [];
            altTexts = [];
            document.getElementById('imagePreviewContainer').innerHTML = '';
            editingId = null;
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveHotel();
        });

        // Setup close modal listener (will attach when modal is shown)
        setupImageModalListeners();
    }

    function setupImageUploadHandlers() {
        const fileInput = document.getElementById('hotelImageInput');
        const dragDropArea = document.getElementById('hotelDragDropArea');
        
        if (!fileInput || !dragDropArea) return;

        // Click to select files
        dragDropArea.addEventListener('click', () => fileInput.click());

        // File input change
        fileInput.addEventListener('change', (e) => {
            handleFileSelection(e.target.files);
        });

        // Drag and drop
        dragDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dragDropArea.style.backgroundColor = '#e8f4f8';
            dragDropArea.style.borderColor = '#007bff';
        });

        dragDropArea.addEventListener('dragleave', () => {
            dragDropArea.style.backgroundColor = '';
            dragDropArea.style.borderColor = '';
        });

        dragDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dragDropArea.style.backgroundColor = '';
            dragDropArea.style.borderColor = '';
            handleFileSelection(e.dataTransfer.files);
        });
    }

    function handleFileSelection(files) {
        selectedFiles = Array.from(files).filter(file => {
            // Validate file type
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                alert(`File ${file.name} is not a supported image format. Use JPG, PNG, or WebP.`);
                return false;
            }
            // Validate file size (5MB)
            if (file.size > 5242880) {
                alert(`File ${file.name} is too large. Max 5MB.`);
                return false;
            }
            return true;
        });

        updateImagePreview();
    }

    function updateImagePreview() {
        const container = document.getElementById('imagePreviewContainer');
        if (selectedFiles.length === 0) {
            container.innerHTML = '<p class="text-muted">No images selected</p>';
            return;
        }

        let previewHTML = '<div class="image-preview-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin-top: 10px;">';

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById(`preview-${index}`);
                if (preview) {
                    preview.innerHTML = `
                        <div style="border: 1px solid #ddd; border-radius: 4px; padding: 5px; text-align: center;">
                            <img src="${e.target.result}" style="max-width: 100%; max-height: 80px; margin-bottom: 5px;">
                            <small style="display: block; word-break: break-word;">${file.name}</small>
                            <input type="text" placeholder="Alt text..." value="${altTexts[index] || ''}" 
                                   onchange="AdminHotelsPage.updateAltText(${index}, this.value)"
                                   style="width: 100%; padding: 4px; font-size: 11px; margin-top: 5px;">
                            <button type="button" onclick="AdminHotelsPage.removeFile(${index})" 
                                    style="background: #dc3545; color: white; border: none; padding: 3px 8px; margin-top: 4px; cursor: pointer; border-radius: 3px; font-size: 11px;">
                                Remove
                            </button>
                        </div>
                    `;
                }
            };
            reader.readAsDataURL(file);

            previewHTML += `<div id="preview-${index}"><p>Loading...</p></div>`;
        });

        previewHTML += '</div>';
        container.innerHTML = previewHTML;
    }

    function setupImageModalListeners() {
        const closeImageModalBtn = document.getElementById('closeImageModal');
        const imageModal = document.getElementById('imageModal');

        if (closeImageModalBtn) {
            closeImageModalBtn.addEventListener('click', () => {
                imageModal.style.display = 'none';
            });
        }

        if (imageModal) {
            window.addEventListener('click', (e) => {
                if (e.target === imageModal) {
                    imageModal.style.display = 'none';
                }
            });
        }
    }

    async function saveHotel() {
        const form = document.getElementById('hotelFormElement');
        const amenitiesStr = document.getElementById('amenities').value;
        const amenities = amenitiesStr ? amenitiesStr.split(',').map(a => a.trim()) : [];

        const data = {
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            price_per_night: parseFloat(document.getElementById('price').value),
            rating: document.getElementById('rating').value ? parseFloat(document.getElementById('rating').value) : null,
            amenities: amenities
        };

        try {
            let hotelId;
            if (editingId) {
                await AdminAPIService.updateHotel(editingId, data);
                hotelId = editingId;
                alert('Hotel updated successfully');
            } else {
                const response = await AdminAPIService.createHotel(data);
                hotelId = response.id;
                alert('Hotel created successfully');
            }
            
            // Upload images if any were selected
            if (selectedFiles.length > 0) {
                try {
                    await AdminImageService.uploadImages('hotel', hotelId, selectedFiles, altTexts);
                    alert('Images uploaded successfully');
                } catch (error) {
                    alert('Images uploaded but there was an issue: ' + error.message);
                }
            }
            
            document.getElementById('hotelForm').style.display = 'none';
            form.reset();
            selectedFiles = [];
            altTexts = [];
            document.getElementById('imagePreviewContainer').innerHTML = '';
            editingId = null;
            await loadHotels();
        } catch (error) {
            alert('Error saving hotel: ' + error.message);
        }
    }

    const exposedMethods = {
        render: () => `
            <div class="management-container">
                <div class="page-header">
                    <h2>Hotel Management</h2>
                    <button class="btn-add" id="addHotelBtn">
                        <i class="fas fa-plus"></i> Add New Hotel
                    </button>
                </div>

                <div id="hotelForm" class="form-container" style="display: none;">
                    <h3 id="formTitle">Add New Hotel</h3>
                    <form id="hotelFormElement">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="name">Hotel Name *</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="location">Location *</label>
                                <input type="text" id="location" name="location" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="description">Description *</label>
                            <textarea id="description" name="description" required rows="3"></textarea>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="price">Price Per Night (PKR) *</label>
                                <input type="number" id="price" name="price_per_night" required min="0">
                            </div>
                            <div class="form-group">
                                <label for="rating">Rating (0-5)</label>
                                <input type="number" id="rating" name="rating" min="0" max="5" step="0.1">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="amenities">Amenities (comma-separated)</label>
                            <input type="text" id="amenities" name="amenities" placeholder="WiFi, Pool, Gym">
                        </div>

                        <div class="form-group">
                            <label>Hotel Images (Optional)</label>
                            <div id="hotelDragDropArea" style="border: 2px dashed #007bff; border-radius: 8px; padding: 30px; text-align: center; cursor: pointer; background-color: #f8f9fa; transition: all 0.3s;">
                                <p style="margin: 0; color: #666;">
                                    <strong>Click to select images or drag and drop</strong><br>
                                    <small>Supported: JPG, PNG, WebP (Max 5MB per image)</small>
                                </p>
                            </div>
                            <input type="file" id="hotelImageInput" multiple accept="image/*" style="display: none;">
                            <div id="imagePreviewContainer" style="margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 4px;">
                                <p class="text-muted">No images selected</p>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn-submit">Save Hotel & Upload Images</button>
                            <button type="button" class="btn-cancel" id="cancelBtn">Cancel</button>
                        </div>
                    </form>
                </div>

                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Location</th>
                                <th>Price/Night</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="hotelsTableBody">
                            <tr><td colspan="5" class="text-center">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Image Management Modal -->
                <div id="imageModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
                    <div class="modal-dialog" style="background: white; margin: 50px auto; border-radius: 8px; max-width: 800px; max-height: 90vh; overflow-y: auto; padding: 30px;">
                        <button class="btn-close" id="closeImageModal" style="float: right; font-size: 24px; cursor: pointer; border: none; background: none; padding: 0;">&times;</button>
                        <h3 id="imageModalTitle" class="mb-4">Manage Hotel Images</h3>
                        <div id="imageUploadForm"></div>
                        <div id="imageGalleryContainer" class="mt-4"></div>
                    </div>
                </div>
            </div>
        `,

        init: async () => {
            await loadHotels();
            setupEventListeners();
        },

        editHotel: async (id) => {
            editingId = id;
            const hotel = hotels.find(h => h.id === id);
            if (hotel) {
                document.getElementById('formTitle').textContent = 'Edit Hotel';
                document.getElementById('name').value = hotel.name;
                document.getElementById('location').value = hotel.location;
                document.getElementById('description').value = hotel.description;
                document.getElementById('price').value = hotel.price_per_night;
                document.getElementById('rating').value = hotel.rating || '';
                document.getElementById('amenities').value = (hotel.amenities || []).join(', ');
                document.getElementById('hotelForm').style.display = 'block';
            }
        },

        manageImages: async (hotelId, hotelName) => {
            try {
                const modal = document.getElementById('imageModal');
                const modalTitle = document.getElementById('imageModalTitle');
                const uploadForm = document.getElementById('imageUploadForm');
                const galleryContainer = document.getElementById('imageGalleryContainer');
                
                if (!modal || !modalTitle || !uploadForm || !galleryContainer) {
                    alert('Error: Image modal not found. Please refresh the page.');
                    return;
                }
                
                modalTitle.textContent = `Manage Images - ${hotelName}`;
                
                // Render upload form
                uploadForm.innerHTML = AdminImageGallery.renderUploadForm('imageUploadForm', 'hotel', hotelId);
                
                // Load and render images
                const loadAndRenderImages = async () => {
                    try {
                        const result = await AdminImageService.getVenueImages('hotel', hotelId);
                        galleryContainer.innerHTML = AdminImageGallery.renderGallery(result.images, 'hotel', hotelId);
                        AdminImageGallery.setupGalleryListeners(loadAndRenderImages, loadAndRenderImages);
                    } catch (error) {
                        console.error('Error loading images:', error);
                        galleryContainer.innerHTML = '<p class="text-danger">Error loading images: ' + error.message + '</p>';
                    }
                };
                
                await loadAndRenderImages();
                
                // Setup upload listeners
                AdminImageGallery.setupUploadListeners('hotel', hotelId, loadAndRenderImages);
                
                // Setup modal close listeners
                setupImageModalListeners();
                
                // Show modal
                modal.style.display = 'block';
            } catch (error) {
                console.error('Error in manageImages:', error);
                alert('Error opening image manager: ' + error.message);
            }
        },

        deleteHotel: async (id) => {
            if (confirm('Are you sure you want to delete this hotel?')) {
                try {
                    await AdminAPIService.deleteHotel(id);
                    alert('Hotel deleted successfully');
                    await loadHotels();
                } catch (error) {
                    alert('Error deleting hotel: ' + error.message);
                }
            }
        },

        updateAltText: (index, text) => {
            altTexts[index] = text;
        },

        removeFile: (index) => {
            selectedFiles.splice(index, 1);
            altTexts.splice(index, 1);
            updateImagePreview();
        }
    };
    
    return exposedMethods;
})();

window.AdminHotelsPage = AdminHotelsPage;
console.log('AdminHotelsPage defined:', typeof AdminHotelsPage, 'Methods:', AdminHotelsPage ? Object.keys(AdminHotelsPage) : 'undefined');
