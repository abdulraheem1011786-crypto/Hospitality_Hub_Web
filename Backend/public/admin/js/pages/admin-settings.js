// Admin Settings Page
const AdminSettingsPage = (() => {
    return {
        render: () => {
            const user = AdminAuthService.getUser();
            return `
                <div class="settings-container">
                    <div class="page-header">
                        <h2>Settings</h2>
                    </div>

                    <div class="settings-card">
                        <h3>Account Information</h3>
                        <div class="info-field">
                            <label>Name:</label>
                            <p>${user?.name || 'N/A'}</p>
                        </div>
                        <div class="info-field">
                            <label>Email:</label>
                            <p>${user?.email || 'N/A'}</p>
                        </div>
                        <div class="info-field">
                            <label>Role:</label>
                            <p><span class="role-badge">${user?.role || 'N/A'}</span></p>
                        </div>
                    </div>

                    <div class="settings-card">
                        <h3>System Information</h3>
                        <div class="info-field">
                            <label>API Endpoint:</label>
                            <p>http://localhost/api/admin</p>
                        </div>
                        <div class="info-field">
                            <label>Version:</label>
                            <p>1.0.0</p>
                        </div>
                        <div class="info-field">
                            <label>Last Updated:</label>
                            <p>April 15, 2026</p>
                        </div>
                    </div>

                    <div class="settings-card danger">
                        <h3>Danger Zone</h3>
                        <p class="text-muted">These actions cannot be undone. Please proceed with caution.</p>
                        <button class="btn-logout" id="logoutBtnSettings">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>
            `;
        },

        init: () => {
            const logoutBtn = document.getElementById('logoutBtnSettings');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => {
                    if (confirm('Are you sure you want to logout?')) {
                        AdminAuthService.logout();
                    }
                });
            }
        }
    };
})();
