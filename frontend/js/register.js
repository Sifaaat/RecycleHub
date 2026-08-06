const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const full_name = document.getElementById("fullname").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!full_name || !email || !phone || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }
        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!isValidPhone(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }
        if (!isStrongEnough(password)) {
            alert("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const { ok, data } = await apiRequest(
            "/auth/register",
            "POST",
            { full_name, email, phone, password }
        );

        if (!ok || !data.success) {
            alert(data.message || "Registration failed.");
            return;
        }

        alert("Registration Successful! Please login.");
        window.location.href = "login.html";
    });
}
