class ProductsManager {
    constructor() {
        this.products = [];
    }

    async loadProducts() {
        try {
            this.products = await api.get('/products')
            this.displayProducts();
        } catch (error) {
            this.showError('Ошибка загрузки товаров: ' + error.message)
        }
    }

    displayProducts() {
        const container = document.getElementById('products')
        if (!container) return;

        container.innerHTML = this.products.map((product, index) => `
            <div class="product-card" style="animation-delay: ${index * 0.08}s">
                <img src="${product.image_url}" 
                     alt="${product.name}" 
                     class="product-image"
                     onerror="this.src='https://via.placeholder.com/400x300?text=Изображение+отсутствует'">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price} ₽</div>
                <button onclick="cart.addToCart(${product.ID})" 
                        class="btn btn-success">
                    В корзину
                </button>
            </div>
        `).join('');
    }

    showError(message) {
        const container = document.getElementById('products');
        if (container) {
            container.innerHTML = `<div class="error">${message}</div>`
        }
        console.error(message);
    }
}

const products = new ProductsManager();

if (window.location.pathname.includes('goods.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        products.loadProducts();
    });
}