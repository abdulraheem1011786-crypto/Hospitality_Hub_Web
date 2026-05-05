// Admin Image Management Service
const AdminImageService = (() => {
    const getApiUrl = () => {
        const protocol = window.location.protocol;
        const host = window.location.host;
        // Use same host for API calls (proxied through Apache)
        return `${protocol}//${host}/api/admin/images`;
    };

    const getHeaders = () => {
        const token = AdminAuthService.getToken();
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    };

    const getFetchOptions = (method, body = null) => {
        const options = {
            method: method,
            headers: getHeaders(),
            credentials: 'include',
        };

        if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
            options.body = body;
        }

        return options;
    };

    const handleResponse = async (response, action) => {
        const contentType = response.headers.get('content-type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            const errorMessage = data.error || data.message || `Failed to ${action}`;
            throw new Error(errorMessage);
        }

        return data;
    };

    return {
        /**
         * Upload multiple images for a venue
         * @param {string} venueType - 'hotel', 'high_tea_venue', or 'event_hall'
         * @param {number} venueId - ID of the venue
         * @param {FileList} files - File objects from input
         * @param {Array} altTexts - Optional alt text for each image
         */
        uploadImages: async (venueType, venueId, files, altTexts = []) => {
            try {
                const formData = new FormData();
                formData.append('venue_type', venueType);
                formData.append('venue_id', venueId);

                for (let i = 0; i < files.length; i++) {
                    formData.append('images[]', files[i]);
                    if (altTexts[i]) {
                        formData.append(`alt_text[${i}]`, altTexts[i]);
                    }
                }

                const options = {
                    method: 'POST',
                    headers: getHeaders(),
                    credentials: 'include',
                    body: formData
                };

                const response = await fetch(`${getApiUrl()}/upload`, options);
                return await handleResponse(response, 'upload images');
            } catch (error) {
                throw error;
            }
        },

        /**
         * Get all images for a venue
         */
        getVenueImages: async (venueType, venueId) => {
            try {
                const options = getFetchOptions('GET');
                const response = await fetch(
                    `${getApiUrl()}/venue/${venueType}/${venueId}`,
                    options
                );
                return await handleResponse(response, 'fetch images');
            } catch (error) {
                throw error;
            }
        },

        /**
         * Delete an image by ID
         */
        deleteImage: async (imageId) => {
            try {
                const options = getFetchOptions('DELETE');
                const response = await fetch(`${getApiUrl()}/${imageId}`, options);
                return await handleResponse(response, 'delete image');
            } catch (error) {
                throw error;
            }
        },

        /**
         * Set an image as primary/featured
         */
        setPrimaryImage: async (imageId) => {
            try {
                const options = getFetchOptions('PATCH');
                const response = await fetch(
                    `${getApiUrl()}/${imageId}/set-primary`,
                    options
                );
                return await handleResponse(response, 'set primary image');
            } catch (error) {
                throw error;
            }
        },

        /**
         * Update image metadata (alt text, sort order)
         */
        updateImage: async (imageId, updateData) => {
            try {
                const options = getFetchOptions('PATCH', JSON.stringify(updateData));
                options.headers['Content-Type'] = 'application/json';
                const response = await fetch(`${getApiUrl()}/${imageId}`, options);
                return await handleResponse(response, 'update image');
            } catch (error) {
                throw error;
            }
        }
    };
})();
