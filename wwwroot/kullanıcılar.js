document.addEventListener('DOMContentLoaded', () => {
    loadCategoriesWithUsers();
    loadCategoriesForAssignment();
    loadUsersForAssignment();
});

// Kategorileri ve o kategorilere erişimi olan kullanıcıları yüklemek için kullanılan fonksiyon
async function loadCategoriesWithUsers() {
    try {
        const response = await fetch('https://localhost:7554/api/Category');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        const categories = Array.isArray(data) ? data : (Array.isArray(data.$values) ? data.$values : []);

        const categoryList = document.querySelector('#categoryList');
        if (!categoryList) {
            console.error('Category list element not found.');
            return;
        }
        categoryList.innerHTML = '';

        for (const category of categories) {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="expandable" onclick="toggleUsers(${category.id}, this)">${category.name}</span>
                <ul id="users-${category.id}" class="users-list hidden"></ul>
            `;
            categoryList.appendChild(listItem);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Kullanıcıları göstermek ve saklamak için kullanılan fonksiyon
function toggleUsers(categoryId, element) {
    const userList = document.querySelector(`#users-${categoryId}`);
    if (!userList) {
        console.error('User list element not found.');
        return;
    }

    // Kullanıcı listesi gizliyse göster, değilse gizle
    if (userList.classList.contains('hidden')) {
        showUsersForCategory(categoryId);
        userList.classList.remove('hidden');
    } else {
        userList.classList.add('hidden');
    }
}

// Belirli bir kategoriye erişimi olan kullanıcıları yüklemek için fonksiyon
async function showUsersForCategory(categoryId) {
    try {
        const response = await fetch(`https://localhost:7554/api/usercategory/category/${categoryId}`);
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        const users = Array.isArray(data) ? data : (Array.isArray(data.$values) ? data.$values : []);

        const userList = document.querySelector(`#users-${categoryId}`);
        if (!userList) {
            console.error('User list element not found.');
            return;
        }
        userList.innerHTML = '';

        for (const user of users) {
            const item = document.createElement('li');
            item.textContent = `${user.username}`;
            userList.appendChild(item);
        }
    } catch (error) {
        console.error('Error showing users for category:', error);
    }
}

// Kullanıcıları ve kategorileri eklemek için kullanılan fonksiyon
async function loadCategoriesForAssignment() {
    try {
        const response = await fetch('https://localhost:7554/api/Category');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        const categories = Array.isArray(data) ? data : (Array.isArray(data.$values) ? data.$values : []);

        const categorySelect = document.querySelector('#categorySelect');
        if (!categorySelect) {
            console.error('Category select element not found.');
            return;
        }
        categorySelect.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories for assignment:', error);
    }
}

// Kullanıcıları eklemek için kullanılan fonksiyon
async function loadUsersForAssignment() {
    try {
        const response = await fetch('https://localhost:7554/api/User/role/user');
        if (!response.ok) throw new Error('Network response was not ok.');
        const data = await response.json();
        const users = Array.isArray(data) ? data : (Array.isArray(data.$values) ? data.$values : []);

        const userSelect = document.querySelector('#userSelect');
        if (!userSelect) {
            console.error('User select element not found.');
            return;
        }
        userSelect.innerHTML = '';

        users.forEach(user => {
            const option = document.createElement('option');
            option.value = user.id;
            option.textContent = user.username;
            userSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading users for assignment:', error);
    }
}

// Kullanıcıyı belirli bir kategoriye atamak için kullanılan fonksiyon
async function assignUserToCategory() {
    const userSelect = document.querySelector('#userSelect');
    const categorySelect = document.querySelector('#categorySelect');

    if (!userSelect || !categorySelect) {
        console.error('User or category select element not found.');
        return;
    }

    const userId = userSelect.value;
    const categoryId = categorySelect.value;

    if (!userId || !categoryId) {
        alert('Kullanıcı veya kategori seçilmedi.');
        return;
    }

    try {
        const response = await fetch('https://localhost:7554/api/usercategory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, categoryId })
        });

        if (response.ok) {
            alert('Kullanıcı başarıyla kategoriye atandı.');
            // Kategorileri ve kullanıcıları yeniden yükle
            loadCategoriesWithUsers();
        } else {
            alert('Kullanıcı kategoriye atanırken bir hata oluştu.');
        }
    } catch (error) {
        console.error('Error assigning user to category:', error);
        alert('Kullanıcı kategoriye atanırken bir hata oluştu.');
    }
}

// Kullanıcıyı belirli bir kategoriden çıkarmak için kullanılan fonksiyon
async function removeUserFromCategory() {
    const removeUserName = document.querySelector('#removeUserName').value;
    const removeCategoryName = document.querySelector('#removeCategoryName').value;

    if (!removeUserName || !removeCategoryName) {
        alert('Kullanıcı adı veya kategori adı girilmedi.');
        return;
    }

    try {
        // Kullanıcıyı ve kategoriyi ID'ye dönüştürme
        const usersResponse = await fetch('https://localhost:7554/api/User');
        const categoriesResponse = await fetch('https://localhost:7554/api/Category');
        const usersData = await usersResponse.json();
        const categoriesData = await categoriesResponse.json();
        const users = Array.isArray(usersData) ? usersData : (Array.isArray(usersData.$values) ? usersData.$values : []);
        const categories = Array.isArray(categoriesData) ? categoriesData : (Array.isArray(categoriesData.$values) ? categoriesData.$values : []);

        const user = users.find(u => u.username === removeUserName);
        const category = categories.find(c => c.name === removeCategoryName);

        if (!user || !category) {
            alert('Kullanıcı veya kategori bulunamadı.');
            return;
        }

        const response = await fetch(`https://localhost:7554/api/usercategory/user/${user.id}/category/${category.id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Kullanıcı başarıyla kategoriden çıkarıldı.');
            // Kategorileri ve kullanıcıları yeniden yükle
            loadCategoriesWithUsers();
        } else {
            alert('Kullanıcı kategoriden çıkarılırken bir hata oluştu.');
        }
    } catch (error) {
        console.error('Error removing user from category:', error);
        alert('Kullanıcı kategoriden çıkarılırken bir hata oluştu.');
    }
}

// Formları açıp kapamak için kullanılan fonksiyon
function toggleForm(formId) {
    const form = document.querySelector(`#${formId}`);
    if (!form) {
        console.error('Form element not found.');
        return;
    }

    form.classList.toggle('hidden');
}
