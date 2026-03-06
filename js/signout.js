// Mock data for vehicles
const mockVehicles = {
    'UBA123X': {
        receiptId: 'PE-2026-02-1234',
        driverName: 'John Doe',
        vehicleType: 'Personal Car',
        plateNumber: 'UBA123X',
        arrivalTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'parked'
    },
    'UBE456Y': {
        receiptId: 'PE-2026-02-5678',
        driverName: 'Jane Smith',
        vehicleType: 'Boda-boda',
        plateNumber: 'UBE456Y',
        arrivalTime: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
        status: 'parked'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    requireLogin();
    
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchReceipt');
    const confirmBtn = document.getElementById('confirmPayment');
    const cancelBtn = document.getElementById('cancelBtn');
    const receiverForm = document.getElementById('receiverForm');
    const vehicleDetails = document.getElementById('vehicleDetails');
    const receiptContent = document.getElementById('receiptContent');
    
    let currentVehicle = null;
    
    // Search for vehicle
    searchBtn.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toUpperCase();
        
        // Find vehicle (in real app, would be API call)
        currentVehicle = mockVehicles[searchTerm] || 
                        Object.values(mockVehicles).find(v => v.receiptId === searchTerm);
        
        if (currentVehicle) {
            displayVehicleDetails(currentVehicle);
            confirmBtn.disabled = false;
        } else {
            alert('Vehicle not found');
        }
    });
    
    // Handle search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchBtn.click();
        }
    });
    
    // Confirm payment and sign-out
    confirmBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validate receiver form
        if (validateReceiverForm()) {
            const receiverInfo = {
                name: document.getElementById('receiverName').value,
                phone: document.getElementById('receiverPhone').value,
                nin: document.getElementById('receiverNIN').value,
                gender: document.getElementById('receiverGender').value
            };
            
            generateReceipt(currentVehicle, receiverInfo);
            confirmBtn.disabled = true;
            document.getElementById('printReceipt').disabled = false;
            
            alert('Payment confirmed! Vehicle signed out successfully.');
        }
    });
    
    // Cancel
    cancelBtn.addEventListener('click', function() {
        searchInput.value = '';
        vehicleDetails.innerHTML = '<div class="no-data">Search for a vehicle to begin</div>';
        receiptContent.innerHTML = '<div class="no-data">Complete sign-out to generate receipt</div>';
        receiverForm.reset();
        confirmBtn.disabled = true;
        document.getElementById('printReceipt').disabled = true;
        currentVehicle = null;
    });
    
    // Print receipt
    document.getElementById('printReceipt').addEventListener('click', function() {
        window.print();
    });
});

function displayVehicleDetails(vehicle) {
    const duration = calculateDuration(vehicle.arrivalTime, new Date());
    const fee = calculateFee(vehicle.vehicleType, vehicle.arrivalTime, new Date());
    
    const detailsHtml = `
        <div class="detail-row">
            <span class="label">Driver Name:</span>
            <span class="value">${vehicle.driverName}</span>
        </div>
        <div class="detail-row">
            <span class="label">Vehicle Type:</span>
            <span class="value">${vehicle.vehicleType}</span>
        </div>
        <div class="detail-row">
            <span class="label">Arrival Time:</span>
            <span class="value">${formatTime(vehicle.arrivalTime)}</span>
        </div>
        <div class="detail-row">
            <span class="label">Duration:</span>
            <span class="value">${duration}</span>
        </div>
        <div class="detail-row fee">
            <span class="label">Calculated Parking Fee:</span>
            <span class="value highlight">UGX ${fee.toLocaleString()}</span>
        </div>
    `;
    
    document.getElementById('vehicleDetails').innerHTML = detailsHtml;
}

function generateReceipt(vehicle, receiver) {
    const fee = calculateFee(vehicle.vehicleType, vehicle.arrivalTime, new Date());
    const now = new Date();
    
    const receiptHtml = `
        <div class="receipt">
            <div class="receipt-header">
                <h3>ParkEase</h3>
                <p>Parking Receipt</p>
            </div>
            <div class="receipt-body">
                <div class="receipt-row">
                    <span>Receipt No:</span>
                    <span>${vehicle.receiptId}</span>
                </div>
                <div class="receipt-row">
                    <span>Date:</span>
                    <span>${formatDate(now)}</span>
                </div>
                <div class="receipt-row">
                    <span>Plate No:</span>
                    <span>${vehicle.plateNumber}</span>
                </div>
                <div class="receipt-row">
                    <span>Category:</span>
                    <span>${vehicle.vehicleType}</span>
                </div>
                <div class="receipt-row">
                    <span>Check-in:</span>
                    <span>${formatTime(vehicle.arrivalTime)}</span>
                </div>
                <div class="receipt-row">
                    <span>Check-out:</span>
                    <span>${formatTime(now)}</span>
                </div>
                <div class="receipt-row">
                    <span>Duration:</span>
                    <span>${calculateDuration(vehicle.arrivalTime, now)}</span>
                </div>
                <div class="receipt-row total">
                    <span>Total:</span>
                    <span>UGX ${fee.toLocaleString()}</span>
                </div>
                <div class="receipt-row">
                    <span>Receiver:</span>
                    <span>${receiver.name}</span>
                </div>
                <div class="receipt-row">
                    <span>NIN:</span>
                    <span>${receiver.nin}</span>
                </div>
            </div>
            <div class="receipt-footer">
                <div class="qr-placeholder">SCAN TO VERIFY</div>
                <p>Thank you for using ParkEase!</p>
            </div>
        </div>
    `;
    
    document.getElementById('receiptContent').innerHTML = receiptHtml;
}

function validateReceiverForm() {
    const name = document.getElementById('receiverName').value;
    const phone = document.getElementById('receiverPhone').value;
    const nin = document.getElementById('receiverNIN').value;
    
    if (!validateName(name)) {
        alert('Please enter a valid name');
        return false;
    }
    
    if (!validatePhone(phone)) {
        alert('Please enter a valid phone number');
        return false;
    }
    
    if (!validateNIN(nin)) {
        alert('Please enter a valid NIN number');
        return false;
    }
    
    return true;
}

function calculateDuration(arrival, departure) {
    const diffMs = departure - arrival;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}