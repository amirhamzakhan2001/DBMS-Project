// client_login.js

console.log('Initializing client login and registration. ');

function setupClientLogin() {
    
    console.log('Initializing client login and registration script. ........ ');

    const client_container = document.getElementById('client_container');
    const client_signInBtn = document.getElementById('client_login');
    const client_signUpBtn = document.getElementById('client_register');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message'); // Element for displaying errors

    // Clear error message on input focus
    const clearErrorMessage = () => {
        errorMessage.textContent = '';
        console.log('Error message cleared'); // Log when error message is cleared
    };

    // Toggle between sign-in and sign-up
    client_signUpBtn.addEventListener('click', () => {
        client_container.classList.add('active'); // Show the registration form
        console.log('Switched to registration form'); // Log the toggle action
    });

    client_signInBtn.addEventListener('click', () => {
        client_container.classList.remove('active'); // Show the login form
        console.log('Switched to login form'); // Log the toggle action
    });

    // Handle registration
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission
            clearErrorMessage(); // Clear previous error messages

            const formData = new FormData(registerForm);
            const data = {
                full_name: formData.get('full_name'),
                email: formData.get('email'),
                password: formData.get('password'),
            };

            console.log('Registration data:', data); // Log registration data

            // Basic validation
            if (!data.full_name || !data.email || !data.password) {
                errorMessage.textContent = 'All fields are required.';
                console.log('Validation failed: All fields are required.'); // Log validation failure
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/client/client-register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
                const result = await response.json();

                console.log('Registration response:', result); // Log the server response

                if (result.success) {
                    alert(result.message); // Show success message
                    window.location.href = 'client_login.html'; // Optionally redirect to login page
                } else {
                    errorMessage.textContent = result.errors ? result.errors.map(err => err.msg).join(', ') : result.message; // Display error messages
                    console.log('Registration failed:', result.message); // Log failure message
                }
            } catch (error) {
                console.error('Error during registration:', error);
                errorMessage.textContent = 'An error occurred. Please try again.';
                console.log('Catch block error during registration:', error); // Log catch block error
            }
        });
    }

    // Handle login
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission
            clearErrorMessage(); // Clear previous error messages

            const email = document.getElementById('login_email').value.trim();
            const password = document.getElementById('login_password').value.trim();

            console.log('Login data:', { email, password }); // Log login data

            // Basic validation
            if (!email || !password) {
                errorMessage.textContent = 'Email and password are required.';
                console.log('Validation failed: Email and password are required.'); // Log validation failure
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/api/client/client-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });
            
                const result = await response.json(); // Parse JSON response

                console.log('Login response:', result); // Log the server response
            
                // Check if the response was successful
                if (response.ok) {
                    // If the login was successful, redirect to the dashboard
                    if (result.success) {
                        alert(result.message); // Show success message
                        localStorage.setItem('token', result.token); // Save token to localStorage
                        sessionStorage.setItem('isClientLoggedIn', 'true'); // Set client login flag
                        sessionStorage.setItem('client_id', result.client_id); // store client id in session storage
                        window.location.href = 'index.html'; // Redirect to dashboard or home
                        console.log('Login successful, redirecting to dashboard'); // Log successful login
                    } else {
                        // Display error message from the server
                        errorMessage.textContent = result.message; // e.g., "Email not registered!" or "Invalid password!"
                        alert(result.message); // Show alert for failed login
                        console.log('Login failed:', result.message); // Log failure message
                    }
                } else {
                    // Handle non-200 responses (like 401 Unauthorized) with a relevant message
                    errorMessage.textContent = result.message || 'Login failed. Please try again.'; // Fallback message
                    alert(result.message || 'Login failed. Please try again.'); // Show alert for non-200 response
                    console.log('Non-200 response during login:', result.message); // Log non-200 response
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please try again.'); // User-friendly message
                console.log('Catch block error during login:', error); // Log catch block error
            }
        });   
    }
}


// Call the function to set up the client login
setupClientLogin();
checkSessionStatus(); // Check session status for this page
