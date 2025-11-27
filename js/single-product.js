import { BASE_URL, SESSION_STORAGE_CART } from './info.js';

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

    const thumbnail = productInfo.querySelector('img');
    thumbnail.src = info.image;
    thumbnail.alt = info.title;

    productInfo.querySelector('.product-price').innerText = info.price;
    productInfo.querySelector('.product-category').innerText = info.category;

    productInfo.querySelector('.product-description').innerText = info.description;
    
    const btn = productInfo.querySelector('button');
    if (btn) {
        btn.addEventListener('click', () => {
            try {
                const sessionCart = sessionStorage.getItem(SESSION_STORAGE_CART) || '[]';
                const parsedCart = JSON.parse(sessionCart);
                const productIds = Array.isArray(parsedCart) ? parsedCart : [];
                const currentProductId = Number(productID);
                if (!productIds.includes(currentProductId)) productIds.push(currentProductId);
                sessionStorage.setItem(SESSION_STORAGE_CART, JSON.stringify(productIds));
                alert('Added to cart');
            } catch (error) {
                sessionStorage.setItem(SESSION_STORAGE_CART, JSON.stringify([Number(productID)]));
                alert('Added to cart');
            }
        });
    }
};