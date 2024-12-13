// Initialize Supabase client
const supabaseUrl = 'https://eoaomofzrhgegahsescu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYW9tb2Z6cmhnZWdhaHNlc2N1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQwMTQ5NzQsImV4cCI6MjA0OTU5MDk3NH0.6kxdjXPfokYIJScSj4qJt-N-lAibyG0_xaw96owusNY';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Create popup element
const createPopup = (message, isSuccess = true) => {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${isSuccess ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
        text-align: center;
        min-width: 300px;
    `;
    
    popup.innerHTML = `
        <h3 style="margin: 0 0 10px 0;">${isSuccess ? 'Thank You!' : 'Error'}</h3>
        <p style="margin: 0;">${message}</p>
    `;
    
    document.body.appendChild(popup);
    
    // Remove popup after 3 seconds
    setTimeout(() => {
        popup.style.opacity = '0';
        popup.style.transition = 'opacity 0.5s ease';
        setTimeout(() => popup.remove(), 500);
    }, 3000);
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact_form');
    const submitButton = document.getElementById('send_message');
    
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            // Basic validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                createPopup('Please fill in all required fields', false);
                return;
            }
            
            // Show sending state
            submitButton.disabled = true;
            submitButton.value = 'Sending...';
            
            try {
                const { data, error } = await supabaseClient
                    .from('contacts')
                    .insert([{ name, email, message }]);

                if (error) {
                    console.error('Error:', error.message);
                    createPopup('There was an error sending your message. Please try again.', false);
                } else {
                    console.log('Success:', data);
                    createPopup('Your message has been sent successfully! We will get back to you soon.');
                    form.reset(); // Clear the form
                }
            } catch (err) {
                console.error('Error:', err);
                createPopup('There was an error sending your message. Please try again.', false);
            } finally {
                // Reset button state
                submitButton.disabled = false;
                submitButton.value = 'Submit Form';
            }
        });
    } else {
        console.error('Contact form not found');
    }
});
