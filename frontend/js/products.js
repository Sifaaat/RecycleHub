// ===============================
// Product List + Search  (products.html)
// ===============================
const productsContainer = document.querySelector(".products-container");
const searchInput = document.getElementById("searchInput");

let allProducts = [];

function productCard(p) {
    return `
    <div class="product-card">
        <div class="product-image">${p.category}</div>
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

        const imageInput = document.getElementById("image");
        const body = {
            name: document.getElementById("productName").value.trim(),
            category: document.getElementById("category").value,
            price: document.getElementById("price").value,
            quantity: document.getElementById("quantity").value,
            location: document.getElementById("location").value.trim(),
            description: document.getElementById("description").value.trim(),
            image: imageInput && imageInput.files[0] ? imageInput.files[0].name : null
        };

        if (!body.name || !body.price) {
            alert("Please enter product name and price.");
            return;
        }

        const { ok, data } = await apiRequest("/products", "POST", body, true);
        if (!ok || !data.success) {
            alert(data.message || "Could not add product.");
            return;
        }

        alert("Product Added Successfully!");
        productForm.reset();
        window.location.href = "products.html";
    });
}

// ===============================
// Product Details  (product-details.html)
// ===============================
const detailsInfo = document.querySelector(".details-info");

async function loadProductDetails() {
    if (!detailsInfo) return;

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
    if (imageBox) imageBox.textContent = p.category;

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
            <a href="tel:${p.seller_phone || ""}" class="btn">Contact Seller</a>
            <a href="products.html" class="btn btn-outline">Back</a>
        </div>`;
}
loadProductDetails();
