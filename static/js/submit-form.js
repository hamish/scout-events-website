document.addEventListener('DOMContentLoaded', function() {
    console.log('Submit form DOM loaded, looking for form elements...');
    const form = document.getElementById('event-submit-form');
    const submitBtn = document.getElementById('submit-btn');
    const messagesDiv = document.getElementById('form-messages');
    const registrationRequiredCheckbox = document.getElementById('registration_required');
    const registrationLinkGroup = document.getElementById('registration_link_group');
    const descriptionTextarea = document.getElementById('description');
    const descriptionCount = document.getElementById('description-count');
    
    console.log('Form elements found:', {
        form: !!form,
        submitBtn: !!submitBtn,
        messagesDiv: !!messagesDiv,
        registrationRequiredCheckbox: !!registrationRequiredCheckbox,
        registrationLinkGroup: !!registrationLinkGroup,
        descriptionTextarea: !!descriptionTextarea,
        descriptionCount: !!descriptionCount
    });
    
    if (!form) {
        console.error('Submit form not found! Cannot attach event listeners.');
        return;
    }

    // Toggle registration link field visibility
    registrationRequiredCheckbox.addEventListener('change', function() {
        if (this.checked) {
            registrationLinkGroup.style.display = 'block';
        } else {
            registrationLinkGroup.style.display = 'none';
            document.getElementById('registration_link').value = '';
        }
    });

    // Character counter for description
    descriptionTextarea.addEventListener('input', function() {
        const count = this.value.length;
        descriptionCount.textContent = count;
        
        if (count > 2000) {
            descriptionCount.style.color = '#d32f2f';
        } else if (count > 1800) {
            descriptionCount.style.color = '#ff9800';
        } else {
            descriptionCount.style.color = '#666';
        }
    });

    // Set minimum date to today
    const startDateInput = document.getElementById('start_date');
    const today = new Date().toISOString().split('T')[0];
    startDateInput.setAttribute('min', today);

    // Form validation
    function validateForm() {
        let isValid = true;
        const errors = {};

        // Clear previous errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');

        // Required fields validation
        const requiredFields = ['title', 'start_date', 'start_time', 'location', 'description'];
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            const value = input.value.trim();
            
            if (!value) {
                errors[field] = 'This field is required.';
                isValid = false;
            }
        });

        // Title length validation
        const title = document.getElementById('title').value.trim();
        if (title.length > 200) {
            errors.title = 'Title must be 200 characters or less.';
            isValid = false;
        }

        // Date validation
        const startDate = document.getElementById('start_date').value;
        if (startDate) {
            const eventDate = new Date(startDate);
            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);
            
            if (eventDate < todayDate) {
                errors.start_date = 'Event date cannot be in the past.';
                isValid = false;
            }
        }

        // Time validation
        const startTime = document.getElementById('start_time').value;
        const endTime = document.getElementById('end_time').value;
        
        if (startTime && endTime) {
            const startMinutes = timeToMinutes(startTime);
            const endMinutes = timeToMinutes(endTime);
            
            if (endMinutes <= startMinutes) {
                errors.end_time = 'End time must be after start time.';
                isValid = false;
            }
        }

        // Location validation
        const location = document.getElementById('location').value.trim();
        if (location.length > 500) {
            errors.location = 'Location must be 500 characters or less.';
            isValid = false;
        }

        // Description validation
        const description = document.getElementById('description').value.trim();
        if (description.length > 2000) {
            errors.description = 'Description must be 2000 characters or less.';
            isValid = false;
        }

        // Email validation (if provided)
        const email = document.getElementById('submitter_email').value.trim();
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.submitter_email = 'Please enter a valid email address.';
                isValid = false;
            }
        }

        // Registration link validation
        if (registrationRequiredCheckbox.checked) {
            const regLink = document.getElementById('registration_link').value.trim();
            if (regLink) {
                try {
                    new URL(regLink);
                } catch {
                    errors.registration_link = 'Please enter a valid URL.';
                    isValid = false;
                }
            }
        }

        // Display errors
        Object.keys(errors).forEach(field => {
            const errorEl = document.getElementById(field + '-error');
            if (errorEl) {
                errorEl.textContent = errors[field];
            }
        });

        return isValid;
    }

    // Helper function to convert time to minutes
    function timeToMinutes(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Show message
    function showMessage(message, type) {
        messagesDiv.textContent = message;
        messagesDiv.className = `form-messages ${type}`;
        messagesDiv.style.display = 'block';
        messagesDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        console.log('Form submitted, preventing default behavior...');
        e.preventDefault();

        if (!validateForm()) {
            showMessage('Please correct the errors above and try again.', 'error');
            return;
        }

        // Disable submit button and show loading
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loading').style.display = 'inline';

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {};

            // Handle regular fields
            for (const [key, value] of formData.entries()) {
                if (key === 'event_type' || key === 'age_groups') {
                    // Handle multi-select fields
                    if (!data[key]) data[key] = [];
                    data[key].push(value);
                } else {
                    data[key] = value.trim();
                }
            }

            // Handle multi-select fields that might not be set
            if (!data.event_type) data.event_type = ['meeting'];
            if (!data.age_groups) data.age_groups = ['all'];

            // Handle checkbox
            data.registration_required = registrationRequiredCheckbox.checked;

            // Submit to Netlify Function
            console.log('Submitting data:', data);
            const response = await fetch('/.netlify/functions/submit-event', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Response body:', result);

            if (response.ok) {
                showMessage(
                    `Success! ${result.message} Your submission ID is: ${result.submissionId}. Please save this ID for your records.`,
                    'success'
                );
                form.reset();
                registrationLinkGroup.style.display = 'none';
                descriptionCount.textContent = '0';
            } else {
                let errorMessage = result.error || 'An error occurred while submitting your event.';
                
                if (result.missingFields) {
                    errorMessage += ' Missing fields: ' + result.missingFields.join(', ');
                }
                
                showMessage(errorMessage, 'error');
            }

        } catch (error) {
            console.error('Submission error:', error);
            showMessage(
                'Network error: Unable to submit your event. Please check your internet connection and try again, or contact us directly.',
                'error'
            );
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loading').style.display = 'none';
        }
    });

    // Form reset handler
    form.addEventListener('reset', function() {
        // Clear errors and messages
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        messagesDiv.style.display = 'none';
        registrationLinkGroup.style.display = 'none';
        descriptionCount.textContent = '0';
        descriptionCount.style.color = '#666';
    });

    // Real-time validation for some fields
    document.getElementById('title').addEventListener('blur', function() {
        const errorEl = document.getElementById('title-error');
        if (this.value.trim() === '') {
            errorEl.textContent = 'This field is required.';
        } else if (this.value.length > 200) {
            errorEl.textContent = 'Title must be 200 characters or less.';
        } else {
            errorEl.textContent = '';
        }
    });

    document.getElementById('location').addEventListener('blur', function() {
        const errorEl = document.getElementById('location-error');
        if (this.value.trim() === '') {
            errorEl.textContent = 'This field is required.';
        } else if (this.value.length > 500) {
            errorEl.textContent = 'Location must be 500 characters or less.';
        } else {
            errorEl.textContent = '';
        }
    });

    document.getElementById('submitter_email').addEventListener('blur', function() {
        const errorEl = document.getElementById('submitter_email-error');
        const email = this.value.trim();
        
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorEl.textContent = 'Please enter a valid email address.';
        } else {
            errorEl.textContent = '';
        }
    });
});