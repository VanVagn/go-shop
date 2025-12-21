document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    errorDiv.textContent = '';
    successDiv.textContent = '';

    if (password !== confirmPassword) {
        errorDiv.textContent = 'Пароли не совпадают';
        return;
    }

    try {
        await api.post('/register', { username, password });
        successDiv.textContent = "Регистрация успешна! Теперь вы можете войти";

        document.getElementById('registerForm').reset();

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        errorDiv.textContent = error.message;
    }
});