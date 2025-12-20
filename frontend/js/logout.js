// Инициализация кнопки выхода
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');

    if (logoutButton) {
        logoutButton.addEventListener('click', async (e) => {
            e.preventDefault();

            if (!confirm('Вы уверены, что хотите выйти из системы?')) {
                return;
            }

            try {
                await auth.logout();
                alert('Вы успешно вышли из системы');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Logout failed:', error);
                alert('Ошибка при выходе из системы. Попробуйте еще раз.');
            }
        });
    }
});