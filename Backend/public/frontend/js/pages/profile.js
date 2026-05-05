// Profile Page
import authService from '../services/auth.js';
import apiService from '../services/api.js';

const profilePage = {
    async init() {
        const isAuthenticated = authService.isAuthenticated();
        if (!isAuthenticated) {
            window.location.hash = '#login';
            return;
        }

        this.setupProfileHandling();
    },

    render() {
        const container = document.createElement('div');
        container.className = 'profile-page';

        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getUser();

        if (!isAuthenticated) {
            container.innerHTML = `
                <div class="container py-5">
                    <div class="alert alert-info text-center">
                        <p>Please log in to view your profile</p>
                        <a href="#login" class="btn btn-primary">Go to Login</a>
                    </div>
                </div>
            `;
            return container;
        }

        container.innerHTML = `
            <div class="profile-header">
                <div class="container">
                    <h1>My Profile</h1>
                    <p>Manage your personal information and preferences</p>
                </div>
            </div>

            <div class="container-lg profile-content">
                <div class="profile-grid">
                    <!-- Profile Sidebar -->
                    <div class="profile-sidebar">
                        <div class="profile-card">
                            <div class="profile-avatar">
                                <i class="fas fa-user-circle"></i>
                            </div>
                            <h3 class="profile-name">${user?.name || 'User'}</h3>
                            <p class="profile-email">${user?.email || 'user@example.com'}</p>
                            <button class="btn-upload-photo">
                                <i class="fas fa-camera"></i> Change Photo
                            </button>
                        </div>

                        <div class="profile-menu">
                            <button class="menu-item active" data-section="info">
                                <i class="fas fa-user"></i> Personal Info
                            </button>
                            <button class="menu-item" data-section="password">
                                <i class="fas fa-lock"></i> Security
                            </button>
                            <button class="menu-item" data-section="preferences">
                                <i class="fas fa-sliders-h"></i> Preferences
                            </button>
                            <button class="menu-item" data-section="notifications">
                                <i class="fas fa-bell"></i> Notifications
                            </button>
                        </div>
                    </div>

                    <!-- Profile Main Content -->
                    <div class="profile-main">
                        <!-- Personal Info Section -->
                        <div class="profile-section active" id="section-info">
                            <div class="section-header">
                                <h2>Personal Information</h2>
                                <p>Update your basic information</p>
                            </div>

                            <form id="profileForm" class="profile-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="fullName">Full Name</label>
                                        <input type="text" id="fullName" name="fullName" value="${user?.name || ''}" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email Address</label>
                                        <input type="email" id="email" name="email" value="${user?.email || ''}" readonly>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="phone">Phone Number</label>
                                        <input type="tel" id="phone" name="phone" placeholder="+92 300 1234567">
                                    </div>
                                    <div class="form-group">
                                        <label for="city">City</label>
                                        <input type="text" id="city" name="city" placeholder="Lahore">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="address">Address</label>
                                    <input type="text" id="address" name="address" placeholder="Street address">
                                </div>

                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="country">Country</label>
                                        <select id="country" name="country">
                                            <option value="">Select country</option>
                                            <option value="Pakistan">Pakistan</option>
                                            <option value="USA">USA</option>
                                            <option value="UK">UK</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="zipcode">ZIP Code</label>
                                        <input type="text" id="zipcode" name="zipcode" placeholder="54000">
                                    </div>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn-primary">Save Changes</button>
                                    <button type="reset" class="btn-secondary">Cancel</button>
                                </div>
                            </form>
                        </div>

                        <!-- Security Section -->
                        <div class="profile-section" id="section-password">
                            <div class="section-header">
                                <h2>Security Settings</h2>
                                <p>Manage your password and security options</p>
                            </div>

                            <form id="changePasswordForm" class="profile-form">
                                <div class="form-group">
                                    <label for="currentPassword">Current Password</label>
                                    <input type="password" id="currentPassword" name="currentPassword" required>
                                </div>

                                <div class="form-group">
                                    <label for="newPassword">New Password</label>
                                    <input type="password" id="newPassword" name="newPassword" required>
                                    <div class="password-strength">
                                        <div class="strength-bar" id="pwdStrengthBar"></div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="confirmNewPassword">Confirm New Password</label>
                                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" required>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn-primary">Update Password</button>
                                </div>
                            </form>

                            <div class="security-info mt-5">
                                <h4>Two-Factor Authentication</h4>
                                <p>Add an extra layer of security to your account</p>
                                <button class="btn-secondary">Enable 2FA</button>
                            </div>
                        </div>

                        <!-- Preferences Section -->
                        <div class="profile-section" id="section-preferences">
                            <div class="section-header">
                                <h2>Preferences</h2>
                                <p>Customize your experience</p>
                            </div>

                            <form class="profile-form">
                                <div class="preference-group">
                                    <label for="language">Language</label>
                                    <select id="language">
                                        <option value="english">English</option>
                                        <option value="urdu">Urdu</option>
                                    </select>
                                </div>

                                <div class="preference-group">
                                    <label for="currency">Currency</label>
                                    <select id="currency">
                                        <option value="pkr">Pakistani Rupee (PKR)</option>
                                        <option value="usd">US Dollar (USD)</option>
                                    </select>
                                </div>

                                <div class="preference-group">
                                    <label for="timezone">Timezone</label>
                                    <select id="timezone">
                                        <option value="utc+5">UTC+5 (Pakistan Standard Time)</option>
                                    </select>
                                </div>

                                <div class="form-actions">
                                    <button type="submit" class="btn-primary">Save Preferences</button>
                                </div>
                            </form>
                        </div>

                        <!-- Notifications Section -->
                        <div class="profile-section" id="section-notifications">
                            <div class="section-header">
                                <h2>Notification Settings</h2>
                                <p>Control how you receive updates</p>
                            </div>

                            <div class="notifications-list">
                                <div class="notification-item">
                                    <div>
                                        <h4>Booking Confirmations</h4>
                                        <p>Receive confirmation when your booking is confirmed</p>
                                    </div>
                                    <input type="checkbox" class="toggle" checked>
                                </div>

                                <div class="notification-item">
                                    <div>
                                        <h4>Promotional Offers</h4>
                                        <p>Get notified about special deals and promotions</p>
                                    </div>
                                    <input type="checkbox" class="toggle" checked>
                                </div>

                                <div class="notification-item">
                                    <div>
                                        <h4>Reminders</h4>
                                        <p>Get reminded about upcoming bookings</p>
                                    </div>
                                    <input type="checkbox" class="toggle" checked>
                                </div>

                                <div class="notification-item">
                                    <div>
                                        <h4>Newsletter</h4>
                                        <p>Receive weekly updates and travel tips</p>
                                    </div>
                                    <input type="checkbox" class="toggle">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Danger Zone -->
                <div class="danger-zone">
                    <h3>Danger Zone</h3>
                    <p>Permanent actions that cannot be undone</p>
                    <button class="btn-logout">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                    <button class="btn-delete">
                        <i class="fas fa-trash"></i> Delete Account
                    </button>
                </div>
            </div>
        `;

        return container;
    },

    setupProfileHandling() {
        // Section switching
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.target.closest('.menu-item').getAttribute('data-section');
                this.switchSection(section);
            });
        });

        // Form submission
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfile();
            });
        }

        const passwordForm = document.getElementById('changePasswordForm');
        if (passwordForm) {
            passwordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changePassword();
            });
        }

        // Logout
        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                if (confirm('Are you sure you want to logout?')) {
                    await authService.logout();
                    window.location.hash = '#';
                }
            });
        }

        // Delete account
        const deleteBtn = document.querySelector('.btn-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', async () => {
                if (confirm('Are you sure? This action cannot be undone.')) {
                    // Implement account deletion
                    alert('Account deletion is not yet implemented');
                }
            });
        }
    },

    switchSection(section) {
        document.querySelectorAll('.profile-section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${section}`).classList.add('active');

        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        document.querySelector(`[data-section="${section}"]`).classList.add('active');
    },

    saveProfile() {
        alert('Profile changes would be saved here (API integration needed)');
    },

    changePassword() {
        alert('Password change would be processed here (API integration needed)');
    },

    destroy() {
        // Cleanup
    }
};

export default profilePage;
