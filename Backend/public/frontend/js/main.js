const apiBase = '/api';
const userKey = 'hospitalityHubUser';
let hotels = [];
let highTeaVenues = [];
let eventHalls = [];
let bookings = [];
let currentUser = JSON.parse(localStorage.getItem(userKey)) || null;

function renderCards(items, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!items.length) {
        container.innerHTML = '<div class="col-12 text-center text-muted"><p>No matching venues found.</p></div>';
        return;
    }
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'glass-card';
        const priceLabel = type === 'hotel'
            ? `PKR ${item.price_per_night.toLocaleString()} / night`
            : type === 'high-tea'
                ? `PKR ${item.price_per_head.toLocaleString()} per head`
                : `PKR ${item.price_full_day.toLocaleString()} full day`;

        card.innerHTML = `
            <div>
                <img src="${item.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'}" style="width:100%;height:180px;object-fit:cover;border-radius:var(--radius-md);margin-bottom:14px;" alt="${item.name}">
                <h5 class="venue-title">${item.name}</h5>
                <p style="font-size:0.9rem;color:var(--slate-5);margin-bottom:8px;">${item.location}</p>
                <p class="venue-desc">${item.description}</p>
                <div style="margin:14px 0;">
                    <span class="venue-price">${priceLabel}</span>
                    ${type === 'hotel' ? `<span style="color:var(--cyan);margin-left:10px;">${item.rating} ★</span>` : ''}
                </div>
                <div style="display:flex;gap:10px;">
                    <button class="btn-primary outline" onclick="openDetail('${item.name}')">Explore</button>
                    <button class="btn-primary" onclick="bookNow('${type}', ${item.id})">Book</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderBookings() {
    const container = document.getElementById('bookingList');
    container.innerHTML = '';
    if (!bookings.length) {
        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;color:var(--slate-5);">
                <p>No bookings yet. Start exploring venues and reserve your stay.</p>
            </div>
        `;
        return;
    }

    bookings.forEach(booking => {
        const item = document.createElement('div');
        item.className = 'glass-card';
        item.innerHTML = `
            <h5 class="venue-title">${booking.title}</h5>
            <p style="color:var(--slate-5);margin-bottom:8px;">${booking.subtitle}</p>
            <p class="venue-desc">${booking.details}</p>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:14px;">
                <span class="venue-price">${booking.price}</span>
                <span style="padding:4px 12px;background:var(--cyan-soft);color:var(--cyan);border-radius:999px;font-size:0.85rem;">${booking.status}</span>
            </div>
        `;
        container.appendChild(item);
    });
}

function setUser(user) {
    currentUser = user;
    localStorage.setItem(userKey, JSON.stringify(user));
    updateAccountState();
    renderProfile();
    fetchBookings();
}

function clearUser() {
    currentUser = null;
    localStorage.removeItem(userKey);
    updateAccountState();
    renderProfile();
    bookings = [];
    renderBookings();
}

function updateAccountState() {
    const accountStatus = document.getElementById('accountStatus');
    const accountDetails = document.getElementById('accountDetails');
    const accountName = document.getElementById('accountName');
    const accountEmail = document.getElementById('accountEmail');

    if (!accountStatus) return;

    if (currentUser) {
        accountStatus.textContent = 'Logged in as:';
        accountDetails.classList.remove('hidden');
        accountName.textContent = currentUser.name;
        accountEmail.textContent = currentUser.email;
    } else {
        accountStatus.textContent = 'You are currently not logged in.';
        accountDetails.classList.add('hidden');
        accountName.textContent = '';
        accountEmail.textContent = '';
    }
}

async function loginUser() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'same-origin',
    });

    if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Login failed');
        return;
    }

    const user = await response.json();
    setUser(user);
    alert('Login successful.');
}

async function signupUser() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    if (!name || !email || !password) {
        alert('Please complete all signup fields.');
        return;
    }

    const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
        credentials: 'same-origin',
    });

    if (!response.ok) {
        const data = await response.json();
        alert(data.message || 'Signup failed');
        return;
    }

    const user = await response.json();
    setUser(user);
    alert('Signup successful. Welcome!');
}

async function fetchBookings() {
    try {
        if (!currentUser) {
            bookings = [];
            renderBookings();
            return;
        }

        const response = await fetch(`${apiBase}/bookings`, {
            credentials: 'same-origin',
        });
        if (!response.ok) {
            bookings = [];
            renderBookings();
            return;
        }
        const data = await response.json();
        bookings = data.map(booking => ({
            title: booking.details?.name || booking.bookable_type,
            subtitle: booking.bookable_type.split('\\').pop() + ' booking',
            details: `Booking date: ${booking.booking_date}`,
            price: `PKR ${Number(booking.total_price).toLocaleString()}`,
            status: booking.status,
        }));
        renderBookings();
    } catch (error) {
        console.warn('Could not load bookings:', error);
    }
}

