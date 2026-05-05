// Login Page
import authService from '../services/auth.js';

const loginPage = {
    async init() {
        this.setupFormHandling();
    },

    render() {
        const container = document.createElement('div');
        container.className = 'auth-page login-page';
        
        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getUser();

        if (isAuthenticated && user) {
            container.innerHTML = `
                <div class="auth-container">
                    <div class="auth-card already-logged-in">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Already Logged In</h2>
                        <p>Welcome back, <strong>${user.name}</strong></p>
                        <p class="email">${user.email}</p>
                        <div class="already-logged-actions">
                            <button class="btn-primary" onclick="window.location.hash='#bookings'">
                                <i class="fas fa-calendar"></i> View My Bookings
                            </button>
                            <button class="btn-secondary" onclick="window.location.hash='#profile'">
                                <i class="fas fa-user"></i> Go to Profile
                            </button>
                            <button class="btn-logout">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="auth-container">
                    <div class="auth-card">
                        <div class="auth-header">
                            <div class="auth-logo">
                                <i class="fas fa-hotel"></i>
                            </div>
                            <h1>Welcome Back</h1>
                            <p>Log in to your account to manage bookings</p>
                        </div>

                        <form id="loginForm" class="auth-form">
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" required placeholder="your@email.com">
                                <span class="error-message"></span>
                            </div>

                            <div class="form-group">
                                <label for="password">Password</label>
                                <input type="password" id="password" name="password" required placeholder="••••••••">
                                <span class="error-message"></span>
                            </div>

                            <div class="form-remember">
                                <input type="checkbox" id="remember" name="remember">
                                <label for="remember">Remember me</label>
                            </div>

                            <button type="submit" class="btn-submit">
                                <span>Log In</span>
                                <i class="fas fa-arrow-right"></i>
                            </button>

                            <div id="formError" class="form-error" style="display: none;"></div>
                        </form>

                        <div class="auth-footer">
                            <p>Don't have an account? <a href="#signup" class="auth-link">Sign up here</a></p>
                            <a href="#" class="forgot-password">Forgot your password?</a>
                        </div>
                    </div>

                    <div class="auth-features">
                        <div class="feature">
                            <i class="fas fa-lock"></i>
                            <h4>Secure & Safe</h4>
                            <p>Your data is protected with enterprise-grade encryption</p>
                        </div>
                        <div class="feature">
                            <i class="fas fa-zap"></i>
                            <h4>Quick Access</h4>
                            <p>Instant booking confirmations and easy management</p>
                        </div>
                        <div class="feature">
                            <i class="fas fa-headset"></i>
                            <h4>24/7 Support</h4>
                            <p>Our team is always here to help you</p>
                        </div>
                    </div>
                </div>
            `;
        }

        return container;
    },

    setupFormHandling() {
        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await authService.logout();
                window.location.hash = '#';
            });
        }

        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin(form);
        });
    },

    async handleLogin(form) {
        const email = form.email.value.trim();
        const password = form.password.value;
        const formError = document.getElementById('formError');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validation
        if (!email || !password) {
            formError.textContent = 'Please fill in all fields';
            formError.style.display = 'block';
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Logging in...</span><i class="fas fa-spinner fa-spin"></i>';

            const response = await authService.login(email, password);

            // Success
            formError.style.display = 'none';
            setTimeout(() => {
                window.location.hash = '#bookings';
            }, 500);
        } catch (error) {
            formError.textContent = error.message || 'Login failed. Please try again.';
            formError.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Log In</span><i class="fas fa-arrow-right"></i>';
        }
    },

    destroy() {
        // Cleanup
    }
};

export default loginPage;
