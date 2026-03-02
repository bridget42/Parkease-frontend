// Mock data for signed-out vehicles
const mockSignedOutVehicles = [
    { receipt: 'PE-2026-02-001', plate: 'UBA123X', inTime: '08:30', outTime: '10:45', duration: '2h 15m', fee: 3000 },
    { receipt: 'PE-2026-02-002', plate: 'UBE456Y', inTime: '09:15', outTime: '11:30', duration: '2h 15m', fee: 2000 },
    { receipt: 'PE-2026-02-003', plate: 'UAA789Z', inTime: '10:00', outTime: '14:20', duration: '4h 20m', fee: 10000 },
    { receipt: 'PE-2026-02-004', plate: 'UBC101A', inTime: '11:30', outTime: '12:45', duration: '1h 15m', fee: 2000 },
    { receipt: 'PE-2026-02-005', plate: 'UBD202B', inTime: '12:00', outTime: '15:30', duration: '3h 30m', fee: 4000 },
    { receipt: 'PE-2026-02-006', plate: 'UBE303C', inTime: '13:15', outTime: '16:45', duration: '3h 30m', fee: 5000 },
    { receipt: 'PE-2026-02-007', plate: 'UBF404D', inTime: '14:00', outTime: '17:20', duration: '3h 20m', fee: 2000 },
    { receipt: 'PE-2026-02-008', plate: 'UBG505E', inTime: '15:30', outTime: '18:15', duration: '2h 45m', fee: 3000 },
];

let currentPage = 1;
const rowsPerPage = 5;
let filteredData = [...mockSignedOutVehicles];

document.addEventListener('DOMContentLoaded', function() {
    requireLogin();
    
    // Date navigation
    const displayDate = document.getElementById('displayDate');
    const prevDayBtn = document.getElementById('prevDay');
    const nextDayBtn = document.getElementById('nextDay');
    
    let currentDate = new Date();
    
    function updateDateDisplay() {
        displayDate.textContent = currentDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    prevDayBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
        updateRevenueCards();   // Would fetch new data
    });
    
    nextDayBtn.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
        updateRevenueCards();    // Would fetch new data
    });
    
    // Table search/filter
    const searchInput = document.getElementById('tableSearch');
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        filteredData = mockSignedOutVehicles.filter(vehicle => 
            vehicle.plate.toLowerCase().includes(searchTerm) ||
            vehicle.receipt.toLowerCase().includes(searchTerm)
        );
        currentPage = 1;
        displayTableData();
        updatePaginationButtons();
    });
    
    // Pagination
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayTableData();
            updatePaginationButtons();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayTableData();
            updatePaginationButtons();
        }
    });
    
    // Export buttons
    document.getElementById('downloadPdf').addEventListener('click', function() {
        alert('PDF download functionality would be implemented here');
    });
    
    document.getElementById('exportCsv').addEventListener('click', function() {
        exportToCSV();
    });
    
    // Initial display
    displayTableData();
    updatePaginationButtons();
});

function displayTableData() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = filteredData.slice(start, end);
    
    const tbody = document.getElementById('vehiclesTableBody');
    
    if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data">No vehicles found</td></tr>';
        return;
    }
    
    tbody.innerHTML = pageData.map(vehicle => `
        <tr>
            <td>${vehicle.receipt}</td>
            <td>${vehicle.plate}</td>
            <td>${vehicle.inTime}</td>
            <td>${vehicle.outTime}</td>
            <td>${vehicle.duration}</td>
            <td>UGX ${vehicle.fee.toLocaleString()}</td>
        </tr>
    `).join('');
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    // Update page numbers
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= Math.min(totalPages, 3); i++) {
        const span = document.createElement('span');
        span.className = `page-number ${i === currentPage ? 'active' : ''}`;
        span.textContent = i;
        span.addEventListener('click', () => {
            currentPage = i;
            displayTableData();
            updatePaginationButtons();
        });
        pageNumbers.appendChild(span);
    }
}

function updateRevenueCards() {
    // In real app, would fetch new data
    console.log('Updating revenue cards for new date');
}

function exportToCSV() {
    const headers = ['Receipt #', 'Plate #', 'In-Time', 'Out-Time', 'Duration', 'Fee (UGX)'];
    const csvData = filteredData.map(row => [
        row.receipt,
        row.plate,
        row.inTime,
        row.outTime,
        row.duration,
        row.fee
    ]);
    
    const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parkease-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}