function applyActiveNav() {
    const links = document.querySelectorAll('.nav-tab');
    const offset = 120;
    const fromTop = window.scrollY + offset;
    let currentId = 'home';
    document.querySelectorAll('section[id]').forEach(section => {
        if (section.offsetTop <= fromTop) {
            currentId = section.id;
        }
    });
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentId}`) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.addEventListener('scroll', () => {
    applyActiveNav();
});

function openDetail(name) {
    alert(`Explore ${name} in more detail soon.`);
}

async function bookNow(type, id) {
    if (!currentUser) {
        alert('Please log in before booking.');
        window.location.hash = '#login';
        return;
    }

    const item = type === 'hotel'
        ? hotels.find(h => h.id === id)
        : type === 'high-tea'
            ? highTeaVenues.find(h => h.id === id)
            : eventHalls.find(h => h.id === id);

    if (!item) {
        alert('Item not found for booking.');
        return;
    }

    const payload = {
        bookable_type: type === 'hotel' ? 'App\\Models\\Hotel' : type === 'high-tea' ? 'App\\Models\\HighTeaVenue' : 'App\\Models\\EventHall',
        bookable_id: id,
        booking_date: new Date().toISOString().split('T')[0],
        details: {
            type,
            name: item.name,
            location: item.location,
        },
        total_price: type === 'hotel' ? item.price_per_night : type === 'high-tea' ? item.price_per_head : item.price_full_day,
    };

    const response = await fetch(`${apiBase}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.text();
        alert(`Booking failed: ${error}`);
        return;
    }

    const booking = await response.json();
    bookings.unshift({
        title: item.name,
        subtitle: `${type.replace('-', ' ')} booking created`,
        details: `Booking date: ${booking.booking_date}`,
        price: `PKR ${Number(booking.total_price).toLocaleString()}`,
        status: booking.status,
    });
    renderBookings();
    window.location.hash = '#bookings';
}

async function loadData() {
    const query = document.getElementById('searchInput').value;
    const location = document.getElementById('locationFilter').value;
    const type = document.getElementById('typeFilter').value;

    const hotelUrl = new URL(`${apiBase}/hotels`, window.location.origin);
    const teaUrl = new URL(`${apiBase}/high-tea`, window.location.origin);
    const hallUrl = new URL(`${apiBase}/event-halls`, window.location.origin);
    if (location) {
        hotelUrl.searchParams.set('location', location);
        teaUrl.searchParams.set('location', location);
        hallUrl.searchParams.set('location', location);
    }
    if (query) {
        hotelUrl.searchParams.set('q', query);
        teaUrl.searchParams.set('q', query);
        hallUrl.searchParams.set('q', query);
    }

    const [hotelsRes, teaRes, hallsRes] = await Promise.all([
        fetch(hotelUrl),
        fetch(teaUrl),
        fetch(hallUrl),
    ]);

    hotels = hotelsRes.ok ? await hotelsRes.json() : [];
    highTeaVenues = teaRes.ok ? await teaRes.json() : [];
    eventHalls = hallsRes.ok ? await hallsRes.json() : [];

    const filtered = filterItems(query, location, type);
    renderCards(filtered.hotels, 'hotelsContainer', 'hotel');
    renderCards(filtered.highTea, 'highTeaContainer', 'high-tea');
    renderCards(filtered.eventHalls, 'eventHallsContainer', 'event-hall');
    await fetchBookings();
}

async function loadProfile() {
    try {
        const response = await fetch('/api/auth/profile', {
            credentials: 'same-origin',
        });
        if (!response.ok) {
            clearUser();
            return;
        }
        const user = await response.json();
        setUser(user);
    } catch (error) {
        console.warn('Unable to load profile:', error);
        renderProfile();
    }
}

function renderProfile() {
    const profileMessage = document.getElementById('profileMessage');
    const profileInfo = document.getElementById('profileInfo');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    const profileCreated = document.getElementById('profileCreated');

    if (!profileMessage) return;

    if (currentUser) {
        profileMessage.textContent = 'Your account is active. Here are your registered details:';
        profileInfo.classList.remove('hidden');
        profileName.textContent = currentUser.name;
        profileEmail.textContent = currentUser.email;
        profileCreated.textContent = currentUser.created_at ? new Date(currentUser.created_at).toLocaleDateString() : 'N/A';
    } else {
        profileMessage.textContent = 'Login to view your profile details and booking history.';
        profileInfo.classList.add('hidden');
    }
}

