// Initialize dashboard
window.addEventListener('DOMContentLoaded', () => {
    // Load user data
    loadUserData();
    
    // Setup sidebar menu
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            document.querySelectorAll('.sidebar-menu a').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active class to clicked link
            link.classList.add('active');
        });
    });
});

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
}

// Load user data from localStorage
function loadUserData() {
    const lastAccessCode = localStorage.getItem('lastAccessCode');
    const lastPlanDate = localStorage.getItem('lastPlanDate');
    
    if (lastAccessCode && lastPlanDate) {
        // Update dashboard with user data
        console.log('User data loaded:', {
            accessCode: lastAccessCode,
            date: new Date(lastPlanDate).toLocaleDateString()
        });
    }
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}

// Export payment history
function exportPaymentHistory() {
    const table = document.querySelector('.history-table');
    let csv = '';
    
    // Get headers
    const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent);
    csv += headers.join(',') + '\n';
    
    // Get rows
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(tr => {
        return Array.from(tr.querySelectorAll('td')).map(td => td.textContent).join(',');
    });
    csv += rows.join('\n');
    
    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payment-history.csv';
    a.click();
}

// Generate receipt
function generateReceipt(transactionId) {
    console.log('Generating receipt for transaction:', transactionId);
    alert('Receipt generated and will be sent to your email.');
}

// Renew subscription
function renewSubscription(planId) {
    window.location.href = 'payment.html?plan=' + planId;
}