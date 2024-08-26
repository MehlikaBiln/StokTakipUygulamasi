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
                    // JWT token'� localStorage'a kaydedin
                    localStorage.setItem('jwtToken', data.token);

                    // Kullan�c�n�n rol�ne g�re y�nlendirme yap�n
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
                document.getElementById('errorMessage').innerText = 'Giris sirasinda bir hata olu�tu.';
            }
        });
    }
});

// Register i�lemi
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
                    alert('Kay�t ba�ar�l�!');
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
    // Yeni �r�n Olu�tur Butonu
    const newProductBtn = document.getElementById('newProductBtn');
    if (newProductBtn) {
        newProductBtn.addEventListener('click', () => {
            window.location.href = 'add-product.html'; // Yeni �r�n Olu�tur sayfas�na y�nlendirme
        });
    }

    // ��lemler Butonu
    const operationsBtn = document.getElementById('operationsBtn');
    if (operationsBtn) {
        operationsBtn.addEventListener('click', () => {
            window.location.href = 'Islemler.html'; // ��lemler sayfas�na y�nlendirme
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    // Yeni �r�n Olu�turma Formu
    const createProductForm = document.getElementById('createProductForm');
    if (createProductForm) {
        createProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                Name: document.getElementById('productName').value,
                Barcode: document.getElementById('productBarcode').value,
                Quantity: parseInt(document.getElementById('productQuantity').value, 10),
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
                    alert('Urun basariyla eklendi');
                    createProductForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Urun eklenirken bir hata olustu: ${errorData.message || 'Bilinmeyen hata'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata olustu: ' + error.message);
            }
        });
    }

    // �r�n Ekleme Formu
    const addProductForm = document.querySelector('#addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                productName: document.getElementById('productName').value,
                quantityToAdd: parseInt(document.getElementById('quantityToAdd').value, 10),
                quantityToRemove: 0 // ��karma yap�lmayacaksa 0
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
                    throw new Error('Urun ekleme basarisiz.');
                }

                alert('Urun basariyla eklendi!');
                addProductFormElement.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata olustu: ' + error.message);
            }
        });
    }

    // �r�n ��karma Formu
    const removeProductForm = document.querySelector('#removeProductForm form');
    if (removeProductForm) {
        removeProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                ProductName: document.getElementById('removeProductName').value,
                QuantityToRemove: parseInt(document.getElementById('removeProductQuantity').value, 10)
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
                    throw new Error('Urun cikarma basarisiz.');
                }

                alert('Urun Basariyla cikarildi!');
                removeProductForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata olustu: ' + error.message);
            }
        });
    }
});


//ADM�N KISMI

