document.addEventListener('DOMContentLoaded', function() {
    requireLogin();
    
    const form = document.getElementById('registrationForm');
    const vehicleType = document.getElementById('vehicleType');
    const ninSection = document.getElementById('ninSection');
    
    // Show/hide NIN field based on vehicle type
    vehicleType.addEventListener('change', function() {
        if (this.value === 'Boda-boda') {
            ninSection.style.display = 'block';
            document.getElementById('nin').required = true;
        } else {
            ninSection.style.display = 'none';
            document.getElementById('nin').required = false;
        }
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear all previous errors
        clearAllErrors();
        
        // Validate form
        if (validateForm()) {
            // Generate receipt number
            const receiptNo = generateReceiptNumber();
            alert(`Vehicle registered successfully!\nReceipt Number: ${receiptNo}`);
            form.reset();
            ninSection.style.display = 'none';
        }
    });
    
    // Real-time validation
    document.getElementById('driverName').addEventListener('blur', function() {
        validateField('driverName', validateName, 'Name must start with capital letter and contain no numbers');
    });
    
    document.getElementById('phoneNumber').addEventListener('blur', function() {
        validateField('phoneNumber', validatePhone, 'Please enter a valid Ugandan phone number (+256 or 07...)');
    });
    
    document.getElementById('numberPlate').addEventListener('blur', function() {
        validateField('numberPlate', validatePlate, 'Plate must start with U and be max 8 characters');
    });
});

function validateForm() {
    let isValid = true;
    
    // Validate driver name
    if (!validateField('driverName', validateName, 'Name must start with capital letter and contain no numbers')) {
        isValid = false;
    }
    
    // Validate phone
    if (!validateField('phoneNumber', validatePhone, 'Please enter a valid Ugandan phone number')) {
        isValid = false;
    }
    
    // Validate plate
    if (!validateField('numberPlate', validatePlate, 'Plate must start with U and be max 8 characters')) {
        isValid = false;
    }
    
    // Validate NIN if required
    const vehicleType = document.getElementById('vehicleType').value;
    if (vehicleType === 'Boda-boda') {
        if (!validateField('nin', validateNIN, 'NIN must be in format CM/XXXXX or CF/XXXXX')) {
            isValid = false;
        }
    }
    
    return isValid;
}

function validateField(fieldId, validationFn, errorMessage) {
    const field = document.getElementById(fieldId);
    if (!field) return true;
    
    clearError(fieldId);
    
    if (!field.value.trim()) {
        showError(fieldId, 'This field is required');
        return false;
    }
    
    if (!validationFn(field.value.trim())) {
        showError(fieldId, errorMessage);
        return false;
    }
    
    return true;
}

function clearAllErrors() {
    const errorFields = ['driverName', 'phoneNumber', 'numberPlate', 'nin'];
    errorFields.forEach(fieldId => clearError(fieldId));
}

function clearForm() {
    document.getElementById('registrationForm').reset();
    document.getElementById('ninSection').style.display = 'none';
    clearAllErrors();
}

function generateReceiptNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PE-${year}-${month}-${random}`;
}