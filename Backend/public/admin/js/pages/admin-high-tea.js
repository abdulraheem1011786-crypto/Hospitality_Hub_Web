// Admin High-Tea Venues Management Page - Updated 2026-04-27
const AdminHighTeaPage = (() => {
    let venues = [];
    let editingId = null;
    let selectedFiles = [];
    let altTexts = [];
    
    console.log('AdminHighTeaPage module loaded');

    async function loadVenues() {
        try {
            venues = await AdminAPIService.getHighTeaVenues();
            renderVenuesTable();
        } catch (error) {
            alert('Error loading venues: ' + error.message);
        }
    }

    function renderVenuesTable() {
        const tbody = document.getElementById('venuesTableBody');
        if (venues.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No venues yet</td></tr>';
            return;
        }

        tbody.innerHTML = venues.map(venue => `
            <tr>
                <td>${venue.name}</td>
                <td>${venue.location}</td>
                <td>Rs. ${venue.price_per_head}</td>
                <td>${venue.capacity || 'N/A'}</td>
                <td>
                    <button class="btn-action" onclick="AdminHighTeaPage.manageImages(${venue.id}, '${venue.name}')" title="Manage Images">
                        <i class="fas fa-images"></i>
                    </button>
                    <button class="btn-edit" onclick="AdminHighTeaPage.editVenue(${venue.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="AdminHighTeaPage.deleteVenue(${venue.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
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

    function setupEventListeners() {
        const addBtn = document.getElementById('addTeaBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('teaFormElement');

        if (!addBtn || !cancelBtn || !form) {
            console.warn('AdminHighTeaPage: Required form elements not found');
            return;
        }

        addBtn.addEventListener('click', () => {
            editingId = null;
            selectedFiles = [];
            altTexts = [];
            document.getElementById('formTitle').textContent = 'Add New High-Tea Venue';
            form.reset();
            document.getElementById('imagePreviewContainer').innerHTML = '';
            document.getElementById('teaForm').style.display = 'block';
            setupImageUploadHandlers();
        });

        cancelBtn.addEventListener('click', () => {
            document.getElementById('teaForm').style.display = 'none';
            form.reset();
            selectedFiles = [];
            altTexts = [];
            document.getElementById('imagePreviewContainer').innerHTML = '';
            editingId = null;
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveVenue();
        });

        // Test button for debugging
        const testBtn = document.getElementById('testSaveBtn');
        if (testBtn) {
            testBtn.addEventListener('click', async () => {
                console.log('Test save button clicked');
                await saveVenue();
            });
        }

        // Setup close modal listener (will attach when modal is shown)
        // setupImageModalListeners();
    }

    function setupImageUploadHandlers() {
        const fileInput = document.getElementById('teaImageInput');
        const dragDropArea = document.getElementById('teaDragDropArea');
        
        if (!fileInput || !dragDropArea) return;

        dragDropArea.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            handleFileSelection(e.target.files);
        });

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
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
                alert(`File ${file.name} is not a supported image format. Use JPG, PNG, or WebP.`);
                return false;
            }
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
                                   onchange="AdminHighTeaPage.updateAltText(${index}, this.value)"
                                   style="width: 100%; padding: 4px; font-size: 11px; margin-top: 5px;">
                            <button type="button" onclick="AdminHighTeaPage.removeFile(${index})" 
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

    async function saveVenue() {
        const form = document.getElementById('teaFormElement');
        const amenitiesStr = document.getElementById('amenities').value;
        const amenities = amenitiesStr ? amenitiesStr.split(',').map(a => a.trim()) : [];

        const data = {
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            price_per_head: parseFloat(document.getElementById('price').value),
            capacity: document.getElementById('capacity').value ? parseInt(document.getElementById('capacity').value) : null,
            cuisine_type: document.getElementById('cuisine').value,
            amenities: amenities
        };

        try {
            let venueId;
            if (editingId) {
                await AdminAPIService.updateHighTeaVenue(editingId, data);
                venueId = editingId;
                alert('Venue updated successfully');
            } else {
                const response = await AdminAPIService.createHighTeaVenue(data);
                venueId = response.id;
                alert('Venue created successfully');
            }
            
            // Upload images if any were selected
            if (selectedFiles.length > 0) {
                try {
                    await AdminImageService.uploadImages('high_tea_venue', venueId, selectedFiles, altTexts);
                    alert('Images uploaded successfully');
                } catch (error) {
                    alert('Images uploaded but there was an issue: ' + error.message);
                }
            }
            
            document.getElementById('teaForm').style.display = 'none';
            form.reset();
            selectedFiles = [];
            altTexts = [];
            document.getElementById('imagePreviewContainer').innerHTML = '';
            editingId = null;
            await loadVenues();
        } catch (error) {
            console.log('Error saving venue: ' + error.message);
            alert('Error saving venue: ' + error.message);
        }
    }

    const exposedMethods = {
        render: () => `
            <div class="management-container">
                <div class="page-header">
                    <h2>High-Tea Venues Management</h2>
                    <button class="btn-add" id="addTeaBtn">
                        <i class="fas fa-plus"></i> Add New Venue
                    </button>
                </div>

                <div id="teaForm" class="form-container" style="display: none;">
                    <h3 id="formTitle">Add New High-Tea Venue</h3>
                    <form id="teaFormElement">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="name">Venue Name *</label>
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
                                <label for="price">Price Per Head (PKR) *</label>
                                <input type="number" id="price" name="price_per_head" required min="0">
                            </div>
                            <div class="form-group">
                                <label for="capacity">Capacity</label>
                                <input type="number" id="capacity" name="capacity" min="1">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="cuisine">Cuisine Type</label>
                            <input type="text" id="cuisine" name="cuisine_type" placeholder="e.g., Continental, Asian">
                        </div>

                        <div class="form-group">
                            <label for="amenities">Amenities (comma-separated)</label>
                            <input type="text" id="amenities" name="amenities" placeholder="WiFi, Parking, Garden">
                        </div>

                        <div class="form-group">
                            <label>Venue Images (Optional)</label>
                            <div id="teaDragDropArea" style="border: 2px dashed #007bff; border-radius: 8px; padding: 30px; text-align: center; cursor: pointer; background-color: #f8f9fa; transition: all 0.3s;">
                                <p style="margin: 0; color: #666;">
                                    <strong>Click to select images or drag and drop</strong><br>
                                    <small>Supported: JPG, PNG, WebP (Max 5MB per image)</small>
                                </p>
                            </div>
                            <input type="file" id="teaImageInput" multiple accept="image/*" style="display: none;">
                            <div id="imagePreviewContainer" style="margin-top: 15px; padding: 15px; background: #f9f9f9; border-radius: 4px;">
                                <p class="text-muted">No images selected</p>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" id="testSaveBtn" style="background: red; color: white; margin-right: 10px;">TEST SAVE</button>
                            <button type="submit" class="btn-submit">Save Venue & Upload Images</button>
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
                                <th>Price/Head</th>
                                <th>Capacity</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="venuesTableBody">
                            <tr><td colspan="5" class="text-center">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Image Management Modal -->
                <div id="imageModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
                    <div class="modal-dialog" style="background: white; margin: 50px auto; border-radius: 8px; max-width: 800px; max-height: 90vh; overflow-y: auto; padding: 30px;">
                        <button class="btn-close" id="closeImageModal" style="float: right; font-size: 24px; cursor: pointer; border: none; background: none; padding: 0;">&times;</button>
                        <h3 id="imageModalTitle" class="mb-4">Manage Venue Images</h3>
                        <div id="imageUploadForm"></div>
                        <div id="imageGalleryContainer" class="mt-4"></div>
                    </div>
                </div>
            </div>
        `,

        init: async () => {
            await loadVenues();
            setupEventListeners();
        },

        editVenue: async (id) => {
            editingId = id;
            const venue = venues.find(v => v.id === id);
            if (venue) {
                document.getElementById('formTitle').textContent = 'Edit High-Tea Venue';
                document.getElementById('name').value = venue.name;
                document.getElementById('location').value = venue.location;
                document.getElementById('description').value = venue.description;
                document.getElementById('price').value = venue.price_per_head;
                document.getElementById('capacity').value = venue.capacity || '';
                document.getElementById('cuisine').value = venue.cuisine_type || '';
                document.getElementById('amenities').value = (venue.amenities || []).join(', ');
                document.getElementById('teaForm').style.display = 'block';
            }
        },

        manageImages: async (venueId, venueName) => {
            try {
                const modal = document.getElementById('imageModal');
                const modalTitle = document.getElementById('imageModalTitle');
                const uploadForm = document.getElementById('imageUploadForm');
                const galleryContainer = document.getElementById('imageGalleryContainer');
                
                if (!modal || !modalTitle || !uploadForm || !galleryContainer) {
                    alert('Error: Image modal not found. Please refresh the page.');
                    return;
                }
                
                modalTitle.textContent = `Manage Images - ${venueName}`;
                
                // Render upload form
                uploadForm.innerHTML = AdminImageGallery.renderUploadForm('imageUploadForm', 'high_tea_venue', venueId);
                
                // Load and render images
                const loadAndRenderImages = async () => {
                    try {
                        const result = await AdminImageService.getVenueImages('high_tea_venue', venueId);
                        galleryContainer.innerHTML = AdminImageGallery.renderGallery(result.images, 'high_tea_venue', venueId);
                        AdminImageGallery.setupGalleryListeners(loadAndRenderImages, loadAndRenderImages);
                    } catch (error) {
                        console.error('Error loading images:', error);
                        galleryContainer.innerHTML = '<p class="text-danger">Error loading images: ' + error.message + '</p>';
                    }
                };
                
                await loadAndRenderImages();
                
                // Setup upload listeners
                AdminImageGallery.setupUploadListeners('high_tea_venue', venueId, loadAndRenderImages);
                
                // Setup modal close listeners
                setupImageModalListeners();
                
                // Show modal
                modal.style.display = 'block';
            } catch (error) {
                console.error('Error in manageImages:', error);
                alert('Error opening image manager: ' + error.message);
            }
        },

        deleteVenue: async (id) => {
            if (confirm('Are you sure you want to delete this venue?')) {
                try {
                    await AdminAPIService.deleteHighTeaVenue(id);
                    alert('Venue deleted successfully');
                    await loadVenues();
                } catch (error) {
                    alert('Error deleting venue: ' + error.message);
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

window.AdminHighTeaPage = AdminHighTeaPage;
console.log('AdminHighTeaPage defined:', typeof AdminHighTeaPage, 'Methods:', AdminHighTeaPage ? Object.keys(AdminHighTeaPage) : 'undefined');
