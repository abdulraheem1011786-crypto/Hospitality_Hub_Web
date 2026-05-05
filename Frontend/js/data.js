// Data loading and venue management
const apiBase = '/api';

async function loadVenues() {
    try {
        const [hotelsRes, teaRes, hallsRes] = await Promise.all([
            fetch(`${apiBase}/hotels`),
            fetch(`${apiBase}/high-tea`),
            fetch(`${apiBase}/event-halls`),
        ]);

        const hotels = hotelsRes.ok ? (await hotelsRes.json()).data || [] : [];
        const highTea = teaRes.ok ? (await teaRes.json()).data || [] : [];
        const eventHalls = hallsRes.ok ? (await hallsRes.json()).data || [] : [];

        renderVenues('hotelsContainer', hotels, 'hotel');
        renderVenues('highTeaContainer', highTea, 'high-tea');
        renderVenues('eventHallsContainer', eventHalls, 'event-hall');

        // Update stats
        updateStats(hotels.length, highTea.length, eventHalls.length);
    } catch (error) {
        console.error('Error loading venues:', error);
    }
}

function updateStats(hotelsCount, highTeaCount, eventHallsCount) {
    const totalVenues = hotelsCount + highTeaCount + eventHallsCount;

    // Update stat numbers with data-target attributes
    const venueStat = document.querySelector('.stat-number[data-target]');
    if (venueStat) {
        venueStat.dataset.target = totalVenues;
        venueStat.textContent = totalVenues;
    }

    // You can add more specific stats if needed
}

function renderVenues(containerId, venues, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    if (!venues.length) {
        container.innerHTML = '<div class="col-12 text-center text-muted"><p>No venues available.</p></div>';
        return;
    }

    venues.forEach(venue => {
        const priceLabel = type === 'hotel'
            ? `PKR ${venue.price_per_night?.toLocaleString() || '0'} / night`
            : type === 'high-tea'
                ? `PKR ${venue.price_per_head?.toLocaleString() || '0'} per head`
                : `PKR ${venue.price_full_day?.toLocaleString() || '0'} full day`;

        // Get primary image or first image
        let imageUrl = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';
        if (venue.primary_image) {
            imageUrl = venue.primary_image;
        } else if (venue.images && venue.images.length > 0) {
            try {
                const images = typeof venue.images === 'string' ? JSON.parse(venue.images) : venue.images;
                if (images.length > 0) {
                    // For now, use a placeholder since actual images might not be uploaded
                    imageUrl = `https://images.unsplash.com/photo-${type === 'hotel' ? '1571896349849' : type === 'high-tea' ? '1541167760' : '1519167757'}?auto=format&fit=crop&w=800&q=80`;
                }
            } catch (e) {
                console.warn('Error parsing venue images:', e);
            }
        }

        const card = document.createElement('div');
        card.className = 'venue-card';

        const ratingHtml = type === 'hotel' && venue.rating
            ? `<div class="venue-rating"><i class="fas fa-star"></i> ${venue.rating}</div>`
            : '';

        const capacityHtml = (type === 'high-tea' || type === 'event-hall') && venue.capacity
            ? `<div class="venue-capacity"><i class="fas fa-users"></i> ${venue.capacity} guests</div>`
            : '';

        // Parse amenities if it's a string
        let amenities = [];
        if (venue.amenities) {
            try {
                amenities = typeof venue.amenities === 'string' ? JSON.parse(venue.amenities) : venue.amenities;
            } catch (e) {
                console.warn('Error parsing venue amenities:', e);
            }
        }

        const amenitiesHtml = amenities.length > 0
            ? `<div class="venue-amenities"><i class="fas fa-concierge-bell"></i> ${amenities.slice(0, 3).join(', ')}${amenities.length > 3 ? '...' : ''}</div>`
            : '';

        card.innerHTML = `
            <div class="venue-card-image">
                <img src="${imageUrl}" alt="${venue.name}" loading="lazy">
                <div class="venue-card-overlay"></div>
                <div class="venue-card-badge">
                    ${type === 'hotel' ? 'Hotel' : type === 'high-tea' ? 'High Tea' : 'Event Hall'}
                </div>
            </div>
            <div class="venue-card-body">
                <h3 class="venue-card-name">${venue.name}</h3>
                <p class="venue-card-location"><i class="fas fa-map-marker-alt"></i> ${venue.location}</p>
                <p class="venue-card-description">${venue.description || 'No description available.'}</p>
                <div class="venue-card-meta">
                    ${ratingHtml}
                    ${capacityHtml}
                    ${amenitiesHtml}
                    <div class="venue-price">${priceLabel}</div>
                </div>
                <div class="venue-card-actions">
                    <button class="btn-primary" onclick="bookVenue('${type}', ${venue.id})">
                        <i class="fas fa-calendar-check"></i> Book Now
                    </button>
                    <button class="btn-secondary" onclick="viewVenueDetails('${type}', ${venue.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function bookVenue(type, venueId) {
    const user = JSON.parse(localStorage.getItem('hospitalityHubUser'));
    if (!user) {
        alert('Please log in to make a booking');
        window.location.href = 'login.html';
        return;
    }
    alert(`Booking functionality for ${type} venue ID ${venueId} coming soon!`);
}

function viewVenueDetails(type, venueId) {
    // For now, just show an alert. Later this could open a modal or navigate to detail page
    alert(`Viewing details for ${type} venue ID ${venueId}`);
}
