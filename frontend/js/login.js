const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            alert("Please fill in all fields.");
            return;
        }
        if (!isValidEmail(email)) {
            alert("Please enter a valid email address.");
            return;
        }
        if (!isStrongEnough(password)) {
            alert("Password must be at least 6 characters.");
            return;
        }

        const { ok, data } = await apiRequest("/auth/login", "POST", { email, password });

        if (!ok || !data.success) {
            alert(data.message || "Login failed.");
            return;
        }

        saveAuth(data.token, data.user);
        alert("Login Successful!");
        window.location.href = "index.html";
    });
}
