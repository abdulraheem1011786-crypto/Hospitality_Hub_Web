// Admin Dashboard Page
const AdminDashboardPage = (() => {
    let stats = {
        hotels: 0,
        highTea: 0,
        eventHalls: 0,
        bookings: 0
    };

    return {
        render: () => `
            <div class="dashboard-container">
                <div class="page-header">
                    <h2>Dashboard</h2>
                    <p>Welcome to Hospitality Hub Admin Panel</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon hotel">
                            <i class="fas fa-hotel"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="hotelCount">${stats.hotels}</h3>
                            <p>Total Hotels</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon tea">
                            <i class="fas fa-tea"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="teaCount">${stats.highTea}</h3>
                            <p>High-Tea Venues</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon event">
                            <i class="fas fa-calendar"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="eventCount">${stats.eventHalls}</h3>
                            <p>Event Halls</p>
                        </div>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon booking">
                            <i class="fas fa-book"></i>
                        </div>
                        <div class="stat-content">
                            <h3 id="bookingCount">${stats.bookings}</h3>
                            <p>Total Bookings</p>
                        </div>
                    </div>
                </div>

                <div class="quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-buttons">
                        <a href="#/admin/hotels" class="action-btn">
                            <i class="fas fa-plus"></i> Add Hotel
                        </a>
                        <a href="#/admin/high-tea" class="action-btn">
                            <i class="fas fa-plus"></i> Add High-Tea Venue
                        </a>
                        <a href="#/admin/event-halls" class="action-btn">
                            <i class="fas fa-plus"></i> Add Event Hall
                        </a>
                        <a href="#/admin/bookings" class="action-btn">
                            <i class="fas fa-list"></i> View Bookings
                        </a>
                    </div>
                </div>
            </div>
        `,

        init: async () => {
            try {
                const hotels = await AdminAPIService.getHotels();
                const highTea = await AdminAPIService.getHighTeaVenues();
                const eventHalls = await AdminAPIService.getEventHalls();

                stats.hotels = hotels.length || 0;
                stats.highTea = highTea.length || 0;
                stats.eventHalls = eventHalls.length || 0;

                document.getElementById('hotelCount').textContent = stats.hotels;
                document.getElementById('teaCount').textContent = stats.highTea;
                document.getElementById('eventCount').textContent = stats.eventHalls;
                document.getElementById('bookingCount').textContent = stats.hotels + stats.highTea + stats.eventHalls;
            } catch (error) {
                console.error('Error loading dashboard stats:', error);
            }
        }
    };
})();
