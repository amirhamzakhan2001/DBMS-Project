console.log('Admin login script loaded.');


function setupAdminLogin() {
    const loginForm = document.getElementById('adminLoginForm');
    if (!loginForm) {
        console.log('Login form not found'); // Debugging log
        return;
    }

    loginForm.onsubmit = async function (event) {
        console.log('Form submit event triggered'); // Check if event triggers
        event.preventDefault(); // Prevent the default form submission behavior

        const admin_name = document.getElementById('admin_name').value;
        const password = document.getElementById('password').value;
        console.log(`Admin Name: ${admin_name}, Password: ${password}`); // Debugging log

        try {
            const response = await fetch('http://localhost:3000/api/admin/admin-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ admin_name, password })
            });

            const data = await response.json();
            console.log('Response from server:', data); // Debugging log

            if (data.success) {
                console.log('Login successful'); // Check if login succeeds
                localStorage.setItem('token', data.token); // Save token to localStorage
                window.location.href = 'admin_dashboard.html'; // Redirect
            } else {
                alert('Invalid credentials, please try again.');
            }
        } catch (error) {
            console.error('Error:', error); // Log the error
            alert('There was an error with the login. Please try again.');
        }
    };
}


// Call setupAdminLogin directly
setupAdminLogin(); // Set up the login form
checkSessionStatus(); // Check session status for this page