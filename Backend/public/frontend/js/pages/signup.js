// Sign Up Page
import authService from '../services/auth.js';

const signupPage = {
    async init() {
        this.setupFormHandling();
    },

    render() {
        const container = document.createElement('div');
        container.className = 'auth-page signup-page';

        container.innerHTML = `
            <div class="auth-container">
                <div class="auth-card">
                    <div class="auth-header">
                        <div class="auth-logo">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <h1>Create Account</h1>
                        <p>Join our community and start booking amazing venues</p>
                    </div>

                    <form id="signupForm" class="auth-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="firstName">First Name</label>
                                <input type="text" id="firstName" name="firstName" required placeholder="John">
                                <span class="error-message"></span>
                            </div>

                            <div class="form-group">
                                <label for="lastName">Last Name</label>
                                <input type="text" id="lastName" name="lastName" required placeholder="Doe">
                                <span class="error-message"></span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="email">Email Address</label>
                            <input type="email" id="email" name="email" required placeholder="your@email.com">
                            <span class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" placeholder="+92 300 1234567">
                            <span class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required placeholder="••••••••">
                            <div class="password-strength">
                                <div class="strength-bar" id="strengthBar"></div>
                            </div>
                            <small id="strengthText" class="strength-text"></small>
                            <span class="error-message"></span>
                        </div>

                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="••••••••">
                            <span class="error-message"></span>
                        </div>

                        <div class="form-group checkbox">
                            <input type="checkbox" id="terms" name="terms" required>
                            <label for="terms">I agree to the <a href="#" target="_blank">Terms of Service</a> and <a href="#" target="_blank">Privacy Policy</a></label>
                            <span class="error-message"></span>
                        </div>

                        <button type="submit" class="btn-submit">
                            <span>Create Account</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>

                        <div id="formError" class="form-error" style="display: none;"></div>
                    </form>

                    <div class="auth-footer">
                        <p>Already have an account? <a href="#login" class="auth-link">Log in here</a></p>
                    </div>
                </div>

                <div class="auth-features">
                    <div class="feature">
                        <i class="fas fa-gift"></i>
                        <h4>Exclusive Offers</h4>
                        <p>Access special deals and discounts as a member</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-calendar-check"></i>
                        <h4>Easy Bookings</h4>
                        <p>Manage all your reservations in one place</p>
                    </div>
                    <div class="feature">
                        <i class="fas fa-star"></i>
                        <h4>Loyalty Rewards</h4>
                        <p>Earn points with every booking</p>
                    </div>
                </div>
            </div>
        `;

        return container;
    },

    setupFormHandling() {
        const form = document.getElementById('signupForm');
        if (!form) return;

        // Password strength indicator
        const passwordInput = form.password;
        if (passwordInput) {
            passwordInput.addEventListener('input', () => this.checkPasswordStrength(passwordInput.value));
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSignup(form);
        });
    },

    checkPasswordStrength(password) {
        const strengthBar = document.getElementById('strengthBar');
        const strengthText = document.getElementById('strengthText');

        if (!strengthBar || !strengthText) return;

        let strength = 0;
        let text = 'Weak';
        let color = '#e74c3c';

        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[@$!%*?&]/.test(password)) strength++;

        if (strength <= 1) {
            text = 'Weak';
            color = '#e74c3c';
        } else if (strength <= 2) {
            text = 'Fair';
            color = '#f39c12';
        } else if (strength <= 3) {
            text = 'Good';
            color = '#3498db';
        } else if (strength <= 4) {
            text = 'Strong';
            color = '#27ae60';
        } else {
            text = 'Very Strong';
            color = '#16a085';
        }

        strengthBar.style.width = `${(strength / 5) * 100}%`;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    },

    async handleSignup(form) {
        const firstName = form.firstName.value.trim();
        const lastName = form.lastName.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmPassword.value;
        const terms = form.terms.checked;

        const formError = document.getElementById('formError');
        const submitBtn = form.querySelector('button[type="submit"]');

        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            formError.textContent = 'Please fill in all required fields';
            formError.style.display = 'block';
            return;
        }

        if (password !== confirmPassword) {
            formError.textContent = 'Passwords do not match';
            formError.style.display = 'block';
            return;
        }

        if (password.length < 6) {
            formError.textContent = 'Password must be at least 6 characters';
            formError.style.display = 'block';
            return;
        }

        if (!terms) {
            formError.textContent = 'You must agree to the terms and conditions';
            formError.style.display = 'block';
            return;
        }

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Creating Account...</span><i class="fas fa-spinner fa-spin"></i>';

            const userData = {
                name: `${firstName} ${lastName}`,
                email,
                phone,
                password,
                password_confirmation: confirmPassword
            };

            await authService.signup(userData);

            // Success
            formError.style.display = 'none';
            setTimeout(() => {
                window.location.hash = '#bookings';
            }, 500);
        } catch (error) {
            formError.textContent = error.message || 'Signup failed. Please try again.';
            formError.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Create Account</span><i class="fas fa-arrow-right"></i>';
        }
    },

    destroy() {
        // Cleanup
    }
};

export default signupPage;
