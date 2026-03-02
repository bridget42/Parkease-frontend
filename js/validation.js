// Validation Functions
function validateName(name) {
    // Must start with capital letter, no digits, min 2 chars
    return /^[A-Z][a-zA-Z\s'-]{1,}$/.test(name);
}

function validatePlate(plate) {
    // Starts with U, alphanumeric, max 8 chars e.g. UBA 123X
    const clean = plate.replace(/\s/g, '');
    return /^U[A-Z0-9]{2,6}$/.test(clean);
}

function validatePhone(phone) {
    // Accepts +256XXXXXXXXX or 07XXXXXXXX or 06XXXXXXXX
    const clean = phone.replace(/\s/g, '');
    return /^(\+256|0)(7|6)\d{8}$/.test(clean);
}

function validateNIN(nin) {
    // Format: CM/CF followed by alphanumeric
    return /^(CM|CF)\/[A-Z0-9]+$/i.test(nin);
}

// Calculate parking fee
function calculateFee(vehicleType, arrivalTime, signOutTime) {
    const durationMs = signOutTime - arrivalTime;
    const durationHrs = durationMs / (1000 * 60 * 60);
    const hour = new Date(arrivalTime).getHours();
    const isDay = hour >= 6 && hour < 19; // 6am - 6:59pm = day
    const isShort = durationHrs < 3;
    
    const rates = {
        'Truck': { short: 2000, day: 5000, night: 10000 },
        'Personal Car': { short: 2000, day: 3000, night: 2000 },
        'Taxi': { short: 2000, day: 3000, night: 2000 },
        'Coaster': { short: 3000, day: 4000, night: 2000 },
        'Boda-boda': { short: 1000, day: 2000, night: 2000 },
    };
    
    const r = rates[vehicleType] || rates['Personal Car'];
    return isShort ? r.short : (isDay ? r.day : r.night);
}

// Show error message
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    // Remove any existing error
    const existing = document.getElementById(inputId + '-error');
    if (existing) existing.remove();
    
    // Create and insert error message
    const err = document.createElement('p');
    err.id = inputId + '-error';
    err.className = 'field-error';
    err.textContent = message;
    input.parentNode.insertBefore(err, input.nextSibling);
    input.classList.add('error');
}

function clearError(inputId) {
    const existing = document.getElementById(inputId + '-error');
    if (existing) existing.remove();
    const input = document.getElementById(inputId);
    if (input) input.classList.remove('error');
}