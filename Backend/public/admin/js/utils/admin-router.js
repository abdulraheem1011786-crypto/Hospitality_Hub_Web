// Admin Router
const AdminRouter = (() => {
    const contentArea = document.getElementById('app-content');

    const routes = {
        '/admin/login': AdminLoginPage,
        '/admin/dashboard': AdminDashboardPage,
        '/admin/hotels': AdminHotelsPage,
        '/admin/high-tea': AdminHighTeaPage,
        '/admin/event-halls': AdminEventHallsPage,
        '/admin/bookings': AdminBookingsPage,
        '/admin/settings': AdminSettingsPage,
    };

    const checkAuth = () => {
        if (!AdminAuthService.isAuthenticated()) {
            window.location.hash = '#/admin/login';
            return false;
        }
        return true;
    };

    const updateNavigation = (route) => {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-route="${route}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    };

    const navigate = (route) => {
        // Special handling for login page
        if (route === '/admin/login') {
            if (contentArea) {
                contentArea.innerHTML = AdminLoginPage.render();
                AdminLoginPage.init();
            }
            document.body.classList.add('login-page');
            return;
        }

        // Check authentication for other pages
        if (!checkAuth()) {
            return;
        }

        document.body.classList.remove('login-page');
        updateNavigation(route);

        const pageModule = routes[route];
        if (pageModule && contentArea) {
            contentArea.innerHTML = pageModule.render();
            pageModule.init();
        }
    };

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash || '#/admin/dashboard';
        const route = hash.replace('#', '');
        navigate(route);
    });

    return {
        init: () => {
            const hash = window.location.hash || '#/admin/dashboard';
            const route = hash.replace('#', '');
            navigate(route);
        },
        navigate: navigate
    };
})();

// Initialize router when document is ready
document.addEventListener('DOMContentLoaded', () => {
    AdminRouter.init();
});
