import { BASE_URL, LOCAL_STORAGE_USER_EMAIL, LOCAL_STORAGE_CART } from './info.js';
import { showModal } from './modal.js';

const queryParams = new URLSearchParams(location.search);
const productID = queryParams.get('id');

fetch(`${BASE_URL}/${productID}`)
.then(response => response.json())
.then(data => {
    showProduct(data);
})
.catch(error => console.log(error));

const showProduct = (info) => {
    const productInfo = document.querySelector('#product-info');

    productInfo.querySelector('h2').innerText = info.title;
    const breadcrumb = document.getElementById('breadcrumb-current');
    if (breadcrumb) breadcrumb.textContent = info.title;

    const thumbnail = productInfo.querySelector('img');
    thumbnail.src = info.image;
    thumbnail.alt = info.title;

    productInfo.querySelector('.product-price').innerText = `${info.price} DKK`;
    productInfo.querySelector('.product-category').innerText = info.category;

    productInfo.querySelector('.product-description').innerText = info.description;
    
    const btn = productInfo.querySelector('button');
    if (btn) {
        const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);

        if (!userEmail) {
            btn.addEventListener('click', () => {
                showModal('You need to be logged in to add to cart');
            });
        } else {
            const showCartToast = (productName, quantity) => {
                let toast = document.getElementById('cart-toast');
                if (!toast) {
                    toast = document.createElement('div');
                    toast.id = 'cart-toast';
                    toast.setAttribute('role', 'status');
                    toast.setAttribute('aria-live', 'polite');
                    document.body.appendChild(toast);
                }
                toast.innerHTML = `<strong>Added to cart</strong><br>${quantity} x ${productName}`;
                toast.classList.add('show');
                clearTimeout(toast._hideTimer);
                toast._hideTimer = setTimeout(() => toast.classList.remove('show'), 3000);
            };

            btn.addEventListener('click', () => {
                const quantityInput = document.querySelector('#quantity');
                const quantity = parseInt(quantityInput.value, 10);

                if (quantity > 0) {
                    try {
                        const key = `${LOCAL_STORAGE_CART}${userEmail}`;
                        
                        const localCartRaw = localStorage.getItem(key);
                        let items = [];
                        if (localCartRaw) {
                            const parsed = JSON.parse(localCartRaw);
                            if (Array.isArray(parsed)) items = parsed;
                        }

                        const currentProductId = Number(productID);
                        const existingProduct = items.find(p => p.id === currentProductId);

                        if (existingProduct) {
                            existingProduct.quantity += quantity;
                        } else {
                            items.push({ id: currentProductId, quantity });
                        }

                        localStorage.setItem(key, JSON.stringify(items));
                        showCartToast(info.title, quantity);
                    } catch (_) {
                        // Fallback: at least try to save a minimal local cart
                        const key = `${LOCAL_STORAGE_CART}${userEmail}`;
                        localStorage.setItem(key, JSON.stringify([{ id: Number(productID), quantity }]));
                        showCartToast(info.title, quantity);
                    }
                }
            });
        }
    }
};