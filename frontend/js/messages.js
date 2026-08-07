// ===============================
// Messages / Chat  (messages.html)
// ===============================
requireAuth();

const me = getUser();

const conversationList = document.getElementById("conversationList");
const chatPlaceholder = document.getElementById("chatPlaceholder");
const chatThreadWrap = document.getElementById("chatThreadWrap");
const chatHeader = document.getElementById("chatHeader");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");

// Currently open thread
let active = null; // { productId, otherId, otherName, productName, price }
let pollTimer = null;

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function formatTime(ts) {
    const d = new Date(ts);
    if (isNaN(d)) return "";
    return d.toLocaleString([], {
        month: "short", day: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

// ---- Conversation list (inbox) ----
async function loadConversations() {
    const { ok, data } = await apiRequest("/messages/conversations", "GET", null, true);
    if (!ok || !data.success) {
        conversationList.innerHTML = "<h2>Chats</h2><p class='chat-empty'>Could not load chats.</p>";
        return;
    }

    let html = "<h2>Chats</h2>";
    if (!data.conversations.length) {
        html += "<p class='chat-empty'>No conversations yet. Open a product and press \"Contact Seller\" to start.</p>";
    } else {
        html += data.conversations.map(c => {
            const isActive = active &&
                Number(active.productId) === Number(c.product_id) &&
                Number(active.otherId) === Number(c.other_id);
            return `
            <div class="conversation-item ${isActive ? "active" : ""}"
                 data-product="${c.product_id}"
                 data-other="${c.other_id}"
                 data-name="${escapeHTML(c.other_name)}"
                 data-product-name="${escapeHTML(c.product_name)}"
                 data-price="${c.product_price}">
                <div class="conv-top">
                    <span class="conv-name">${escapeHTML(c.other_name)}</span>
                    <span class="conv-time">${formatTime(c.created_at)}</span>
                </div>
                <div class="conv-product">${escapeHTML(c.product_name)}</div>
                <div class="conv-last">${escapeHTML(c.last_message)}</div>
            </div>`;
        }).join("");
    }
    conversationList.innerHTML = html;

    conversationList.querySelectorAll(".conversation-item").forEach(el => {
        el.addEventListener("click", function () {
            openThread({
                productId: this.dataset.product,
                otherId: this.dataset.other,
                otherName: this.dataset.name,
                productName: this.dataset.productName,
                price: this.dataset.price
            });
        });
    });
}

// ---- Open a single thread ----
async function openThread(info) {
    active = info;
    chatPlaceholder.style.display = "none";
    chatThreadWrap.style.display = "flex";

    const priceLine = (info.price !== undefined && info.price !== "" && info.price !== "undefined")
        ? ` · <span class="chat-price">Listed at ৳${info.price}</span>`
        : "";
    chatHeader.innerHTML = `
        <div class="chat-with">${escapeHTML(info.otherName || "Seller")}</div>
        <div class="chat-about">${escapeHTML(info.productName || "Product")}${priceLine}</div>`;

    // reflect active state in the list
    conversationList.querySelectorAll(".conversation-item").forEach(el => {
        const on = Number(el.dataset.product) === Number(info.productId) &&
                   Number(el.dataset.other) === Number(info.otherId);
        el.classList.toggle("active", on);
    });

    await loadThread(true);
    chatInput.focus();
}

async function loadThread(scroll) {
    if (!active) return;
    const endpoint = `/messages/thread?product=${active.productId}&with=${active.otherId}`;
    const { ok, data } = await apiRequest(endpoint, "GET", null, true);
    if (!ok || !data.success) return;

    if (!data.messages.length) {
        chatMessages.innerHTML = `<p class="chat-empty">No messages yet. Say hi and make your offer!</p>`;
        return;
    }

    chatMessages.innerHTML = data.messages.map(m => {
        const mine = Number(m.sender_id) === Number(me.id);
        return `
        <div class="bubble-row ${mine ? "mine" : "theirs"}">
            <div class="bubble">
                <div class="bubble-text">${escapeHTML(m.content)}</div>
                <div class="bubble-time">${formatTime(m.created_at)}</div>
            </div>
        </div>`;
    }).join("");

    if (scroll) chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ---- Send a message ----
if (chatForm) {
    chatForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const content = chatInput.value.trim();
        if (!content || !active) return;

        chatInput.value = "";
        const body = {
            product_id: active.productId,
            receiver_id: active.otherId,
            content
        };
        const { ok, data } = await apiRequest("/messages", "POST", body, true);
        if (!ok || !data.success) {
            alert((data && data.message) || "Could not send message.");
            chatInput.value = content; // restore so it isn't lost
            return;
        }
        await loadThread(true);
        loadConversations();
    });
}

// ---- Polling for new messages (~4s) ----
function startPolling() {
    if (pollTimer) return;
    pollTimer = setInterval(() => {
        if (active) loadThread(false);
        loadConversations();
    }, 4000);
}

// ---- Init: open thread from ?product= & ?to= if provided ----
async function init() {
    await loadConversations();

    const params = new URLSearchParams(window.location.search);
    const product = params.get("product");
    const to = params.get("to");

    if (product && to) {
        // Try to enrich header from the product details endpoint
        let productName = "Product";
        let otherName = "Seller";
        let price;
        const { ok, data } = await apiRequest("/products/" + product);
        if (ok && data.success) {
            productName = data.product.name;
            otherName = data.product.seller_name || "Seller";
            price = data.product.price;
        }
        openThread({ productId: product, otherId: to, otherName, productName, price });
    }

    startPolling();
}

init();