function filterItems(query, location, type) {
    const normalizedQuery = query.trim().toLowerCase();

    const match = (item) => {
        const text = `${item.name} ${item.location} ${item.description}`.toLowerCase();
        return !normalizedQuery || text.includes(normalizedQuery);
    };

    const byLocation = (item) => {
        return !location || item.location.toLowerCase().includes(location.toLowerCase());
    };

    const hotelsFiltered = hotels.filter(item => match(item) && byLocation(item));
    const highTeaFiltered = highTeaVenues.filter(item => match(item) && byLocation(item));
    const eventHallsFiltered = eventHalls.filter(item => match(item) && byLocation(item));

    if (type === 'hotel') {
        return { hotels: hotelsFiltered, highTea: [], eventHalls: [] };
    }

    if (type === 'high-tea') {
        return { hotels: [], highTea: highTeaFiltered, eventHalls: [] };
    }

    if (type === 'event-hall') {
        return { hotels: [], highTea: [], eventHalls: eventHallsFiltered };
    }

    return { hotels: hotelsFiltered, highTea: highTeaFiltered, eventHalls: eventHallsFiltered };
}

function updateFilters() {
    loadData();
}

document.addEventListener('DOMContentLoaded', () => {
    updateAccountState();
    loadData();
    renderBookings();

    const searchBtn = document.getElementById('searchBtn');
    const locationFilter = document.getElementById('locationFilter');
    const typeFilter = document.getElementById('typeFilter');
    const searchInput = document.getElementById('searchInput');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const profileRefreshBtn = document.getElementById('profileRefreshBtn');

    if (searchBtn) searchBtn.addEventListener('click', updateFilters);
    if (locationFilter) locationFilter.addEventListener('change', updateFilters);
    if (typeFilter) typeFilter.addEventListener('change', updateFilters);
    if (searchInput) searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            updateFilters();
        }
    });
    if (loginBtn) loginBtn.addEventListener('click', loginUser);
    if (signupBtn) signupBtn.addEventListener('click', signupUser);
    if (logoutBtn) logoutBtn.addEventListener('click', async () => {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'same-origin',
        });
        clearUser();
        alert('Logged out successfully.');
    });
    if (profileRefreshBtn) profileRefreshBtn.addEventListener('click', async () => {
        await loadProfile();
        alert('Profile refreshed.');
    });
    applyActiveNav();

    loadProfile().then(loadData);
});
const hotels = [
    {
        name: 'Avari Lahore',
        location: 'Mall Road, Lahore',
        description: 'Luxury hotel in the heart of Lahore with modern amenities.',
        price: 15000,
        rating: 4.5,
        amenities: ['WiFi', 'Pool', 'Gym'],
        image: 'https://images.unsplash.com/photo-1501117716987-c8c74fbdfea7?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Pearl Continental Lahore',
        location: 'Mall Road, Lahore',
        description: 'Iconic hotel with heritage charm and contemporary comforts.',
        price: 18000,
        rating: 4.7,
        amenities: ['WiFi', 'Spa', 'Restaurant'],
        image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Hilton Lahore',
        location: 'Egerton Road, Lahore',
        description: 'International standard hotel with business facilities.',
        price: 20000,
        rating: 4.6,
        amenities: ['WiFi', 'Business Center', 'Gym'],
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    }
];

const highTeaVenues = [
    {
        name: 'Monal Restaurant',
        location: 'Lawrence Gardens, Lahore',
        description: 'Traditional high tea with scenic views.',
        price: 2500,
        timeSlots: ['Morning', 'Evening'],
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Cooco\'s Den',
        location: 'Gulberg, Lahore',
        description: 'Modern cafe with high tea options.',
        price: 2000,
        timeSlots: ['Afternoon', 'Evening'],
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80'
    }
];

const eventHalls = [
    {
        name: 'Grand Ballroom Lahore',
        location: 'DHA Phase 5, Lahore',
        description: 'Spacious hall for large events.',
        priceHalf: 50000,
        priceFull: 90000,
        capacity: 500,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80'
    },
    {
        name: 'Royal Event Hall',
        location: 'Gulberg, Lahore',
        description: 'Elegant venue for special occasions.',
        priceHalf: 40000,
        priceFull: 75000,
        capacity: 300,
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    }
];

const bookings = [];

