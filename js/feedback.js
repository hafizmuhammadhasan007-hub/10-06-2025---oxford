document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFeedbackForm();
        });
    }
});

function handleFeedbackForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const rating = document.getElementById('rating').value;
    const message = document.getElementById('message').value;
    const alertBox = document.getElementById('alert');
    
    if (!name || !email || !rating || !message) {
        showAlert(alertBox, 'Please fill in all fields.', 'error');
        return;
    }
    
    showAlert(alertBox, 'Thank you for your valuable feedback! We appreciate your input.', 'success');
    
    const feedbackData = {
        name,
        email,
        rating,
        message,
        timestamp: new Date().toISOString()
    };
    
    let feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
    feedbacks.push(feedbackData);
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    
    document.getElementById('feedback-form').reset();
}

function showAlert(alertBox, message, type) {
    alertBox.textContent = message;
    alertBox.className = `alert alert-${type}`;
    alertBox.style.display = 'block';
    
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}