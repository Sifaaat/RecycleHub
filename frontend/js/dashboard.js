async function loadDashboard() {
    const { ok, data } = await apiRequest("/products");
    if (!ok || !data.success) return;

    const products = data.products;

    // Total products count
    const totalEl = document.getElementById("totalProducts");
    if (totalEl) totalEl.textContent = products.length;

    // Recent products table
    const tbody = document.getElementById("recentProductsBody");
    if (tbody && products.length) {
        tbody.innerHTML = products.slice(0, 5).map(p => `
            <tr>
                <td>${p.name}</td>
                <td>${p.category}</td>
                <td>৳${p.price}</td>
                <td>${p.status}</td>
            </tr>`).join("");
    }
}
loadDashboard();
