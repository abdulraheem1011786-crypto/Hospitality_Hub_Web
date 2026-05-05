// Admin Dashboard Main Script
document.addEventListener('DOMContentLoaded', () => {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Are you sure you want to logout?')) {
                AdminAuthService.logout();
            }
        });
    }

    // Update user name in navbar
    const user = AdminAuthService.getUser();
    const userName = document.getElementById('userName');
    if (userName && user) {
        userName.textContent = user.name;
    }

    // Check if user is authenticated
    if (!AdminAuthService.isAuthenticated() && !window.location.hash.includes('login')) {
        window.location.hash = '#/admin/login';
    }
});