function renderCards(items, containerId, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!items.length) {
        container.innerHTML = '<div class="col-12 text-center text-muted"><p>No matching venues found.</p></div>';
        return;
    }
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        const priceLabel = type === 'hotel'
            ? `PKR ${item.price.toLocaleString()} / night`
            : type === 'high-tea'
                ? `PKR ${item.price.toLocaleString()} per head`
                : `PKR ${item.priceFull.toLocaleString()} full day`;

        card.innerHTML = `
            <div class="card card-venue h-100" data-type="${type}">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="text-muted small mb-2">${item.location}</p>
                    <p class="card-text">${item.description}</p>
                    <div class="mb-3">
                        <span class="badge bg-secondary me-2">${priceLabel}</span>
                        ${type === 'hotel' ? `<span class="badge bg-success">${item.rating} ★</span>` : ''}
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <button class="btn btn-outline-light btn-sm" onclick="openDetail('${item.name}')">Explore</button>
                        <button class="btn btn-primary btn-sm" onclick="bookNow('${item.name}')">Book</button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderBookings() {
    const container = document.getElementById('bookingList');
    container.innerHTML = '';
    if (!bookings.length) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted">
                <p>No bookings yet. Start exploring venues and reserve your stay.</p>
            </div>
        `;
        return;
    }

    bookings.forEach(booking => {
        const item = document.createElement('div');
        item.className = 'col-md-6 mb-4';
        item.innerHTML = `
            <div class="card card-venue h-100 p-3">
                <div class="card-body">
                    <h5 class="card-title">${booking.title}</h5>
                    <p class="text-muted mb-2">${booking.subtitle}</p>
                    <p class="card-text">${booking.details}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-primary">${booking.price}</span>
                        <span class="badge bg-success">${booking.status}</span>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(item);
    });
}

function openDetail(name) {
    alert(`Explore ${name} in more detail soon.`);
}

function bookNow(name) {
    bookings.push({
        title: name,
        subtitle: 'Booking will be confirmed shortly',
        details: 'This is a local test booking placeholder.',
        price: 'PKR 0',
        status: 'Pending'
    });
    renderBookings();
    window.location.hash = '#bookings';
}

function filterItems(query, location, type) {
    const normalizedQuery = query.trim().toLowerCase();

    const match = (item) => {
        const text = `${item.name} ${item.location} ${item.description}`.toLowerCase();
        return !normalizedQuery || text.includes(normalizedQuery);
    };

    const byLocation = (item) => {
        return !location || item.location.toLowerCase().includes(location.toLowerCase());
    };

    const hotelsFiltered = hotels.filter(item => match(item) && byLocation(item));
    const highTeaFiltered = highTeaVenues.filter(item => match(item) && byLocation(item));
    const eventHallsFiltered = eventHalls.filter(item => match(item) && byLocation(item));

    if (type === 'hotel') {
        return { hotels: hotelsFiltered, highTea: [], eventHalls: [] };
    }

    if (type === 'high-tea') {
        return { hotels: [], highTea: highTeaFiltered, eventHalls: [] };
    }

    if (type === 'event-hall') {
        return { hotels: [], highTea: [], eventHalls: eventHallsFiltered };
    }

    return { hotels: hotelsFiltered, highTea: highTeaFiltered, eventHalls: eventHallsFiltered };
}

function updateFilters() {
    const query = document.getElementById('searchInput').value;
    const location = document.getElementById('locationFilter').value;
    const type = document.getElementById('typeFilter').value;
    const filtered = filterItems(query, location, type);

    renderCards(filtered.hotels, 'hotelsContainer', 'hotel');
    renderCards(filtered.highTea, 'highTeaContainer', 'high-tea');
    renderCards(filtered.eventHalls, 'eventHallsContainer', 'event-hall');
    applyScrollAnimation();
}

function applyScrollAnimation() {
    const cards = document.querySelectorAll('.card-venue');
    const windowHeight = window.innerHeight;
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const visible = rect.top < windowHeight && rect.bottom > 0;
        card.style.transform = visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.98)';
        card.style.opacity = visible ? '1' : '0.2';
    });
}

window.addEventListener('scroll', applyScrollAnimation);
window.addEventListener('resize', applyScrollAnimation);

document.addEventListener('DOMContentLoaded', () => {
    renderCards(hotels, 'hotelsContainer', 'hotel');
    renderCards(highTeaVenues, 'highTeaContainer', 'high-tea');
    renderCards(eventHalls, 'eventHallsContainer', 'event-hall');
    renderBookings();
    applyScrollAnimation();

    document.getElementById('searchBtn').addEventListener('click', updateFilters);
    document.getElementById('locationFilter').addEventListener('change', updateFilters);
    document.getElementById('typeFilter').addEventListener('change', updateFilters);
    document.getElementById('searchInput').addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            updateFilters();
        }
    });
});