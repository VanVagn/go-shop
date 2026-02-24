class AuthManager {
    constructor() {
    }

    async isLoggedIn() {
        try {
            const response = await fetch('/api/auth/check', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            return data.authenticated === true;
        } catch (error) {
            console.error('Auth check failed:', error);
            return false;
        }
    }


    async login(username, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({username, password})
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }


    async logout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                credentials: 'include'
            });

            localStorage.removeItem('user');
            localStorage.removeItem('token');
            sessionStorage.clear();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Logout failed:', error);
            throw error;
        }
    }
}

const auth = new AuthManager();
