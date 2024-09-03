document.addEventListener('DOMContentLoaded', () => {
    // Yeni Ürün Oluşturma Formu
    const createProductForm = document.getElementById('createProductForm');
    if (createProductForm) {
        createProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                Name: document.getElementById('productName').value,
                Barcode: document.getElementById('productBarcode').value,
                Quantity: parseInt(document.getElementById('productQuantity').value, 10),
                Unit: document.getElementById('productUnit').value, // Unit alanını ekledik
                CategoryName: document.getElementById('productCategory').value,
                UserName: document.getElementById('productUser').value

            };

            try {
                const response = await fetch('https://localhost:7554/api/admin/Admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Ürün başarıyla eklendi');
                    createProductForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Ürün eklenirken bir hata oluştu: ${errorData.message || 'Bilinmeyen hata'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata oluştu: ' + error.message);
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', async () => {
    // Ürünleri almak ve select öğesini doldurmak için fonksiyon
    async function fetchAndPopulateProducts() {
        const productNameSelect = document.getElementById('productNameSelect'); // Select öğesini seçiyoruz

        if (!productNameSelect) {
            console.error('ID "productNameSelect" olan öğe bulunamadı.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7554/api/admin/Admin');
            if (!response.ok) {
                throw new Error('Ürünler alınamadı.');
            }

            const products = await response.json();

            // Eğer ürünler bir $values dizisinde değilse, uygun formatı kontrol et
            const productsArray = products['$values'] || products;

            // Select öğesindeki mevcut seçenekleri temizle
            productNameSelect.innerHTML = '';

            // Ürünleri select öğesine ekle
            productsArray.forEach(product => {
                const option = document.createElement('option');
                option.value = product.name; // Ürün adını değere ayarla
                option.textContent = product.name; // Ürün adını metin olarak ayarla
                productNameSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Hata:', error);
            alert('Ürünler alınırken bir hata oluştu: ' + error.message);
        }
    }

    // Sayfa yüklendiğinde ürünleri yükle
    await fetchAndPopulateProducts();

    // Silme formu işlemleri
    const deleteProductForm = document.getElementById('deleteProductForm');
    const productNameSelect = document.getElementById('productNameSelect');

    if (deleteProductForm) {
        deleteProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const productName = productNameSelect.value;

            if (!productName) {
                alert('Lütfen bir ürün seçin.');
                return;
            }

            try {
                const response = await fetch(`https://localhost:7554/api/admin/Admin/ByName/${encodeURIComponent(productName)}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Ürün başarıyla silindi!');
                    window.location.href = 'admin-dashboard.html';
                } else if (response.status === 404) {
                    alert('Bu ada sahip bir ürün bulunamadı.');
                } else {
                    alert('Ürün silme sırasında bir hata oluştu: ' + response.statusText);
                }
            } catch (error) {
                alert('Ürün silme sırasında bir hata oluştu: ' + error.message);
            }
        });
    }
});
