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

        container.innerHTML = this.products.map(product => `
            <div class="product-card">
                <img src="${product.image_url}" 
                     alt="${product.name}" 
                     class="product-image"
                     onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <form class="add-to-cart-form" onsubmit="cart.addToCart(event, ${product.id})">
                    <button type="submit" class="btn btn-success" style="height:200px width: 300px;">
                        В корзину
                    </button>
                </form>
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