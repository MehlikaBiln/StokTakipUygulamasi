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

                    localStorage.setItem('jwtToken', data.token);


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




// KATEGORİ İŞLEMİ

