// ===============================
// RecycleHub API Helper
// ===============================

// Use relative path so it works both locally and when deployed
const API_URL = "/api";

// ---- Token & user storage ----
function saveAuth(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
}
function getToken() {
    return localStorage.getItem("token");
}
function getUser() {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
}
function isLoggedIn() {
    return !!getToken();
}
function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "login.html";
}
// Redirect to login if not authenticated (use on protected pages)
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = "login.html";
    }
}

// ---- Generic request ----
async function apiRequest(endpoint, method = "GET", body = null, auth = false) {
    const headers = { "Content-Type": "application/json" };
    if (auth && getToken()) {
        headers["Authorization"] = "Bearer " + getToken();
    }
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    try {
        const res = await fetch(API_URL + endpoint, options);
        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    } catch (err) {
        return {
            ok: false,
            status: 0,
            data: { success: false, message: "Cannot reach server. Is the backend running?" }
        };
    }
}

// ---- Dynamic navbar login/logout link ----
function renderAuthLink() {
    const el = document.getElementById("authLink");
    if (!el) return;

    if (isLoggedIn()) {
        el.innerHTML = '<a href="#" id="logoutBtn">Logout</a>';
        const btn = document.getElementById("logoutBtn");
        if (btn) {
            btn.addEventListener("click", function (e) {
                e.preventDefault();
                logout();
            });
        }
    } else {
        el.innerHTML = '<a href="login.html">Login</a>';
    }
}
document.addEventListener("DOMContentLoaded", renderAuthLink);
