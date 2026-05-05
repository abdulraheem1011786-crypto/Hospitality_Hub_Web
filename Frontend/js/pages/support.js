// Support Page
import apiService from '../services/api.js';

const supportPage = {
    async init() {
        this.setupSupportHandling();
    },

    render() {
        const container = document.createElement('div');
        container.className = 'support-page';

        container.innerHTML = `
            <div class="support-header">
                <div class="container">
                    <h1>Support & Help</h1>
                    <p>We're here to help you with any questions or issues</p>
                </div>
            </div>

            <div class="container-lg support-content">
                <div class="support-grid">
                    <!-- Quick Help Cards -->
                    <div class="help-cards">
                        <div class="help-card">
                            <div class="card-icon">
                                <i class="fas fa-headset"></i>
                            </div>
                            <h3>24/7 Support</h3>
                            <p>Chat with our support team anytime</p>
                            <button class="btn-help">Start Chat</button>
                        </div>

                        <div class="help-card">
                            <div class="card-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <h3>Call Us</h3>
                            <p>+92 300 1234567</p>
                            <button class="btn-help">Call Now</button>
                        </div>

                        <div class="help-card">
                            <div class="card-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <h3>Email Support</h3>
                            <p>support@hospitalityhub.pk</p>
                            <button class="btn-help">Send Email</button>
                        </div>
                    </div>

                    <!-- Main Support Content -->
                    <div class="support-main">
                        <!-- FAQ Section -->
                        <div class="support-section">
                            <h2>Frequently Asked Questions</h2>
                            <div class="faq-list">
                                <div class="faq-item">
                                    <button class="faq-question">
                                        <span>How do I make a booking?</span>
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="faq-answer">
                                        <p>
                                            To make a booking:
                                            <ol>
                                                <li>Browse our hotels, high-tea venues, or event halls</li>
                                                <li>Click "Book Now" on your preferred venue</li>
                                                <li>Select your dates and details</li>
                                                <li>Complete the payment</li>
                                                <li>Confirmation will be sent to your email</li>
                                            </ol>
                                        </p>
                                    </div>
                                </div>

                                <div class="faq-item">
                                    <button class="faq-question">
                                        <span>How can I modify my booking?</span>
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="faq-answer">
                                        <p>
                                            To modify your booking:
                                            <ol>
                                                <li>Go to "My Bookings" in your profile</li>
                                                <li>Select the booking you want to modify</li>
                                                <li>Click the "Modify" button</li>
                                                <li>Update your dates or details</li>
                                                <li>Any price changes will be calculated automatically</li>
                                            </ol>
                                        </p>
                                    </div>
                                </div>

                                <div class="faq-item">
                                    <button class="faq-question">
                                        <span>What is your cancellation policy?</span>
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="faq-answer">
                                        <p>
                                            Our cancellation policy:
                                            <ul>
                                                <li>Free cancellation up to 7 days before booking</li>
                                                <li>50% refund for cancellations 3-7 days before</li>
                                                <li>No refund for cancellations within 3 days</li>
                                                <li>Contact us for special circumstances</li>
                                            </ul>
                                        </p>
                                    </div>
                                </div>

                                <div class="faq-item">
                                    <button class="faq-question">
                                        <span>How do I pay for my booking?</span>
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="faq-answer">
                                        <p>
                                            We accept multiple payment methods:
                                            <ul>
                                                <li>Credit/Debit Cards (Visa, Mastercard)</li>
                                                <li>Bank Transfers</li>
                                                <li>Mobile Wallets (JazzCash, EasyPaisa)</li>
                                                <li>Cash on Arrival (for selected venues)</li>
                                            </ul>
                                        </p>
                                    </div>
                                </div>

                                <div class="faq-item">
                                    <button class="faq-question">
                                        <span>Are my payments secure?</span>
                                        <i class="fas fa-chevron-down"></i>
                                    </button>
                                    <div class="faq-answer">
                                        <p>
                                            Yes! We use industry-standard security measures:
                                            <ul>
                                                <li>SSL encryption for all transactions</li>
                                                <li>PCI DSS compliance</li>
                                                <li>Secure payment gateways</li>
                                                <li>Your data is never stored on our servers</li>
                                            </ul>
                                        </p>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Form Section -->
                        <div class="support-section">
                            <h2>Get in Touch</h2>
                            <p>Have a question or issue we haven't covered? Contact our support team.</p>

                            <form id="contactForm" class="contact-form">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="contactName">Full Name</label>
                                        <input type="text" id="contactName" name="name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="contactEmail">Email Address</label>
                                        <input type="email" id="contactEmail" name="email" required>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="subject">Subject</label>
                                    <select id="subject" name="subject" required>
                                        <option value="">Select a subject</option>
                                        <option value="booking">Booking Issues</option>
                                        <option value="payment">Payment Issues</option>
                                        <option value="cancellation">Cancellation Request</option>
                                        <option value="feedback">Feedback</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="message">Message</label>
                                    <textarea id="message" name="message" rows="6" required placeholder="Please describe your issue in detail..."></textarea>
                                </div>

                                <button type="submit" class="btn-submit">
                                    <span>Send Message</span>
                                    <i class="fas fa-paper-plane"></i>
                                </button>

                                <div id="formStatus" class="form-status" style="display: none;"></div>
                            </form>
                        </div>

                        <!-- Helpful Links -->
                        <div class="support-section">
                            <h2>Helpful Resources</h2>
                            <div class="links-grid">
                                <a href="#" class="resource-link">
                                    <i class="fas fa-book"></i>
                                    <span>Blog</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fas fa-map"></i>
                                    <span>Travel Guide</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fas fa-file-contract"></i>
                                    <span>Terms & Conditions</span>
                                </a>
                                <a href="#" class="resource-link">
                                    <i class="fas fa-shield-alt"></i>
                                    <span>Privacy Policy</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        return container;
    },

    setupSupportHandling() {
        // FAQ Accordion
        const faqQuestions = document.querySelectorAll('.faq-question');
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');

                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });

                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });

        // Contact Form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitContactForm(contactForm);
            });
        }

        // Help card buttons
        document.querySelectorAll('.btn-help').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const actions = ['chat', 'call', 'email'];
                this.handleHelpAction(actions[index]);
            });
        });
    },

    async submitContactForm(form) {
        const formData = new FormData(form);
        const status = document.getElementById('formStatus');
        const submitBtn = form.querySelector('button[type="submit"]');

        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

            // In production, send to API
            // await apiService.submitSupport(Object.fromEntries(formData));

            status.style.display = 'block';
            status.className = 'form-status success';
            status.innerHTML = '<i class="fas fa-check-circle"></i> Thank you! We\'ll get back to you soon.';

            form.reset();
            setTimeout(() => {
                status.style.display = 'none';
            }, 5000);
        } catch (error) {
            status.style.display = 'block';
            status.className = 'form-status error';
            status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error sending message. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
        }
    },

    handleHelpAction(action) {
        switch (action) {
            case 'chat':
                alert('Live chat would open here (integration needed)');
                break;
            case 'call':
                window.location.href = 'tel:+923001234567';
                break;
            case 'email':
                window.location.href = 'mailto:support@hospitalityhub.pk';
                break;
        }
    },

    destroy() {
        // Cleanup
    }
};

export default supportPage;
