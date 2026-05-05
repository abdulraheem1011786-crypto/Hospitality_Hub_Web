// Signup Page Handler
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    // Mobile menu toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu?.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.navbar-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu?.classList.remove('active');
        });
    });

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();

            if (!name || !email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters long');
                return;
            }

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password }),
                    credentials: 'same-origin',
                });

                if (!response.ok) {
                    const error = await response.json();
                    alert(error.message || 'Signup failed');
                    return;
                }

                const user = await response.json();
                localStorage.setItem('hospitalityHubUser', JSON.stringify(user));
                alert('Account created successfully!');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred during signup. Please try again.');
            }
        });
    }
});
