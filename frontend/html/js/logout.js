function showSuccess(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #000000;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 4px;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;

    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showError(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc3545;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 4px;
        font-size: 0.9rem;
        z-index: 1000;
        animation: fadeInOut 3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function showInfo(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #17a2b8;
        color: #ffffff;
        padding: 12px 24px;
        border-radius: 4px;
        font-size: 0.9rem;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();

            try {
                const isLoggedIn = await auth.isLoggedIn();
                if (!isLoggedIn) {
                    showInfo('Вы уже вышли из системы или не авторизованы');
                    return;
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                showError('Ошибка проверки авторизации');
                return;
            }

            if (!confirm('Вы уверены, что хотите выйти из системы?')) {
                return;
            }

            try {
                    await auth.logout();
                    showSuccess('Вы успешно вышли из системы'); // Заменяем alert на showSuccess
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);

            } catch (error) {
                console.error('Logout failed:', error);
                showError('Ошибка при выходе из системы. Попробуйте еще раз.'); // Также заменяем alert для ошибок
            }
        });
    }
});
