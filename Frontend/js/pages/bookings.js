// My Bookings Page
import authService from '../services/auth.js';
import apiService from '../services/api.js';

// Mock bookings data for now
const mockBookings = [
    {
        id: 1,
        venue: 'Pearl Continental Lahore',
        type: 'Hotel',
        checkIn: '2024-05-15',
        checkOut: '2024-05-18',
        guests: 2,
        totalPrice: 54000,
        status: 'Confirmed',
        statusColor: 'success',
        image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 2,
        venue: 'Monal Restaurant - High Tea',
        type: 'High-Tea',
        date: '2024-04-20',
        time: '3:00 PM',
        guests: 4,
        totalPrice: 10000,
        status: 'Pending',
        statusColor: 'warning',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80'
    },
    {
        id: 3,
        venue: 'Grand Ballroom Lahore',
        type: 'Event Hall',
        date: '2024-06-10',
        duration: 'Full Day',
        capacity: 300,
        totalPrice: 90000,
        status: 'Completed',
        statusColor: 'secondary',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    }
];

const bookingsPage = {
    bookings: mockBookings,

    async init() {
        const isAuthenticated = authService.isAuthenticated();
        if (!isAuthenticated) {
            window.location.hash = '#login';
            return;
        }

        this.setupBookingsHandling();
        await this.loadBookings();
    },

    render() {
        const container = document.createElement('div');
        container.className = 'bookings-page';

        const isAuthenticated = authService.isAuthenticated();
        const user = authService.getUser();

        if (!isAuthenticated) {
            container.innerHTML = `
                <div class="container py-5">
                    <div class="alert alert-info text-center">
                        <p>Please log in to view your bookings</p>
                        <a href="#login" class="btn btn-primary">Go to Login</a>
                    </div>
                </div>
            `;
            return container;
        }

        container.innerHTML = `
            <div class="bookings-header">
                <div class="container">
                    <h1>My Bookings</h1>
                    <p>Manage and track all your reservations</p>
                </div>
            </div>

            <div class="container-lg bookings-content">
                <!-- Filter Tabs -->
                <div class="booking-filters">
                    <button class="filter-btn active" data-filter="all">
                        <i class="fas fa-list"></i> All Bookings
                    </button>
                    <button class="filter-btn" data-filter="confirmed">
                        <i class="fas fa-check-circle"></i> Confirmed
                    </button>
                    <button class="filter-btn" data-filter="pending">
                        <i class="fas fa-hourglass-half"></i> Pending
                    </button>
                    <button class="filter-btn" data-filter="completed">
                        <i class="fas fa-archive"></i> Completed
                    </button>
                </div>

                <!-- Bookings List -->
                <div id="bookingsList" class="bookings-list">
                    <!-- Bookings will be loaded here -->
                </div>

                <!-- New Booking Button -->
                <div class="new-booking-section">
                    <a href="#" class="btn-new-booking">
                        <i class="fas fa-plus-circle"></i> Make a New Booking
                    </a>
                </div>
            </div>
        `;

        return container;
    },

    setupBookingsHandling() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.closest('.filter-btn').classList.add('active');
                this.renderBookings(e.target.closest('.filter-btn').getAttribute('data-filter'));
            });
        });

        const newBookingBtn = document.querySelector('.btn-new-booking');
        if (newBookingBtn) {
            newBookingBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = '#';
            });
        }
    },

    async loadBookings() {
        try {
            // In production, fetch from API
            // this.bookings = await apiService.getBookings();
            this.renderBookings('all');
        } catch (error) {
            console.error('Error loading bookings:', error);
        }
    },

    renderBookings(filter = 'all') {
        const bookingsList = document.getElementById('bookingsList');
        if (!bookingsList) return;

        let filteredBookings = this.bookings;
        if (filter !== 'all') {
            filteredBookings = this.bookings.filter(b => b.status.toLowerCase() === filter);
        }

        if (!filteredBookings.length) {
            bookingsList.innerHTML = `
                <div class="no-bookings">
                    <i class="fas fa-inbox"></i>
                    <h3>No bookings found</h3>
                    <p>You don't have any ${filter === 'all' ? '' : filter} bookings yet</p>
                    <a href="#" class="btn btn-primary">Start Exploring</a>
                </div>
            `;
            return;
        }

        bookingsList.innerHTML = filteredBookings.map((booking, index) => `
            <div class="booking-card animate-card" style="animation-delay: ${index * 0.1}s">
                <div class="booking-image">
                    <img src="${booking.image}" alt="${booking.venue}">
                    <span class="booking-type">${booking.type}</span>
                </div>

                <div class="booking-details">
                    <div class="booking-header-info">
                        <h4>${booking.venue}</h4>
                        <span class="booking-status badge-${booking.statusColor}">
                            ${booking.status}
                        </span>
                    </div>

                    <div class="booking-dates">
                        ${booking.checkIn ? `
                            <div class="date-item">
                                <i class="fas fa-calendar-check"></i>
                                <div>
                                    <small>Check-in: ${booking.checkIn}</small>
                                    <strong>${booking.checkIn}</strong>
                                </div>
                            </div>
                            <div class="date-item">
                                <i class="fas fa-calendar-times"></i>
                                <div>
                                    <small>Check-out: ${booking.checkOut}</small>
                                    <strong>${booking.checkOut}</strong>
                                </div>
                            </div>
                        ` : `
                            <div class="date-item">
                                <i class="fas fa-calendar"></i>
                                <div>
                                    <small>Date</small>
                                    <strong>${booking.date}</strong>
                                </div>
                            </div>
                            <div class="date-item">
                                <i class="fas fa-clock"></i>
                                <div>
                                    <small>Time</small>
                                    <strong>${booking.time || booking.duration}</strong>
                                </div>
                            </div>
                        `}
                    </div>

                    <div class="booking-info">
                        <span><i class="fas fa-users"></i> ${booking.guests || booking.capacity} ${booking.guests ? 'guests' : 'capacity'}</span>
                        <span><i class="fas fa-tag"></i> PKR ${booking.totalPrice.toLocaleString()}</span>
                    </div>

                    <div class="booking-actions">
                        <button class="btn-action btn-view">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        ${booking.status === 'Confirmed' ? `
                            <button class="btn-action btn-modify">
                                <i class="fas fa-edit"></i> Modify
                            </button>
                            <button class="btn-action btn-cancel">
                                <i class="fas fa-times"></i> Cancel
                            </button>
                        ` : ''}
                        ${booking.status === 'Pending' ? `
                            <button class="btn-action btn-confirm">
                                <i class="fas fa-check"></i> Confirm
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    },

    destroy() {
        // Cleanup
    }
};

export default bookingsPage;
