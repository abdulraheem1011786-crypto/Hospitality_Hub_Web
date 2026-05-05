// Admin Event Halls Management Page
const AdminEventHallsPage = (() => {
    let halls = [];
    let editingId = null;
    let selectedFiles = [];
    let altTexts = [];
    
    console.log('AdminEventHallsPage module loaded');

    async function loadHalls() {
        try {
            halls = await AdminAPIService.getEventHalls();
            renderHallsTable();
        } catch (error) {
            alert('Error loading event halls: ' + error.message);
        }
    }

    function renderHallsTable() {
        const tbody = document.getElementById('hallsTableBody');
        if (halls.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No event halls yet</td></tr>';
            return;
        }

        tbody.innerHTML = halls.map(hall => `
            <tr>
                <td>${hall.name}</td>
                <td>${hall.location}</td>
                <td>Rs. ${hall.price_half_day} / ${hall.price_full_day}</td>
                <td>${hall.capacity || 'N/A'}</td>
                <td>
                    <button class="btn-action" onclick="AdminEventHallsPage.manageImages(${hall.id}, '${hall.name}')" title="Manage Images">
                        <i class="fas fa-images"></i>
                    </button>
                    <button class="btn-edit" onclick="AdminEventHallsPage.editEventHall(${hall.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="AdminEventHallsPage.deleteEventHall(${hall.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    function setupEventListeners() {
        const addBtn = document.getElementById('addHallBtn');
        const cancelBtn = document.getElementById('cancelBtn');
        const form = document.getElementById('hallFormElement');

        if (!addBtn || !cancelBtn || !form) {
            console.warn('AdminEventHallsPage: Required form elements not found - addBtn:', !!addBtn, 'cancelBtn:', !!cancelBtn, 'form:', !!form);
            return;
        }

        addBtn.addEventListener('click', () => {
            editingId = null;
            selectedFiles = [];
            altTexts = [];
            document.getElementById('formTitle').textContent = 'Add New Event Hall';
            form.reset();
            document.getElementById('imagePreviewContainer').innerHTML = '';
            document.getElementById('hallForm').style.display = 'block';
            setupImageUploadHandlers();
        });

        cancelBtn.addEventListener('click', () => {
            document.getElementById('hallForm').style.display = 'none';
            form.reset();
            selectedFiles = [];
            altTexts = [];
            document.getElementById('imagePreviewContainer').innerHTML = '';
            editingId = null;
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await saveHall();
        });

        // Setup close modal listener (will attach when modal is shown)
        setupImageModalListeners();
    }

    function setupImageUploadHandlers() {
        const fileInput = document.getElementById('hallImageInput');
        const dragDropArea = document.getElementById('hallDragDropArea');
        
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
                                   onchange="AdminEventHallsPage.updateAltText(${index}, this.value)"
                                   style="width: 100%; padding: 4px; font-size: 11px; margin-top: 5px;">
                            <button type="button" onclick="AdminEventHallsPage.removeFile(${index})" 
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

    async function saveHall() {
        const form = document.getElementById('hallFormElement');
        const amenitiesStr = document.getElementById('amenities').value;
        const amenities = amenitiesStr ? amenitiesStr.split(',').map(a => a.trim()) : [];

        const data = {
            name: document.getElementById('name').value,
            location: document.getElementById('location').value,
            description: document.getElementById('description').value,
            price_half_day: document.getElementById('halfDay').value ? parseFloat(document.getElementById('halfDay').value) : null,
            price_full_day: parseFloat(document.getElementById('fullDay').value),
            capacity: document.getElementById('capacity').value ? parseInt(document.getElementById('capacity').value) : null,
            max_guests: document.getElementById('maxGuests').value ? parseInt(document.getElementById('maxGuests').value) : null,
            amenities: amenities
        };

        try {
            let hallId;
            if (editingId) {
                await AdminAPIService.updateEventHall(editingId, data);
                hallId = editingId;
                alert('Event hall updated successfully');
            } else {
                const response = await AdminAPIService.createEventHall(data);
                hallId = response.id;
                alert('Event hall created successfully');
            }
            
            // Upload images if any were selected
            if (selectedFiles.length > 0) {
                try {
                    await AdminImageService.uploadImages('event_hall', hallId, selectedFiles, altTexts);
                    alert('Images uploaded successfully');
                } catch (error) {
                    alert('Images uploaded but there was an issue: ' + error.message);
                }
            }
            
            document.getElementById('hallForm').style.display = 'none';
            form.reset();
            selectedFiles = [];
            altTexts = [];
            document.getElementById('imagePreviewContainer').innerHTML = '';
            editingId = null;
            await loadHalls();
        } catch (error) {
            alert('Error saving event hall: ' + error.message);
        }
    }

    const exposedMethods = {
        render: () => `
            <div class="management-container">
                <div class="page-header">
                    <h2>Event Halls Management</h2>
                    <button class="btn-add" id="addHallBtn">
                        <i class="fas fa-plus"></i> Add New Hall
                    </button>
                </div>

                <div id="hallForm" class="form-container" style="display: none;">
                    <h3 id="formTitle">Add New Event Hall</h3>
                    <form id="hallFormElement">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="name">Hall Name *</label>
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
                                <label for="capacity">Capacity *</label>
                                <input type="number" id="capacity" name="capacity" required min="1">
                            </div>
                            <div class="form-group">
                                <label for="maxGuests">Max Guests</label>
                                <input type="number" id="maxGuests" name="max_guests" min="1">
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="fullDay">Price Full Day (PKR) *</label>
                                <input type="number" id="fullDay" name="price_full_day" required min="0">
                            </div>
                            <div class="form-group">
                                <label for="halfDay">Price Half Day (PKR)</label>
                                <input type="number" id="halfDay" name="price_half_day" min="0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="amenities">Amenities (comma-separated)</label>
                            <input type="text" id="amenities" name="amenities" placeholder="Parking, Kitchen, A/C, Sound System">
                        </div>

                        <div class="form-group">
                            <label for="setup">Setup Options (comma-separated)</label>
                            <input type="text" id="setup" name="setup" placeholder="Theater, Banquet, Classroom">
                        </div>

                        <div class="form-group">
                            <label for="hallDragDropArea">Event Hall Images</label>
                            <div id="hallDragDropArea" style="border: 2px dashed #ccc; padding: 20px; border-radius: 4px; text-align: center; cursor: pointer; background-color: #f9f9f9;">
                                <i class="fas fa-cloud-upload-alt" style="font-size: 24px; color: #999; display: block; margin-bottom: 10px;"></i>
                                <p style="color: #666; margin: 0;">Drag and drop images here or click to browse</p>
                                <small style="color: #999;">Supported: JPG, PNG, WebP (Max 5MB each)</small>
                            </div>
                            <input type="file" id="hallImageInput" multiple accept="image/*" style="display: none;">
                            <div id="imagePreviewContainer" style="margin-top: 15px;">
                                <p class="text-muted">No images selected</p>
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="submit" class="btn-submit">Save Event Hall & Upload Images</button>
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
                                <th>Capacity</th>
                                <th>Full Day Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody id="hallsTableBody">
                            <tr><td colspan="5" class="text-center">Loading...</td></tr>
                        </tbody>
                    </table>
                </div>

                <!-- Image Management Modal -->
                <div id="imageModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000;">
                    <div class="modal-dialog" style="background: white; margin: 50px auto; border-radius: 8px; max-width: 800px; max-height: 90vh; overflow-y: auto; padding: 30px;">
                        <button class="btn-close" id="closeImageModal" style="float: right; font-size: 24px; cursor: pointer; border: none; background: none; padding: 0;">&times;</button>
                        <h3 id="imageModalTitle" class="mb-4">Manage Event Hall Images</h3>
                        <div id="imageUploadForm"></div>
                        <div id="imageGalleryContainer" class="mt-4"></div>
                    </div>
                </div>
            </div>
        `,

        init: async () => {
            await loadHalls();
            setupEventListeners();
        },

        editEventHall: async (id) => {
            editingId = id;
            const hall = halls.find(h => h.id === id);
            if (hall) {
                document.getElementById('formTitle').textContent = 'Edit Event Hall';
                document.getElementById('name').value = hall.name;
                document.getElementById('location').value = hall.location;
                document.getElementById('description').value = hall.description;
                document.getElementById('capacity').value = hall.capacity;
                document.getElementById('maxGuests').value = hall.max_guests || '';
                document.getElementById('fullDay').value = hall.price_full_day;
                document.getElementById('halfDay').value = hall.price_half_day || '';
                document.getElementById('amenities').value = (hall.amenities || []).join(', ');
                document.getElementById('setup').value = (hall.setup_options || []).join(', ');
                document.getElementById('hallForm').style.display = 'block';
            }
        },

        manageImages: async (hallId, hallName) => {
            try {
                const modal = document.getElementById('imageModal');
                const modalTitle = document.getElementById('imageModalTitle');
                const uploadForm = document.getElementById('imageUploadForm');
                const galleryContainer = document.getElementById('imageGalleryContainer');
                
                if (!modal || !modalTitle || !uploadForm || !galleryContainer) {
                    alert('Error: Image modal not found. Please refresh the page.');
                    return;
                }
                
                modalTitle.textContent = `Manage Images - ${hallName}`;
                
                // Render upload form
                uploadForm.innerHTML = AdminImageGallery.renderUploadForm('imageUploadForm', 'event_hall', hallId);
                
                // Load and render images
                const loadAndRenderImages = async () => {
                    try {
                        const result = await AdminImageService.getVenueImages('event_hall', hallId);
                        galleryContainer.innerHTML = AdminImageGallery.renderGallery(result.images, 'event_hall', hallId);
                        AdminImageGallery.setupGalleryListeners(loadAndRenderImages, loadAndRenderImages);
                    } catch (error) {
                        console.error('Error loading images:', error);
                        galleryContainer.innerHTML = '<p class="text-danger">Error loading images: ' + error.message + '</p>';
                    }
                };
                
                await loadAndRenderImages();
                
                // Setup upload listeners
                AdminImageGallery.setupUploadListeners('event_hall', hallId, loadAndRenderImages);
                
                // Setup modal close listeners
                setupImageModalListeners();
                
                // Show modal
                modal.style.display = 'block';
            } catch (error) {
                console.error('Error in manageImages:', error);
                alert('Error opening image manager: ' + error.message);
            }
        },

        deleteEventHall: async (id) => {
            if (confirm('Are you sure you want to delete this hall?')) {
                try {
                    await AdminAPIService.deleteEventHall(id);
                    alert('Hall deleted successfully');
                    await loadHalls();
                } catch (error) {
                    alert('Error deleting hall: ' + error.message);
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

window.AdminEventHallsPage = AdminEventHallsPage;
console.log('AdminEventHallsPage defined:', typeof AdminEventHallsPage, 'Methods:', AdminEventHallsPage ? Object.keys(AdminEventHallsPage) : 'undefined');
