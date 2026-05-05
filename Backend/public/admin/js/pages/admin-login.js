// Admin Login Page
const AdminLoginPage = (() => {
    return {
        render: () => `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <h1>Admin Login</h1>
                        <p>Hospitality Hub Admin Dashboard</p>
                    </div>

                    <form id="loginForm" class="login-form">
                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" required placeholder="admin@hospitalityhub.pk">
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required placeholder="Enter your password">
                        </div>

                        <button type="submit" class="btn-login-submit">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </button>

                        <div id="errorMessage" class="error-message" style="display: none;"></div>
                    </form>

                    <div class="login-footer">
                        <p>Demo Credentials:</p>
                        <p class="demo-cred">Email: admin@hospitalityhub.pk</p>
                        <p class="demo-cred">Password: admin123</p>
                    </div>
                </div>
            </div>
        `,

        init: () => {
            const form = document.getElementById('loginForm');
            const errorMessage = document.getElementById('errorMessage');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                try {
                    errorMessage.style.display = 'none';
                    await AdminAuthService.login(email, password);
                    window.location.hash = '#/admin/dashboard';
                } catch (error) {
                    errorMessage.textContent = error.message;
                    errorMessage.style.display = 'block';
                }
            });
        }
    };
})();
