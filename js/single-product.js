import { BASE_URL } from './info.js';

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
};