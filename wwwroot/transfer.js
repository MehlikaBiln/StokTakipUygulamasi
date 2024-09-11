document.addEventListener('DOMContentLoaded', function () {
    loadProductOptions();
    loadDepotOptions();

    const form = document.getElementById('productTransferForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        transferProduct();
    });
});

function loadProductOptions() {
    fetch('https://localhost:7554/api/admin/Admin/api/admin/available-products')  // Birden fazla kategorideki ürünleri getiren API endpoint
        .then(response => response.json())
        .then(data => {
            console.log('Ürünler:', data);  // Debugging
            if (data && data.$values && Array.isArray(data.$values)) {
                const productSelect = document.getElementById('productName');
                productSelect.innerHTML = '<option value="">Ürün Seçin</option>';
                data.$values.forEach(product => {
                    productSelect.innerHTML += `<option value="${product.name}">${product.name}</option>`;
                });
            } else {
                console.error('Beklenen dizi formatında veri döndürülmedi:', data);
            }
        })
        .catch(error => console.error('Ürünleri yüklerken hata oluştu:', error));
}


function loadDepotOptions() {
    fetch('https://localhost:7554/api/Category')  // Depoları getiren API endpoint
        .then(response => response.json())
        .then(data => {
            console.log('Depolar:', data);  // Debugging
            if (data && data.$values && Array.isArray(data.$values)) {
                const fromDepotSelect = document.getElementById('fromDepot');
                const toDepotSelect = document.getElementById('toDepot');
                fromDepotSelect.innerHTML = '<option value="">Gönderici Depo Seçin</option>';
                toDepotSelect.innerHTML = '<option value="">Alıcı Depo Seçin</option>';
                data.$values.forEach(depot => {
                    fromDepotSelect.innerHTML += `<option value="${depot.name}">${depot.name}</option>`;
                    toDepotSelect.innerHTML += `<option value="${depot.name}">${depot.name}</option>`;
                });
            } else {
                console.error('Beklenen dizi formatında veri döndürülmedi:', data);
            }
        })
        .catch(error => console.error('Depoları yüklerken hata oluştu:', error));
}

function transferProduct() {
    const productName = document.getElementById('productName').value;
    const fromDepot = document.getElementById('fromDepot').value;
    const toDepot = document.getElementById('toDepot').value;
    const quantity = document.getElementById('quantity').value;

    if (!productName || !fromDepot || !toDepot || !quantity) {
        alert('Lütfen tüm alanları doldurun.');
        return;
    }

    fetch(`https://localhost:7554/api/admin/Admin/transfer?productName=${productName}&fromDepot=${fromDepot}&toDepot=${toDepot}&quantity=${quantity}`, {
        method: 'POST'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ağ yanıtı başarısız: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            alert('Transfer işlemi başarılı.');
        })
        .catch(error => {
            console.error('Transfer işlemi sırasında hata oluştu:', error);
            alert('Transfer işlemi sırasında hata oluştu.');
        });
}
