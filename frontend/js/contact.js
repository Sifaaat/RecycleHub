const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const body = {
            name: document.getElementById("name").value.trim(),
            email: document.getElementById("email").value.trim(),
            subject: document.getElementById("subject").value.trim(),
            message: document.getElementById("message").value.trim()
        };

        if (!body.name || !body.email || !body.message) {
            alert("Please fill in name, email and message.");
            return;
        }

        const { ok, data } = await apiRequest("/contact", "POST", body);
        if (!ok || !data.success) {
            alert(data.message || "Could not send message.");
            return;
        }

        alert("Message Sent Successfully!");
        contactForm.reset();
    });
}
