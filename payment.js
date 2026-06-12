// Currency conversion rates (example rates)
const currencyRates = {
    'US': { symbol: '$', rate: 1 },
    'UK': { symbol: '£', rate: 0.79 },
    'CA': { symbol: 'C$', rate: 1.36 },
    'AU': { symbol: 'A$', rate: 1.53 },
    'EU': { symbol: '€', rate: 0.92 },
    'IN': { symbol: '₹', rate: 83.12 },
    'JP': { symbol: '¥', rate: 149.50 },
    'MX': { symbol: '$', rate: 17.05 },
    'BR': { symbol: 'R$', rate: 4.97 },
    'ZA': { symbol: 'R', rate: 18.65 }
};

// Package details
const packages = {
    '1hour': { name: '1 Hour Pass', price: 2.99, duration: '1 Hour', duration_text: '1 hour' },
    '1day': { name: '1 Day Pass', price: 7.99, duration: '24 Hours', duration_text: '1 day' },
    '7day': { name: '7 Day Pass', price: 19.99, duration: '7 Days', duration_text: '7 days' },
    '30day': { name: '30 Day Pass', price: 49.99, duration: '30 Days', duration_text: '30 days' }
};

// Get package from URL or default
function getSelectedPackage() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('plan') || '1day';
}

// Initialize payment page
window.addEventListener('DOMContentLoaded', () => {
    const selectedPlan = getSelectedPackage();
    updatePackageDisplay(selectedPlan);
    
    // Setup payment method listeners
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            updatePaymentMethodUI(e.target.value);
        });
    });
    
    // Format card number input
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }
});

// Update package display
function updatePackageDisplay(planId) {
    const pkg = packages[planId];
    document.getElementById('package-name').textContent = pkg.name;
    document.getElementById('duration').textContent = pkg.duration;
    document.getElementById('base-price').textContent = '$' + pkg.price.toFixed(2);
    updateCurrency();
}

// Update currency display
function updateCurrency() {
    const country = document.getElementById('country').value;
    const selectedPlan = getSelectedPackage();
    const pkg = packages[selectedPlan];
    const currency = currencyRates[country];
    
    const basePrice = pkg.price;
    const convertedPrice = basePrice * currency.rate;
    const tax = convertedPrice * 0.08; // 8% tax
    const total = convertedPrice + tax;
    
    document.getElementById('base-price').textContent = currency.symbol + convertedPrice.toFixed(2);
    document.getElementById('tax').textContent = currency.symbol + tax.toFixed(2);
    document.getElementById('total-price').textContent = currency.symbol + total.toFixed(2);
}

// Update payment method UI
function updatePaymentMethodUI(method) {
    const cardDetails = document.getElementById('card-details');
    if (method === 'card') {
        cardDetails.style.display = 'block';
    } else {
        cardDetails.style.display = 'none';
    }
}

// Format card number with spaces
function formatCardNumber(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    e.target.value = formattedValue;
}

// Process payment
function processPayment(event) {
    event.preventDefault();
    
    // Validate form
    const form = event.target;
    if (!form.checkValidity()) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Simulate payment processing
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    
    // Simulate API call
    setTimeout(() => {
        // Generate access code
        const accessCode = 'WIFI-2026-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Calculate validity date
        const selectedPlan = getSelectedPackage();
        const pkg = packages[selectedPlan];
        const today = new Date();
        let daysToAdd = 0;
        
        if (selectedPlan === '1hour') daysToAdd = 0;
        else if (selectedPlan === '1day') daysToAdd = 1;
        else if (selectedPlan === '7day') daysToAdd = 7;
        else if (selectedPlan === '30day') daysToAdd = 30;
        
        const validDate = new Date(today.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
        
        // Show success modal
        document.getElementById('access-code').textContent = accessCode;
        document.getElementById('valid-until').textContent = validDate.toLocaleDateString();
        
        // Save to localStorage
        localStorage.setItem('lastAccessCode', accessCode);
        localStorage.setItem('lastPlanDate', new Date().toISOString());
        
        showModal('success-modal');
        
        // Reset form
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = 'Complete Payment';
    }, 2000);
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
}

// Copy access code
function copyCode() {
    const code = document.getElementById('access-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        alert('Access code copied to clipboard!');
    });
}

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});