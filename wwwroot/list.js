document.addEventListener('DOMContentLoaded', () => {
    async function loadProducts(filter = {}) {
        try {
            // Filtreleme parametrelerini oluştur
            const query = new URLSearchParams(filter).toString();
            const url = query ? `https://localhost:7554/api/admin/Admin/WithFilter?${query}` : 'https://localhost:7554/api/admin/Admin';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Ağ yanıtı başarısız: ' + response.statusText);
            }

            const data = await response.json();

            // JSON verisini kontrol et ve uygun formata dönüştür
            const products = Array.isArray(data) ? data : data.$values || [];

            if (!products.length) {
                throw new Error('Beklenen ürünler dizisi bulunamadı');
            }

            const tbody = document.querySelector('#productList tbody');
            tbody.innerHTML = '';

            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.barcode}</td>
                    <td>${product.quantity}</td>
                    <td>${product.unit || 'Belirtilmemiş'}</td> <!-- Birim sütunu -->
                    <td>${new Date(product.addedDate).toLocaleDateString('tr-TR')}</td>
                    <td>${new Date(product.updatedDate).toLocaleDateString('tr-TR')}</td>
                    <td>${product.categoryName || 'Belirtilmemiş'}</td>
                    <td>${product.userName || 'Belirtilmemiş'}</td>
                `;
                tbody.appendChild(row);
            });

        } catch (error) {
            alert('Ürünleri yüklerken bir hata oluştu: ' + error.message);
        }
    }

    // Arama formunu işleyen fonksiyon
    const searchProductForm = document.getElementById('searchProductForm');
    if (searchProductForm) {
        searchProductForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const barcode = document.getElementById('barcode').value;
            const categoryName = document.getElementById('categoryName').value;

            // Filtreleme parametrelerini oluştur
            const filter = {};
            if (name) filter.name = name;
            if (barcode) filter.barcode = barcode;
            if (categoryName) filter.categoryName = categoryName;

            // Eğer filtre yoksa tüm ürünleri getir
            loadProducts(Object.keys(filter).length ? filter : {});
        });
    }

    // Sayfa yüklendiğinde tüm ürünleri göster
    loadProducts();
});
