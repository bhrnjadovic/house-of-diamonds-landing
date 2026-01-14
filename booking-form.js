/**
 * House of Diamonds - Booking Form JavaScript
 * Production-ready form validation and submission handling
 */

class BookingForm {
  constructor() {
    this.form = document.getElementById('bookingForm');
    this.submitButton = null;
    this.originalButtonText = '';

    // Validation patterns
    this.patterns = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      phone: /^(\+?61|0)?[2-478](?:[ -]?[0-9]){8}$/,
      name: /^[a-zA-Z\s'-]{2,50}$/
    };

    this.init();
  }

  init() {
    if (!this.form) {
      console.warn('Booking form not found');
      return;
    }

    this.submitButton = this.form.querySelector('button[type="submit"]');
    if (this.submitButton) {
      this.originalButtonText = this.submitButton.textContent;
    }

    this.attachEventListeners();
    this.setupCTAButtons();
    this.initializeDateTimePicker();
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Real-time validation on blur
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });

    // Phone number formatting
    const phoneInput = this.form.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
    }

    // Date picker validation
    const dateInput = this.form.querySelector('input[type="date"]');
    if (dateInput) {
      dateInput.addEventListener('change', () => this.validateDate(dateInput));
    }

    // Time picker validation
    const timeInput = this.form.querySelector('input[type="time"]');
    if (timeInput) {
      timeInput.addEventListener('change', () => this.validateTime(timeInput, dateInput));
    }
  }

  /**
   * Setup smooth scroll for CTA buttons
   */
  setupCTAButtons() {
    const ctaButtons = document.querySelectorAll('[data-scroll-to-form], .cta-button, .book-now-btn');

    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // Only prevent default if it's a link or has data attribute
        if (button.hasAttribute('data-scroll-to-form') || button.tagName === 'A') {
          e.preventDefault();
        }
        this.scrollToForm();
      });
    });
  }

  /**
   * Smooth scroll to form
   */
  scrollToForm() {
    if (!this.form) return;

    const formPosition = this.form.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = formPosition - 100; // 100px offset from top

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    // Focus first input after scroll
    setTimeout(() => {
      const firstInput = this.form.querySelector('input:not([type="hidden"])');
      if (firstInput) {
        firstInput.focus();
      }
    }, 500);
  }

  /**
   * Initialize date and time picker with constraints
   */
  initializeDateTimePicker() {
    const dateInput = this.form.querySelector('input[type="date"]');
    if (dateInput) {
      // Set minimum date to today
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);

      // Set maximum date to 6 months from now
      const maxDate = new Date();
      maxDate.setMonth(maxDate.getMonth() + 6);
      dateInput.setAttribute('max', maxDate.toISOString().split('T')[0]);
    }
  }

  /**
   * Format Australian phone number
   */
  formatPhoneNumber(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    // Handle different formats
    if (value.startsWith('61')) {
      // International format: +61 4XX XXX XXX
      value = value.slice(2); // Remove country code for formatting
    } else if (value.startsWith('0')) {
      value = value.slice(1); // Remove leading 0
    }

    // Format as: 04XX XXX XXX
    if (value.length > 0) {
      if (value.length <= 4) {
        value = '0' + value;
      } else if (value.length <= 7) {
        value = '0' + value.slice(0, 3) + ' ' + value.slice(3);
      } else {
        value = '0' + value.slice(0, 3) + ' ' + value.slice(3, 6) + ' ' + value.slice(6, 9);
      }
    }

    e.target.value = value;
  }

  /**
   * Validate individual field
   */
  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name') || field.getAttribute('id');
    let isValid = true;
    let errorMessage = '';

    // Required field check
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }
    // Name validation
    else if (field.type === 'text' && fieldName && fieldName.toLowerCase().includes('name')) {
      if (!this.patterns.name.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid name (2-50 characters, letters only)';
      }
    }
    // Email validation
    else if (field.type === 'email') {
      if (!this.patterns.email.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }
    // Phone validation
    else if (field.type === 'tel') {
      const cleanPhone = value.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 11) {
        isValid = false;
        errorMessage = 'Please enter a valid Australian phone number';
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  /**
   * Validate date is in the future
   */
  validateDate(dateInput) {
    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      this.showFieldError(dateInput, 'Please select a future date');
      return false;
    }

    this.clearFieldError(dateInput);
    return true;
  }

  /**
   * Validate time is in the future (if date is today)
   */
  validateTime(timeInput, dateInput) {
    if (!dateInput || !timeInput.value) return true;

    const selectedDate = new Date(dateInput.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only validate time if date is today
    if (selectedDate.getTime() === today.getTime()) {
      const [hours, minutes] = timeInput.value.split(':');
      const selectedTime = new Date();
      selectedTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const now = new Date();

      if (selectedTime <= now) {
        this.showFieldError(timeInput, 'Please select a future time');
        return false;
      }
    }

    this.clearFieldError(timeInput);
    return true;
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    this.clearFieldError(field);

    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');

    // Insert error message after field
    field.parentNode.appendChild(errorDiv);

    // Add shake animation
    field.style.animation = 'shake 0.3s';
    setTimeout(() => {
      field.style.animation = '';
    }, 300);
  }

  /**
   * Clear field error
   */
  clearFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');

    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  /**
   * Validate entire form
   */
  validateForm() {
    let isValid = true;
    const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    // Special validation for date/time
    const dateInput = this.form.querySelector('input[type="date"]');
    const timeInput = this.form.querySelector('input[type="time"]');

    if (dateInput && dateInput.hasAttribute('required')) {
      if (!this.validateDate(dateInput)) {
        isValid = false;
      }
    }

    if (timeInput && timeInput.hasAttribute('required') && dateInput) {
      if (!this.validateTime(timeInput, dateInput)) {
        isValid = false;
      }
    }

    return isValid;
  }

  /**
   * Show loading state
   */
  showLoadingState() {
    if (!this.submitButton) return;

    this.submitButton.disabled = true;
    this.submitButton.classList.add('loading');
    this.submitButton.innerHTML = `
      <span class="spinner"></span>
      <span>Submitting...</span>
    `;
  }

  /**
   * Hide loading state
   */
  hideLoadingState() {
    if (!this.submitButton) return;

    this.submitButton.disabled = false;
    this.submitButton.classList.remove('loading');
    this.submitButton.textContent = this.originalButtonText;
  }

  /**
   * Show success message
   */
  showSuccessMessage() {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.setAttribute('role', 'alert');
    successDiv.innerHTML = `
      <div class="success-icon">✓</div>
      <h3>Booking Request Received!</h3>
      <p>Thank you for your interest. We'll contact you shortly to confirm your appointment.</p>
    `;

    // Insert before form
    this.form.parentNode.insertBefore(successDiv, this.form);

    // Hide form
    this.form.style.display = 'none';

    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-hide after 10 seconds and show form again
    setTimeout(() => {
      successDiv.style.animation = 'fadeOut 0.5s';
      setTimeout(() => {
        successDiv.remove();
        this.form.style.display = 'block';
        this.form.reset();
      }, 500);
    }, 10000);
  }

  /**
   * Show error message
   */
  showErrorMessage(message = 'An error occurred. Please try again.') {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'submission-error';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
      <div class="error-icon">✕</div>
      <p>${message}</p>
    `;

    this.form.insertBefore(errorDiv, this.form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      errorDiv.style.animation = 'fadeOut 0.5s';
      setTimeout(() => errorDiv.remove(), 500);
    }, 5000);

    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /**
   * Get form data
   */
  getFormData() {
    const formData = new FormData(this.form);
    const data = {};

    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    // Add timestamp
    data.submittedAt = new Date().toISOString();

    // Clean phone number for storage
    if (data.phone) {
      data.phoneClean = data.phone.replace(/\D/g, '');
    }

    return data;
  }

  /**
   * Submit form data to backend
   */
  async submitToBackend(data) {
    // PLACEHOLDER: Replace with actual API endpoint
    const API_ENDPOINT = '/api/bookings'; // Update this with your actual endpoint

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Submission error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Handle form submission
   */
  async handleSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!this.validateForm()) {
      // Scroll to first error
      const firstError = this.form.querySelector('.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // Show loading state
    this.showLoadingState();

    // Get form data
    const formData = this.getFormData();

    // Log form data (for testing)
    console.log('Form Data:', formData);

    // Simulate API call (remove this and uncomment backend submission when ready)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // UNCOMMENT BELOW FOR ACTUAL BACKEND INTEGRATION
    /*
    const result = await this.submitToBackend(formData);

    this.hideLoadingState();

    if (result.success) {
      this.showSuccessMessage();
      this.form.reset();
    } else {
      this.showErrorMessage(result.error || 'Failed to submit booking. Please try again.');
    }
    */

    // TEMPORARY: For testing without backend
    this.hideLoadingState();
    this.showSuccessMessage();
  }
}

// Animation styles injector (if not in CSS)
function injectStyles() {
  const styleId = 'booking-form-styles';

  if (document.getElementById(styleId)) return;

  const styles = `
    /* Form validation styles */
    .error {
      border-color: #ef4444 !important;
      background-color: #fef2f2 !important;
    }

    .error-message {
      color: #ef4444;
      font-size: 0.875rem;
      margin-top: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      animation: slideDown 0.3s ease-out;
    }

    .error-message:before {
      content: "⚠";
      font-size: 1rem;
    }

    /* Loading state */
    .loading {
      position: relative;
      pointer-events: none;
      opacity: 0.7;
    }

    .spinner {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.6s linear infinite;
      margin-right: 0.5rem;
    }

    /* Success message */
    .success-message {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 2rem;
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.3);
      animation: slideDown 0.5s ease-out;
    }

    .success-icon {
      width: 60px;
      height: 60px;
      background: white;
      color: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: bold;
      margin: 0 auto 1rem;
      animation: scaleIn 0.5s ease-out 0.2s both;
    }

    .success-message h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .success-message p {
      margin: 0;
      opacity: 0.95;
    }

    /* Error message */
    .submission-error {
      background: #fef2f2;
      border: 2px solid #ef4444;
      color: #991b1b;
      padding: 1rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      animation: slideDown 0.3s ease-out;
    }

    .error-icon {
      width: 24px;
      height: 24px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      flex-shrink: 0;
    }

    /* Animations */
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }

    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateY(-10px);
      }
    }

    /* Focus styles */
    input:focus, textarea:focus, select:focus {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }

    input.error:focus, textarea.error:focus, select.error:focus {
      outline-color: #ef4444;
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.id = styleId;
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    injectStyles();
    new BookingForm();
  });
} else {
  injectStyles();
  new BookingForm();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BookingForm;
}
