// Data loading and venue management
const apiBase = '/api';

async function loadVenues() {
    console.log('Loading venues...');
    try {
        const [hotelsRes, teaRes, hallsRes] = await Promise.all([
            fetch(`${apiBase}/hotels`),
            fetch(`${apiBase}/high-tea`),
            fetch(`${apiBase}/event-halls`),
        ]);

        console.log('API responses:', hotelsRes.ok, teaRes.ok, hallsRes.ok);

        const hotels = hotelsRes.ok ? (await hotelsRes.json()).data || [] : [];
        const highTea = teaRes.ok ? (await teaRes.json()).data || [] : [];
        const eventHalls = hallsRes.ok ? (await hallsRes.json()).data || [] : [];

        console.log('Data counts:', hotels.length, highTea.length, eventHalls.length);

        renderVenues('hotelsContainer', hotels, 'hotel');
        renderVenues('highTeaContainer', highTea, 'high-tea');
        renderVenues('eventHallsContainer', eventHalls, 'event-hall');
    } catch (error) {
        console.error('Error loading venues:', error);
    }
}

function renderVenues(containerId, venues, type) {
    console.log(`Rendering ${type} venues:`, venues.length, 'items');
    const container = document.getElementById(containerId);
    console.log(`Container ${containerId}:`, container);
    if (!container) return;

    container.innerHTML = '';
    if (!venues.length) {
        container.innerHTML = '<div class="col-12 text-center text-muted"><p>No venues available.</p></div>';
        return;
    }

    venues.forEach(venue => {
        // Parse JSON fields
        let amenities = [];
        let images = [];
        try {
            amenities = JSON.parse(venue.amenities || '[]');
            images = JSON.parse(venue.images || '[]');
        } catch (e) {
            console.warn('Failed to parse JSON fields for venue:', venue.id);
        }

        const priceLabel = type === 'hotel'
            ? `PKR ${venue.price_per_night?.toLocaleString() || '0'} / night`
            : type === 'high-tea'
                ? `PKR ${venue.price_per_head?.toLocaleString() || '0'} per head`
                : `PKR ${venue.price_full_day?.toLocaleString() || '0'} full day`;

        const ratingHtml = venue.rating ? `<div class="venue-rating">★ ${venue.rating}</div>` : '';
        const capacityHtml = venue.capacity ? `<div class="venue-capacity">Capacity: ${venue.capacity}</div>` : '';
        const amenitiesHtml = amenities.length ? `<div class="venue-amenities">${amenities.join(' • ')}</div>` : '';
        const placeholderImage = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="400" height="240" fill="#111827"/><text x="50%" y="50%" fill="#9ca3af" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">No image available</text></svg>'
        );
        const imageSrc = images.length ? `/storage/uploads/venues/${type}/${images[0]}` : placeholderImage;
        const imageHtml = `<img src="${imageSrc}" alt="${venue.name}" class="venue-image" onerror="this.onerror=null;this.src='${placeholderImage}'">`;

        const card = document.createElement('div');
        card.className = 'glass-card venue-card';
        card.innerHTML = `
            ${imageHtml}
            <div class="venue-title">${venue.name}</div>
            <p class="venue-desc">${venue.description || 'No description available.'}</p>
            <div class="venue-meta">
                ${ratingHtml}
                ${capacityHtml}
                ${amenitiesHtml}
            </div>
            <div class="venue-price">${priceLabel}</div>
            <button class="btn-primary w-100 mt-3" onclick="bookVenue('${type}', ${venue.id})">
                Book Now
            </button>
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

// Call loadVenues when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadVenues);
} else {
    loadVenues();
}
