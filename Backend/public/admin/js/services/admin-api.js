// Admin API Service with Enhanced Error Handling
const AdminAPIService = (() => {
    const getApiUrl = () => {
        const protocol = window.location.protocol;
        const host = window.location.host;
        // Use same host for API calls (proxied through Apache)
        return `${protocol}//${host}/api/admin`;
    };

    const getHeaders = () => {
        const token = AdminAuthService.getToken();
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    };

    const getFetchOptions = (method = 'GET', body = null) => {
        const options = {
            method: method,
            headers: getHeaders(),
            credentials: 'include'
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        return options;
    };

    const handleResponse = async (response, action) => {
        if (!response.ok) {
            try {
                const error = await response.json();
                console.error(`${action} error:`, error);
                throw new Error(error.message || (error.errors ? Object.values(error.errors).flat().join(', ') : action + ' failed'));
            } catch (e) {
                throw new Error(action + ' failed: ' + response.statusText);
            }
        }
        const result = await response.json();
        return (result && typeof result === 'object' && 'data' in result) ? result.data : result;
    };

    return {
        // Hotels
        getHotels: async () => {
            const response = await fetch(`${getApiUrl()}/hotels`, getFetchOptions('GET'));
            return handleResponse(response, 'Fetch hotels');
        },

        getHotel: async (id) => {
            const response = await fetch(`${getApiUrl()}/hotels/${id}`, getFetchOptions('GET'));
            return handleResponse(response, 'Fetch hotel');
        },

        createHotel: async (data) => {
            const response = await fetch(`${getApiUrl()}/hotels`, getFetchOptions('POST', data));
            return handleResponse(response, 'Create hotel');
        },

        updateHotel: async (id, data) => {
            const response = await fetch(`${getApiUrl()}/hotels/${id}`, getFetchOptions('PATCH', data));
            return handleResponse(response, 'Update hotel');
        },

        deleteHotel: async (id) => {
            const response = await fetch(`${getApiUrl()}/hotels/${id}`, getFetchOptions('DELETE'));
            return handleResponse(response, 'Delete hotel');
        },

        // High Tea Venues
        getHighTeaVenues: async () => {
            const response = await fetch(`${getApiUrl()}/high-tea`, getFetchOptions('GET'));
            return handleResponse(response, 'Fetch high-tea venues');
        },

        getHighTeaVenue: async (id) => {
            const response = await fetch(`${getApiUrl()}/high-tea/${id}`, getFetchOptions('GET'));
            return handleResponse(response, 'Fetch high-tea venue');
        },

        createHighTeaVenue: async (data) => {
            const response = await fetch(`${getApiUrl()}/high-tea`, getFetchOptions('POST', data));
            return handleResponse(response, 'Create high-tea venue');
        },

        updateHighTeaVenue: async (id, data) => {
            const response = await fetch(`${getApiUrl()}/high-tea/${id}`, getFetchOptions('PATCH', data));
            return handleResponse(response, 'Update high-tea venue');
        },

        deleteHighTeaVenue: async (id) => {
            const response = await fetch(`${getApiUrl()}/high-tea/${id}`, getFetchOptions('DELETE'));
            return handleResponse(response, 'Delete high-tea venue');
        },

        // Event Halls
        getEventHalls: async () => {
            const response = await fetch(`${getApiUrl()}/event-halls`, getFetchOptions('GET'));
            return handleResponse(response, 'Fetch event halls');
        },

        getEventHall: async (id) => {
            const response = await fetch(`${getApiUrl()}/event-halls/${id}`, getFetchOptions('GET'));
            return handleResponse(response, 'Fetch event hall');
        },

        createEventHall: async (data) => {
            const response = await fetch(`${getApiUrl()}/event-halls`, getFetchOptions('POST', data));
            return handleResponse(response, 'Create event hall');
        },

        updateEventHall: async (id, data) => {
            const response = await fetch(`${getApiUrl()}/event-halls/${id}`, getFetchOptions('PATCH', data));
            return handleResponse(response, 'Update event hall');
        },

        deleteEventHall: async (id) => {
            const response = await fetch(`${getApiUrl()}/event-halls/${id}`, getFetchOptions('DELETE'));
            return handleResponse(response, 'Delete event hall');
        }
    };
})();
