document.addEventListener('DOMContentLoaded', async () => {
    try {
        const isLoggedIn = await auth.isLoggedIn();
        if (isLoggedIn) {
            // Уже авторизован - перенаправляем на страницу товаров
            window.location.href = 'goods.html';
        }
        // Если не авторизован - остаёмся на странице входа
    } catch (error) {
        console.error('Auth check on load failed:', error);
    }
});

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    errorDiv.textContent = "";

    try {
        await auth.login(username, password);
        window.location.href = 'goods.html';
    } catch (error) {
        errorDiv.textContent = error.message;
    }
});