// Check authentication
document.addEventListener('DOMContentLoaded', function() {
    const user = requireLogin();
    
    // Display username
    if (user) {
        document.getElementById('loggedInUser').textContent = 
            user.username.charAt(0).toUpperCase() + user.username.slice(1);
    }
    
    // Load recent arrivals
    loadRecentArrivals();
    
    // Update stats every 30 seconds (simulate real-time)
    setInterval(updateStats, 30000);
});

// Sample data for recent arrivals
function loadRecentArrivals() {
    const arrivals = [
        { time: '09:30', plate: 'UBA 123X', type: 'Honda', status: 'Parked' },
        { time: '09:15', plate: 'UBE 456Y', type: 'Taxi', status: 'Parked' },
        { time: '08:45', plate: 'UAA 789Z', type: 'Truck', status: 'Parked' },
        { time: '08:30', plate: 'UBC 101A', type: 'Boda-boda', status: 'Signed Out' },
        { time: '08:00', plate: 'UBD 202B', type: 'Coaster', status: 'Parked' }
    ];
    
    const tbody = document.getElementById('recentArrivalsTable');
    tbody.innerHTML = arrivals.map(arrival => `
        <tr>
            <td>${arrival.time}</td>
            <td>${arrival.plate}</td>
            <td>${arrival.type}</td>
            <td><span class="status-badge ${arrival.status.toLowerCase().replace(' ', '-')}">${arrival.status}</span></td>
            <td><i class="fas fa-ellipsis-v"></i></td>
        </tr>
    `).join('');
}

function updateStats() {
    // Simulate stats update
    console.log('Stats updated');
}

function logout() {
    localStorage.removeItem('parkease_user');
    window.location.href = 'index.html';
}