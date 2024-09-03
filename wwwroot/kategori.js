document.addEventListener('DOMContentLoaded', () => {
    const createProductForm = document.getElementById('createProductForm');
    const categoryForm = document.getElementById('categoryForm');
    const categoryList = document.getElementById('categoryList');

    if (createProductForm) {
        createProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            // Ürün ekleme işlemlerini buraya ekleyin
        });
    }

    if (categoryForm) {
        categoryForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const categoryName = document.getElementById('categoryName').value.trim();
            const userName = document.getElementById('userName').value.trim();

            if (!categoryName || !userName) {
                console.error('Kategori adı veya kullanıcı adı boş olamaz!');
                return;
            }

            try {
                const response = await fetch('https://localhost:7554/api/Category', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: categoryName, userName: userName })
                });

                if (!response.ok) {
                    throw new Error('Kategori eklenirken bir hata oluştu');
                }

                const data = await response.json();
                console.log('Eklendi veri:', data);
                addCategoryToList(data);  // Kategori listesini güncelle
                categoryForm.reset();
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }


    async function loadCategories() {
        try {
            const response = await fetch('https://localhost:7554/api/Category');
            if (!response.ok) {
                throw new Error('Ağ yanıtı başarısız: ' + response.statusText);
            }

            const data = await response.json();
            const categories = Array.isArray(data) ? data : data.$values || [];

            if (categoryList) {
                categoryList.innerHTML = '';

                categories.forEach(category => {
                    const categoryItem = document.createElement('li');
                    categoryItem.className = 'category-item';
                    categoryItem.textContent = category.name;
                    categoryItem.dataset.id = category.id;

                    const productList = document.createElement('ul');
                    productList.className = 'product-list';
                    productList.style.display = 'none';
                    categoryItem.appendChild(productList);

                    categoryItem.addEventListener('click', async () => {
                        if (productList.style.display === 'none') {
                            await loadProductsByCategory(category.id, productList);
                            productList.style.display = 'block';
                        } else {
                            productList.style.display = 'none';
                        }
                    });

                    categoryList.appendChild(categoryItem);
                });
            }

        } catch (error) {
            alert(error.message);
        }
    }

    async function loadProductsByCategory(categoryId, productList) {
        try {
            const response = await fetch(`https://localhost:7554/api/Category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Ağ yanıtı başarısız: ' + response.statusText);
            }

            const data = await response.json();
            const products = data.products.$values || [];

            productList.innerHTML = '';

            products.forEach(product => {
                const productItem = document.createElement('li');
                productItem.className = 'product-item';
                productItem.innerHTML = `
                    <strong>Ürün Adı:</strong> ${product.name}<br>
                    <strong>Barkod:</strong> ${product.barcode}<br>
                    <strong>Miktar:</strong> ${product.quantity} ${product.unit || 'Birim Bilgisi Yok'}<br>
                    <strong>Eklenme Tarihi:</strong> ${new Date(product.addedDate).toLocaleDateString('tr-TR')}<br>
                    <strong>Güncellenme Tarihi:</strong> ${new Date(product.updatedDate).toLocaleDateString('tr-TR')}<br>
                    <strong>Kullanıcı:</strong> ${product.userName}
                `;
                productList.appendChild(productItem);
            });

        } catch (error) {
            alert('Ürünleri yüklerken bir hata oluştu: ' + error.message);
        }
    }

    loadCategories();
});