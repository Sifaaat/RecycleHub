// ===============================
// Product List + Search  (products.html)
// ===============================
const productsContainer = document.querySelector(".products-container");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

function productCard(p) {
    const imgSrc = p.image ? `http://localhost:5000${p.image}` : null;
    const imgHTML = imgSrc
        ? `<img src="${imgSrc}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">`
        : `<div style="height:100%; display:flex; align-items:center; justify-content:center; font-size:24px; font-weight:bold; color:#166534;">${p.category}</div>`;

    return `
    <div class="product-card">
        <div class="product-image">${imgHTML}</div>
        <div class="product-info">
            <h3>${p.name}</h3>
            <p>Price: ৳${p.price}</p>
            <p>Location: ${p.location || "N/A"}</p>
            <a href="product-details.html?id=${p.id}" class="btn">View Details</a>
        </div>
    </div>`;
}

function renderProducts(list) {
    if (!productsContainer) return;
    if (!list.length) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }
    productsContainer.innerHTML = list.map(productCard).join("");
}

async function loadProducts() {
    if (!productsContainer) return;
    const { ok, data } = await apiRequest("/products");
    if (ok && data.success) {
        allProducts = data.products;
        renderProducts(allProducts);
    } else {
        productsContainer.innerHTML = "<p>Could not load products.</p>";
    }
}

if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        const value = searchInput.value.toLowerCase();
        const filtered = allProducts.filter(p =>
            (p.name + p.location + p.category).toLowerCase().includes(value)
        );
        renderProducts(filtered);
    });
}

loadProducts();

// ===============================
// Add Product Form  (add-product.html)
// ===============================
const productForm = document.getElementById("productForm");

if (productForm) {
    requireAuth(); // must be logged in to sell

    productForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Build FormData (for file upload)
        const formData = new FormData();
        formData.append("name", document.getElementById("productName").value.trim());
        formData.append("category", document.getElementById("category").value);
        formData.append("price", document.getElementById("price").value);
        formData.append("quantity", document.getElementById("quantity").value);
        formData.append("location", document.getElementById("location").value.trim());
        formData.append("description", document.getElementById("description").value.trim());

        const imageInput = document.getElementById("image");
        if (imageInput && imageInput.files[0]) {
            formData.append("image", imageInput.files[0]);
        }

        if (!formData.get("name") || !formData.get("price")) {
            alert("Please enter product name and price.");
            return;
        }

        // Send FormData with fetch (don't set Content-Type header — browser sets it with boundary)
        try {
            const token = getToken();
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: { "Authorization": "Bearer " + token },
                body: formData
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.message || "Could not add product.");
                return;
            }

            alert("Product Added Successfully!");
            productForm.reset();
            window.location.href = "products.html";
        } catch (err) {
            alert("Server error: " + err.message);
        }
    });
}

// ===============================
// Product Details  (product-details.html)
// ===============================
const detailsInfo = document.querySelector(".details-info");

async function loadProductDetails() {
    if (!detailsInfo) return;

    // Must be logged in to view product details / contact seller
    requireAuth();

    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) return; // no id -> keep the demo content

    const { ok, data } = await apiRequest("/products/" + id);
    if (!ok || !data.success) {
        detailsInfo.innerHTML =
            "<h1>Product not found</h1><a href='products.html' class='btn'>Back</a>";
        return;
    }

    const p = data.product;
    const imageBox = document.querySelector(".details-image");
    if (imageBox) {
        if (p.image) {
            imageBox.innerHTML = `<img src="http://localhost:5000${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover; border-radius:15px;">`;
        } else {
            imageBox.textContent = p.category;
        }
    }

    detailsInfo.innerHTML = `
        <h1>${p.name}</h1>
        <h2>৳${p.price}</h2>
        <p><strong>Category:</strong> ${p.category}</p>
        <p><strong>Location:</strong> ${p.location || "N/A"}</p>
        <p><strong>Quantity:</strong> ${p.quantity} Kg</p>
        <p><strong>Seller:</strong> ${p.seller_name || "Unknown"}</p>
        <p><strong>Phone:</strong> ${p.seller_phone || "N/A"}</p>
        <h3>Description</h3>
        <p>${p.description || "No description provided."}</p>
        <div class="details-buttons">
            <button id="contactBtn" class="btn">Contact Seller</button>
            <a href="products.html" class="btn btn-outline">Back</a>
        </div>`;

    // Contact Seller button -> show phone / offer to call
    const contactBtn = document.getElementById("contactBtn");
    if (contactBtn) {
        contactBtn.addEventListener("click", function () {
            const phone = p.seller_phone;
            const name = p.seller_name || "Seller";
            if (!phone) {
                alert("Seller contact number is not available.");
                return;
            }
            const call = confirm(
                "Contact " + name + "\n\nPhone: " + phone + "\n\nPress OK to call now."
            );
            if (call) {
                window.location.href = "tel:" + phone;
            }
        });
    }
}
loadProductDetails();
