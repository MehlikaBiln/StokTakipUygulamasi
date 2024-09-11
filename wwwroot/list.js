document.addEventListener('DOMContentLoaded', () => {
    async function loadProducts(filter = {}) {
        try {
            // API'den ürün ve depo verilerini al
            const [productResponse, depotResponse] = await Promise.all([
                fetch('https://localhost:7554/api/admin/Admin'),
                fetch('https://localhost:7554/api/admin/Admin/products-with-depot-info')
            ]);

            if (!productResponse.ok || !depotResponse.ok) {
                throw new Error('API yanıtı başarısız');
            }

            const productData = await productResponse.json();
            const depotData = await depotResponse.json();

            const products = Array.isArray(productData) ? productData : productData.$values || [];
            const depots = Array.isArray(depotData) ? depotData : depotData.$values || [];

            const tbody = document.querySelector('#productList tbody');
            tbody.innerHTML = '';

            // Depoları toplamak için Set kullanıyoruz (depo isimleri dinamik olacak)
            const allDepots = new Set(depots.map(depot => depot.depotName));

            // Ürünleri filtreleme işlemi
            const filteredProducts = products.filter(product => {
                const matchName = filter.name ? product.name.toLowerCase().includes(filter.name.toLowerCase()) : true;
                const matchBarcode = filter.barcode ? product.barcode.toLowerCase().includes(filter.barcode.toLowerCase()) : true;
                const matchCategory = filter.categoryName ? product.categoryName.toLowerCase().includes(filter.categoryName.toLowerCase()) : true;

                return matchName && matchBarcode && matchCategory;
            });

            // Ürünleri gruplayarak toplam miktarı ve depo dağılımlarını bul
            const productMap = new Map();

            depots.forEach(depot => {
                const { name, quantityInDepot, depotName } = depot;
                if (!productMap.has(name)) {
                    productMap.set(name, {
                        totalQuantity: 0,
                        depots: {},
                        ...filteredProducts.find(p => p.name === name) // Ürünün diğer bilgilerini bul
                    });
                }
                const product = productMap.get(name);
                product.totalQuantity += quantityInDepot; // Toplam miktarı artır
                product.depots[depotName] = quantityInDepot; // Depoya göre miktarı kaydet
            });

            // Tablo başlıklarına depo isimlerini ekle
            const thead = document.querySelector('#productList thead tr');
            thead.innerHTML = `
            <th>Barkod</th>
            <th>Ürün Adı</th>
            <th>Toplam Miktar</th>
            <th>Birim</th>
            <th>Eklenme Tarihi</th>
            <th>Güncelleme Tarihi</th>
            <th>Kullanıcı Adı</th>
        `;

            // Dinamik depo başlıklarını ekle
            allDepots.forEach(depotName => {
                const th = document.createElement('th');
                th.innerText = depotName;
                thead.appendChild(th);
            });

            // Grupladığımız ürünleri tabloya ekle
            productMap.forEach(product => {
                if (!product.name) return; // Filtreleme sonrası boş satır eklememek için kontrol
                const row = document.createElement('tr');
                row.innerHTML = `
                <td>${product.barcode}</td>
                <td>${product.name}</td>
                <td>${product.totalQuantity}</td>
                <td>${product.unit || 'Belirtilmemiş'}</td>
                <td>${new Date(product.addedDate).toLocaleDateString('tr-TR')}</td>
                <td>${new Date(product.updatedDate).toLocaleDateString('tr-TR')}</td>
                <td>${product.userName || 'Belirtilmemiş'}</td>
            `;

                // Her depo için miktarı ekle (yoksa 0 yaz)
                allDepots.forEach(depotName => {
                    const quantity = product.depots[depotName] || 0;
                    const depotCell = document.createElement('td');
                    depotCell.innerText = quantity > 0 ? `${quantity} adet` : '-';
                    row.appendChild(depotCell);
                });

                tbody.appendChild(row);
            });

            // Eğer hiçbir ürün bulunmazsa, kullanıcıya mesaj göster
            if (!tbody.hasChildNodes()) {
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="${thead.children.length}">Aradığınız kriterlere uygun ürün bulunamadı.</td>`;
                tbody.appendChild(row);
            }
        } catch (error) {
            alert('Ürünleri yüklerken bir hata oluştu: ' + error.message);
        }
    }

    // Arama formunun submit olayı
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

            // Filtrelenmiş ürünleri getir
            loadProducts(Object.keys(filter).length ? filter : {});
        });
    }

    // Sayfa yüklendiğinde tüm ürünleri göster
    window.onload = loadProducts;



    // Arama formunu işleyen fonksiyon
  
});
