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

const showProduct = (product) => {
    const productInfo = document.querySelector('#product-info');

    productInfo.querySelector('h2').innerText = product.title;
    const breadcrumb = document.getElementById('breadcrumb-current');
    if (breadcrumb) breadcrumb.textContent = product.title;

    const thumbnail = productInfo.querySelector('img');
    thumbnail.src = product.image;
    thumbnail.alt = product.title;

    productInfo.querySelector('.product-description').innerText = product.description;

    productInfo.querySelector('.product-price').innerText = `${product.price} DKK`;
    productInfo.querySelector('.product-category').innerText = product.category;

    const ratingElement = productInfo.querySelector('.product-rating');
    if (ratingElement && product.rating) {
        const rate = product.rating.rate; 
        const count = product.rating.count;
        ratingElement.innerText = `${rate}/5 (${count} reviews)`;
    }
    
    const btn = productInfo.querySelector('button');
    if (btn) {
        const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);

        if (!userEmail) {
            btn.addEventListener('click', () => {
                showModal('You need to be logged in to add to cart');
            });
        } else {
            btn.addEventListener('click', () => {
                const quantity = 1;
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
                        showModal('Product added to cart. Close to stay, or go to cart.');
                        const cartBtn = document.querySelector('#mdlInfo #btn');
                        if (cartBtn) {
                            cartBtn.addEventListener('click', () => { window.location.href = 'cart.htm'; }, { once: true });
                        }
                    } catch (error) {
                        console.error(error);
                        showModal('Could not add to cart. Please try again.');
                    }
            });
        }
    }
};