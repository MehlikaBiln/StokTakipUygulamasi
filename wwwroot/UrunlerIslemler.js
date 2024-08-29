document.addEventListener('DOMContentLoaded', async () => {

    const productNameSelect = document.getElementById('productName');
    const removeProductNameSelect = document.getElementById('removeProductName');

    // API'den ürün seçeneklerini almak ve select elemanlarını doldurmak için fonksiyon
    async function fetchAndPopulateProducts() {
        try {
            const response = await fetch('https://localhost:7554/api/admin/Admin'); // Gerçek API endpoint'i buraya yazın
            if (!response.ok) {
                throw new Error('Ürünler alınamadı.');
            }

            const products = await response.json();

            // API yanıtından ürün listesini alın
            const productsArray = products['$values'];

            // Mevcut seçenekleri temizliyoruz
            productNameSelect.innerHTML = '';
            removeProductNameSelect.innerHTML = '';

            // Select elemanlarını alınan ürünlerle dolduruyoruz
            productsArray.forEach(product => {
                const option = document.createElement('option');
                option.value = product.name; // Ürün nesnesinde 'name' özelliği olduğunu varsayıyoruz
                option.textContent = product.name;

                // Her iki select elemanına da seçenekleri ekliyoruz
                productNameSelect.appendChild(option.cloneNode(true));
                removeProductNameSelect.appendChild(option.cloneNode(true));
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Ürünler alınırken bir hata oluştu: ' + error.message);
        }
    }

    // Sayfa yüklendiğinde ürün seçeneklerini almak ve doldurmak için fonksiyonu çağırıyoruz
    await fetchAndPopulateProducts();

    // Ürün Ekleme Formu
    const addProductForm = document.querySelector('#addProductFormElement');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                productName: document.getElementById('productName').value,
                quantityToAdd: parseInt(document.getElementById('quantityToAdd').value, 10),
                quantityToRemove: 0 // Çıkarma yapılmayacaksa 0
            };

            try {
                const response = await fetch('https://localhost:7554/api/admin/Admin/increaseByName', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Ürün ekleme başarısız.');
                }

                alert('Ürün başarıyla eklendi!');
                addProductForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata oluştu: ' + error.message);
            }
        });
    }

    // Ürün Çıkarma Formu
    const removeProductForm = document.querySelector('#removeProductFormElement');
    if (removeProductForm) {
        removeProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                productName: document.getElementById('removeProductName').value,
                quantityToRemove: parseInt(document.getElementById('removeProductQuantity').value, 10)
            };

            try {
                const response = await fetch('https://localhost:7554/api/admin/Admin/decreaseByName', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Ürün çıkarma başarısız.');
                }

                alert('Ürün başarıyla çıkarıldı!');
                removeProductForm.reset();
            } catch (error) {
                console.error('Error:', error);

                alert('Bir hata oluştu: ' + error.message);
            }

        });

    }

});



// USER KISMI

document.addEventListener('DOMContentLoaded', async () => {
    const productNameSelect = document.getElementById('userProductName');
    const removeProductNameSelect = document.getElementById('removeUserProductName');

    // API'den ürün seçeneklerini almak ve select elemanlarını doldurmak için fonksiyon
    async function fetchAndPopulateProducts() {
        try {
            const response = await fetch('https://localhost:7554/api/admin/Admin'); // Gerçek API endpoint'i buraya yazın
            if (!response.ok) {
                throw new Error('Ürünler alınamadı.');
            }

            const products = await response.json();

            // API yanıtından ürün listesini alın
            const productsArray = products['$values'];

            // Mevcut seçenekleri temizliyoruz
            if (productNameSelect && removeProductNameSelect) {
                productNameSelect.innerHTML = '';
                removeProductNameSelect.innerHTML = '';

                // Select elemanlarını alınan ürünlerle dolduruyoruz
                productsArray.forEach(product => {
                    const option = document.createElement('option');
                    option.value = product.name; // Ürün nesnesinde 'name' özelliği olduğunu varsayıyoruz
                    option.textContent = product.name;

                    // Her iki select elemanına da seçenekleri ekliyoruz
                    productNameSelect.appendChild(option.cloneNode(true));
                    removeProductNameSelect.appendChild(option.cloneNode(true));
                });
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Ürünler alınırken bir hata oluştu: ' + error.message);
        }
    }

    // Sayfa yüklendiğinde ürün seçeneklerini almak ve doldurmak için fonksiyonu çağırıyoruz
    await fetchAndPopulateProducts();

    // Kullanıcı Ürün Ekleme ve Çıkarma Butonları
    const addUserProductBtn = document.getElementById('addUserProductBtn');
    const removeUserProductBtn = document.getElementById('removeUserProductBtn');

    // Kullanıcı Ürün Ekleme ve Çıkarma Formları
    const addUserProductForm = document.getElementById('addUserProductForm');
    const removeUserProductForm = document.getElementById('removeUserProductForm');

    // Ürün Ekle Butonuna Tıklama Olayı
    if (addUserProductBtn) {
        addUserProductBtn.addEventListener('click', () => {
            addUserProductForm.style.display = 'block';
            removeUserProductForm.style.display = 'none';
        });
    }

    // Ürün Çıkar Butonuna Tıklama Olayı
    if (removeUserProductBtn) {
        removeUserProductBtn.addEventListener('click', () => {
            addUserProductForm.style.display = 'none';
            removeUserProductForm.style.display = 'block';
        });
    }

    // Kullanıcı Ürün Ekleme Formu
    const addUserProductFormElement = document.querySelector('#addUserProductFormElement');
    if (addUserProductFormElement) {
        addUserProductFormElement.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                productName: document.getElementById('userProductName').value,
                quantityToAdd: parseInt(document.getElementById('userQuantityToAdd').value, 10),
                quantityToRemove: 0 // Çıkarma yapılmayacaksa 0
            };

            try {
                const response = await fetch('https://localhost:7554/api/user/Product/increase', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Ürün ekleme başarısız.');
                }

                alert('Ürün başarıyla eklendi!');
                addUserProductFormElement.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata oluştu: ' + error.message);
            }
        });
    }

    // Kullanıcı Ürün Çıkarma Formu
    const removeUserProductFormElement = document.querySelector('#removeUserProductFormElement');
    if (removeUserProductFormElement) {
        removeUserProductFormElement.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                productName: document.getElementById('removeUserProductName').value,
                quantityToRemove: parseInt(document.getElementById('removeUserProductQuantity').value, 10)
            };

            try {
                const response = await fetch('https://localhost:7554/api/user/Product/decrease', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Ürün çıkarma başarısız.');
                }

                alert('Ürün başarıyla çıkarıldı!');
                removeUserProductFormElement.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata oluştu: ' + error.message);
            }
        });
    }
});
