// Admin Authentication Service
const AdminAuthService = (() => {
    const getApiUrl = () => {
        const protocol = window.location.protocol;
        const host = window.location.host;
        // Use same host for API calls (proxied through Apache)
        return `${protocol}//${host}/api/auth`;
    };

    return {
        login: async (email, password) => {
            try {
                const API_URL = getApiUrl();
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    throw new Error('Invalid credentials');
                }

                const data = await response.json();
                
                // Check if user is admin or vendor
                if (data.user && data.user.role !== 'admin' && data.user.role !== 'vendor') {
                    throw new Error('Access denied. Admin or Vendor role required.');
                }

                localStorage.setItem('adminUser', JSON.stringify(data.user || data));
                localStorage.setItem('adminToken', data.token || '');
                return data;
            } catch (error) {
                throw error;
            }
        },

        logout: async () => {
            try {
                const API_URL = getApiUrl();
                await fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${AdminAuthService.getToken()}`
                    },
                    credentials: 'include'
                });
            } catch (error) {
                console.error('Logout error:', error);
            }

            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminToken');
            window.location.hash = '#/admin/login';
        },

        getUser: () => {
            const user = localStorage.getItem('adminUser');
            return user ? JSON.parse(user) : null;
        },

        getToken: () => {
            return localStorage.getItem('adminToken');
        },

        isAuthenticated: () => {
            return !!localStorage.getItem('adminUser');
        },

        isAdmin: () => {
            const user = AdminAuthService.getUser();
            return user && (user.role === 'admin' || user.role === 'vendor');
        }
    };
})();
