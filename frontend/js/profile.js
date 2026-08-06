requireAuth();

async function loadProfile() {
    const { ok, data } = await apiRequest("/users/profile", "GET", null, true);

    if (!ok || !data.success) {
        alert(data.message || "Session expired. Please login again.");
        logout();
        return;
    }

    const u = data.user;
    const initials = u.full_name
        .split(" ")
        .map(w => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    document.getElementById("profileAvatar").textContent = initials;
    document.getElementById("profileName").textContent = u.full_name;
    document.getElementById("profileRole").textContent = "Role: " + u.role;
    document.getElementById("profileEmail").textContent = u.email;
    document.getElementById("profilePhone").textContent = u.phone;
}
loadProfile();
