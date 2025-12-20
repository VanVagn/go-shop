class CartManager {
    constructor() {
        this.cart = [];
        this.total = 0;
    }

    async loadCart() {
        try {
            const data = await api.get('/cart');
            this.cart = data.cart || [];
            this.total = data.total || 0;
            this.displayCart();
        } catch (error) {
            if (error.message.includes('401') || error.message.includes('Authentication')) {
                this.showError('Для доступа к корзине необходимо войти в систему');
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                this.showError('Ошибка загрузки корзины: ' + error.message);
            }
        }
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
            ${this.cart.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <h3>${item.product.name}</h3>
                        <p class="item-price">$${item.product.price} за шт.</p>
                    </div>
                    <div class="item-quantity">
                        Количество: ${item.quantity}
                    </div>
                    <div class="item-total">
                        $${item.item_total.toFixed(2)}
                    </div>
                    <form onsubmit="cart.removeFromCart(event, ${item.product.id})">
                        <button type="submit" class="btn btn-danger">Удалить</button>
                    </form>
                </div>
            `).join('')}
            <div class="cart-total">
                Общая сумма: $${this.total.toFixed(2)}
            </div>
        `;
    }

    async addToCart(event, productId) {
        event.preventDefault();
        if (!auth.isLoggedIn()) {
            this.showError('Для добавления в корзину необходимо войти в систему');
            setTimeout(() => {
                window.location.href = 'login.html?redirect=goods.html';
            }, 1500);
            return;
        }

        const formData = new FormData();
        formData.append('product_id', productId);

        try {
            await api.postForm('/cart/add', formData);
            this.showSuccess('Товар добавлен в корзину!');

            if (window.location.pathname.includes('cart.html')) {
                this.loadCart();
            }
        } catch (error) {
            this.showError('Ошибка при добавлении в корзину: ' + error.message);
        }
    }

    async removeFromCart(event, productId) {
        event.preventDefault();

        const formData = new FormData();
        formData.append('product_id', productId);

        try {
            await api.postForm('/cart/remove', formData);
            this.showSuccess('Товар удалён из корзины');
            this.loadCart();
        } catch (error) {
            this.showError('Ошибка при удалении из корзины: ' + error.message);
        }
    }

    showError(message) {
        alert(message);
    }

    showSuccess(message) {
        alert(message);
    }
}

const cart = new CartManager();

if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        cart.loadCart();
    });
}