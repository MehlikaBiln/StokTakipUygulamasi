document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const Username = document.getElementById('Username').value;
            const Password = document.getElementById('Password').value;

            try {
                const response = await fetch('https://localhost:7554/api/User/Login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Username, Password })
                });

                if (!response.ok) {
                    throw new Error('Login request failed');
                }

                const data = await response.json();

                if (data.token) {
                    // JWT token'ý localStorage'a kaydedin
                    localStorage.setItem('jwtToken', data.token);

                    // Kullanýcýnýn rolüne göre yönlendirme yapýn
                    if (data.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    } else if (data.role === 'user') {
                        window.location.href = 'user-dashboard.html';
                    } else {
                        document.getElementById('errorMessage').style.display = 'block';
                        document.getElementById('errorMessage').innerText = 'Bilinmeyen rol.';
                    }
                } else {
                    document.getElementById('errorMessage').style.display = 'block';
                    document.getElementById('errorMessage').innerText = 'Gecersiz kullanici adi veya sifre.';
                }
            } catch (error) {
                document.getElementById('errorMessage').style.display = 'block';
                document.getElementById('errorMessage').innerText = 'Giris sirasinda bir hata oluþtu.';
            }
        });
    }
});

// Register iþlemi
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const password = document.getElementById('password').value;
            const mail = document.getElementById('mail').value;
            const role = document.getElementById('role').value;

            const user = {
                name: name,
                password: password,
                mail: mail,
                role: role
            };

            try {
                const response = await fetch('https://localhost:7554/api/User/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(user)
                });

                if (response.ok) {
                    alert('Kayýt baþarýlý!');
                    window.location.href = 'login.html';
                } else {
                    alert('Kayit sirasinda bir hata olustu: ' + response.statusText);
                }
            } catch (error) {
                alert('Kayit sirasinda bir hata olustu:  ' + error.message);
            }
        });
    }
});

//USER KISMI 
document.addEventListener('DOMContentLoaded', () => {

    const newProductBtn = document.getElementById('newProductBtn');
    if (newProductBtn) {
        newProductBtn.addEventListener('click', () => {
            window.location.href = 'add-product.html'; // Yeni Ürün Oluþtur sayfasýna yönlendirme
        });
    }

    // Ýþlemler Butonu
    const operationsBtn = document.getElementById('operationsBtn');
    if (operationsBtn) {
        operationsBtn.addEventListener('click', () => {
            window.location.href = 'Islemler.html'; // Ýþlemler sayfasýna yönlendirme
        });
    }
});


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
                const response = await fetch('https://localhost:7554/api/user/Product/add', {
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



//ADMÝN KISMI

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



// Ürünleri almak ve select öğesini doldurmak için fonksiyon
async function fetchAndPopulateProducts() {
    const productNameSelect = document.getElementById('productNameSelect'); // Bu öğeyi fonksiyonun başında seçiyoruz

    if (!productNameSelect) {
        console.error('Ürün seçme öğesi bulunamadı.');
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

        // Seçim öğesindeki mevcut seçenekleri temizle
        productNameSelect.innerHTML = '';

        // Ürünleri seçim öğesine ekle
        productsArray.forEach(product => {
            const option = document.createElement('option');
            option.value = product.name; // Ürün adını değere ayarla
            option.textContent = product.name; // Ürün adını metin olarak ayarla
            productNameSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Ürünler alınırken bir hata oluştu: ' + error.message);
    }
}

// Sayfa yüklendiğinde ürünleri yükle
document.addEventListener('DOMContentLoaded', () => {
    fetchAndPopulateProducts();
});


// Sayfa yüklendiğinde ürünleri getirin
document.addEventListener('DOMContentLoaded', async () => {
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




//ÜRÜN LÝSTELEME VE ARAMA KISMI...
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



// KATEGORİ İŞLEMİ
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
            } else {
                console.error('Kategori listesi elementi bulunamadı');
            }

        } catch (error) {
            alert('Kategorileri yüklerken bir hata oluştu: ' + error.message);
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
