// Hardcoded users for prototype
const users = {
    'admin': { password: 'admin123', role: 'admin' },
    'attendant': { password: 'park2026', role: 'attendant' }
};

// Handle login form submission
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('loginError');

            // Validate credentials
            const user = users[username];
            if (user && user.password === password) {
                // Store user session
                localStorage.setItem('parkease_user', JSON.stringify({
                    username: username,
                    role: user.role
                }));

                // Redirect based on role
                if (user.role === 'admin') {
                    window.location.href = 'dashboard.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            } else {
                errorDiv.textContent = 'Invalid username or password';
            }
        });
    }
});

// Protect pages - add this to each page's JS file
function requireLogin() {
    const user = JSON.parse(localStorage.getItem('parkease_user'));
    if (!user) {
        window.location.href = 'index.html';
    }
    return user;
}