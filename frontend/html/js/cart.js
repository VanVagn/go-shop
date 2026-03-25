class CartManager {
    constructor() {
        this.cart = [];
        this.total = 0;
        this.totalItems = 0;
    }

    async loadCart(options = { redirectOnAuthError: true }) {   // добавили параметр
        try {
            const data = await api.get('/cart');
            this.cart = data.cart || [];
            this.total = data.total || 0;
            this.calculateTotalItems();
            this.displayCart();
            this.updateCounter();                                 // добавили обновление счётчика
        } catch (error) {
            const isAuthError = error.message.includes('401') || error.message.includes('Authentication');
            if (isAuthError) {
                if (options.redirectOnAuthError) {
                    this.showError('Для доступа к корзине необходимо войти в систему');
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);
                } else {
                    // Не редиректим, просто показываем пустую корзину
                    this.cart = [];
                    this.total = 0;
                    this.totalItems = 0;
                    this.updateCounter();                           // обновляем счётчик (будет 0)
                }
            } else {
                if (options.redirectOnAuthError) {
                    this.showError('Ошибка загрузки корзины: ' + error.message);
                } else {
                    this.cart = [];
                    this.total = 0;
                    this.totalItems = 0;
                    this.updateCounter();
                }
            }
        }
    }

    updateCounter() {
        const counter = document.getElementById('cart-count');
        if (counter) {
            counter.textContent = this.totalItems;
            counter.style.display = this.totalItems > 0 ? 'inline-block' : 'none';
        }
    }

    calculateTotalItems() {
        this.totalItems = this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    displayCart() {
        const container = document.getElementById('cart-content');
        if (!container) return;

        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div>🛒</div>
                    <h3>Корзина пуста</h3>
                    <p>Добавьте товары из каталога</p>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            ${this.cart.map((item, index) => `
                <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                    <img src="${item.product.image_url}" 
                         alt="${item.product.name}" 
                         class="cart-item-image"
                         onerror="this.src='https://via.placeholder.com/400x300?text=Изображение+отсутствует'">
                    <div class="item-info">
                        <h3>${item.product.name}</h3>
                        <p>${item.product.description}</p>
                        <p class="item-price">${item.product.price} ₽ за шт.</p>
                    </div>
                    <div class="quantity-control">
                        <button onclick="cart.updateQuantity(${item.product.ID}, -1)" 
                                class="quantity-btn"
                                ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button onclick="cart.updateQuantity(${item.product.ID}, 1)" 
                                class="quantity-btn">+</button>
                    </div>
                    <div class="item-total">${(item.product.price * item.quantity)} ₽</div>
                    <button onclick="cart.removeFromCart(${item.product.ID})" 
                            class="btn btn-danger">
                        Удалить
                    </button>
                </div>
            `).join('')}
            <div class="cart-summary">
                <div class="summary-info">
                    <div class="summary-item">
                        Всего товаров: <span>${this.totalItems} шт.</span>
                    </div>
                    <div class="summary-item">
                        Позиций в корзине: <span>${this.cart.length}</span>
                    </div>
                </div>
                <div class="cart-total">
                    Итого: ${this.total} ₽
                </div>
            </div>
        `;
    }

    async updateQuantity(productId, change) {
        try {
            await api.post('/cart/update', {
                product_id: productId.toString(),
                change: change
            });

            // Обновляем данные корзины
            await this.loadCart();
            this.showSuccess('Количество обновлено');
        } catch (error) {
            this.showError('Ошибка при обновлении количества: ' + error.message);
        }
    }

    async addToCart(productId) {
        if (!auth.isLoggedIn()) {
            this.showError('Для добавления в корзину необходимо войти в систему');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=goods.html';
            }, 1500);
            return;
        }

        if (!productId) {
            this.showError('Ошибка: не указан ID товара');
            return;
        }

        try {
            await api.post('/cart/add', {
                product_id: productId.toString()
            });
            this.showSuccess('Товар добавлен в корзину!');

            await this.loadCart({ redirectOnAuthError: false })
        } catch (error) {
            this.showError('Ошибка при добавлении в корзину: ' + error.message);
        }
    }

    async removeFromCart(productId) {
        try {
            await api.post('/cart/remove', {
                product_id: productId.toString()
            });
            this.showSuccess('Товар удалён из корзины');
            this.loadCart();
        } catch (error) {
            this.showError('Ошибка при удалении из корзины: ' + error.message);
        }
    }

    showError(message) {
        const container = document.getElementById('cart-content');
        if (container) {
            container.innerHTML = `<div class="error">${message}</div>`;
        }
        console.error(message);
    }

    showSuccess(message) {
        // Можно добавить красивый toast-уведомление
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
            animation: fadeInOut 3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

const cart = new CartManager();

if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        cart.loadCart();
    });
}