document.addEventListener('DOMContentLoaded', () => {
    // Yeni �r�n Olu�turma Formu
    const createProductForm = document.getElementById('createProductForm');
    if (createProductForm) {
        createProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                Name: document.getElementById('productName').value,
                Barcode: document.getElementById('productBarcode').value,
                Quantity: parseInt(document.getElementById('productQuantity').value, 10),
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
                    alert('Urun basariyla eklendi!');
                    createProductForm.reset();
                } else {
                    const errorData = await response.json();
                    alert(`Urun eklenirken bir hata olustu: ${errorData.message || 'Bilinmeyen hata'}`);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata olustu: ' + error.message);
            }
        });
    }
    // �r�n Ekleme Formu
    const addProductForm = document.querySelector('#addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                productName: document.getElementById('productName').value,
                quantityToAdd: parseInt(document.getElementById('quantityToAdd').value, 10),
                quantityToRemove: 0 // ��karma yap�lmayacaksa 0
            };

            try {
                const response = await fetch('https://localhost:7554/api/admin/Admin/increase', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Urun ekleme basarisiz.');
                }

                alert('Urun basariyla eklendi!');
                addProductFormElement.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata olustu: ' + error.message);
            }
        });
    }

    // �r�n ��karma Formu
    const removeProductForm = document.querySelector('#removeProductForm form');
    if (removeProductForm) {
        removeProductForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = {
                ProductName: document.getElementById('removeProductName').value,
                QuantityToRemove: parseInt(document.getElementById('removeProductQuantity').value, 10)
            };

            try {
                const response = await fetch('https://localhost:7554/api/admin/Admin/decrease', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) {
                    throw new Error('Urun cikarma basarisiz.');
                }

                alert('Urun basar�yla cikarildi!');
                removeProductForm.reset();
            } catch (error) {
                console.error('Error:', error);
                alert('Bir hata olustu: ' + error.message);
            }
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const deleteProductForm = document.getElementById('deleteProductForm');

    if (deleteProductForm) {
        deleteProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const productNameInput = document.getElementById('productName');

            if (!productNameInput) {
                console.error('Product name input element not found');
                return;
            }

            const productName = productNameInput.value.trim();

            if (!productName) {
                alert('L�tfen bir urun adi girin.');
                return;
            }

            try {
                const response = await fetch(`https://localhost:7554/api/admin/Admin/ByName/${encodeURIComponent(productName)}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    alert('Urun basariyla silindi!');
                    window.location.href = 'admin-dashboard.html';
                } else if (response.status === 404) {
                    alert('Bu ada sahip bir urun bulunamadi.');
                } else {
                    alert('Urun silme sirasinda bir hata olustu: ' + response.statusText);
                }
            } catch (error) {
                alert('Urun silme sirasinda bir hata olustu: ' + error.message);
            }
        });
    }
});



//�R�N L�STELEME VE ARAMA KISMI...
document.addEventListener('DOMContentLoaded', () => {

    async function loadProducts(filter = {}) {
        try {
            // Filtreleme parametrelerini olu�tur
            const query = new URLSearchParams(filter).toString();
            const url = query ? `https://localhost:7554/api/admin/Admin/WithFilter?${query}` : 'https://localhost:7554/api/admin/Admin';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Ag yaniti basarisiz: ' + response.statusText);
            }

            const data = await response.json();

            // JSON verisini kontrol et ve uygun formata d�n��t�r
            const products = Array.isArray(data) ? data : data.$values || [];

            if (!products.length) {
                throw new Error('Beklenen urunler dizisi bulunamadi');
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
            <td>${new Date(product.addedDate).toLocaleDateString('tr-TR')}</td>
            <td>${new Date(product.updatedDate).toLocaleDateString('tr-TR')}</td>
            <td>${product.categoryName || 'Belirtilmemi�'}</td>
            <td>${product.userName || 'Belirtilmemi�'}</td>
        `;
                tbody.appendChild(row);
            });

        } catch (error) {
            alert('Urunleri yuklerken bir hata olustu: ' + error.message);
        }
    }

    // Arama formunu i�leyen fonksiyon
    const searchProductForm = document.getElementById('searchProductForm');
    if (searchProductForm) {
        searchProductForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const barcode = document.getElementById('barcode').value;
            const categoryName = document.getElementById('categoryName').value;

            // Filtreleme parametrelerini olu�tur
            const filter = {};
            if (name) filter.name = name;
            if (barcode) filter.barcode = barcode;
            if (categoryName) filter.categoryName = categoryName;

            // E�er filtre yoksa t�m �r�nleri getir
            loadProducts(Object.keys(filter).length ? filter : {});

        });
    }

    // Sayfa y�klendi�inde t�m �r�nleri g�ster
    document.addEventListener('DOMContentLoaded', () => {
        loadProducts();
    });




});

document.addEventListener('DOMContentLoaded', function () {
    const categoryForm = document.getElementById('categoryForm');
    const categoryList = document.getElementById('categoryList');

    // Kategori ekleme i�lemi
    categoryForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const categoryName = document.getElementById('categoryName').value.trim();
        const userName = document.getElementById('userName').value.trim();

        if (!categoryName || !userName) {
            console.error('Kategori adi veya kullanici adi bos olamaz!');
            return;
        }

        // Kategori ekleme API iste�i
        fetch('https://localhost:7554/api/Category', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: categoryName, userName: userName })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Kategori eklenirken bir hata olustu');
                }
                return response.json();
            })
            .then(data => {
                console.log('Eklendi veri:', data); // Gelen veriyi konsola yazd�r
                addCategoryToList(data);
                categoryForm.reset();
            })
            .catch(error => console.error('Error:', error));
    });
   
});


document.addEventListener('DOMContentLoaded', () => {
    async function loadCategories() {
        try {
            const response = await fetch('https://localhost:7554/api/Category');
            if (!response.ok) {
                throw new Error('Ag yaniti basarisiz: ' + response.statusText);
            }

            const data = await response.json();
            const categories = Array.isArray(data) ? data : data.$values || [];

            const categoryList = document.getElementById('categoryList');

            if (!categoryList) {
                console.error('Category list element not found');
                return;
            }

            categoryList.innerHTML = ''; // Kategorileri temizle

            categories.forEach(category => {
                const categoryItem = document.createElement('li');
                categoryItem.className = 'category-item';
                categoryItem.textContent = category.name;
                categoryItem.dataset.id = category.id;

                // �r�n listesini olu�tur
                const productList = document.createElement('ul');
                productList.className = 'product-list';

                // �r�nleri gizle
                productList.style.display = 'none';
                categoryItem.appendChild(productList);

                categoryItem.addEventListener('click', async () => {
                    if (productList.style.display === 'none') {
                        // �r�nleri y�kle
                        await loadProductsByCategory(category.id, productList);
                        productList.style.display = 'block';
                    } else {
                        productList.style.display = 'none';
                    }
                });

                categoryList.appendChild(categoryItem);
            });

        } catch (error) {
            alert('Kategorileri yuklerken bir hata olustu: ' + error.message);
        }
    }

    async function loadProductsByCategory(categoryId, productList) {
        try {
            const response = await fetch(`https://localhost:7554/api/Category/${categoryId}`);
            if (!response.ok) {
                throw new Error('Ag yaniti basarisiz: ' + response.statusText);
            }

            const data = await response.json();
            const products = data.products.$values || [];

            productList.innerHTML = ''; // Mevcut �r�nleri temizle

            products.forEach(product => {
                const productItem = document.createElement('li');
                productItem.className = 'product-item';

                // T�m �r�n bilgilerini ekleyin
                productItem.innerHTML = `
                    <strong>Urun Adi:</strong> ${product.name}<br>
                    <strong>Barkod:</strong> ${product.barcode}<br>
                    <strong>Miktar:</strong> ${product.quantity}<br>
                    <strong>Eklenme Tarihi:</strong> ${product.addedDate}<br>
                    <strong>Guncellenme Tarihi:</strong> ${product.updatedDate}<br>
                    <strong>Kullanici:</strong> ${product.userName}
                `;
                productList.appendChild(productItem);
            });

        } catch (error) {
            alert('Urunleri yuklerken bir hata olustu ' + error.message);
        }
    }

    // Sayfa y�klendi�inde t�m kategorileri g�ster
    loadCategories();
});
