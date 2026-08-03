const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    if (email === "" || password === "") {

        alert("Please fill in all fields.");

        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        return;
    }

    if (password.length < 6) {

        alert("Password must be at least 6 characters.");

        return;
    }

    alert("Login Successful!");

    // Later:
    // Connect with Node.js Backend
});