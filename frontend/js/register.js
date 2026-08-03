// ===============================
// Register Form Validation
// ===============================

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (
        fullname === "" ||
        email === "" ||
        phone === "" ||
        password === "" ||
        confirmPassword === ""
    ) {

        alert("Please fill in all fields.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");
        return;
    }

    if (phone.length < 11) {

        alert("Please enter a valid phone number.");
        return;
    }

    if (password.length < 6) {

        alert("Password must be at least 6 characters.");
        return;
    }

    if (password !== confirmPassword) {

        alert("Passwords do not match.");
        return;
    }

    alert("Registration Successful!");

    registerForm.reset();

    // Later:
    // Send data to Node.js backend
});