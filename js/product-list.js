import { BASE_URL } from './info.js';

const products = await fetch(`${BASE_URL}`) 
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching products:', error);
        return []; 
    });

const assignLink = (anchor, url, text) => {
    anchor.href = url;
    anchor.title = text;
};

const fragment = document.createDocumentFragment();

products.forEach(product => {
    
    const productCard = document.querySelector('#product-card').content.cloneNode(true);

    const linkURL = `single_product.htm?id=${product.id}`;
    
    const headerLink = productCard.querySelector('h3 > a');
    headerLink.innerText = product.title;
    assignLink(headerLink, linkURL, product.title);
    
    const pictureLink = productCard.querySelector('a:has(img)');
    assignLink(pictureLink, linkURL, product.title);

    const thumbnail = productCard.querySelector('img');
    thumbnail.setAttribute('src', product.image);
    thumbnail.setAttribute('alt', product.title);
    
    productCard.querySelector('.product-price').innerText = `${product.price} DKK`;
    productCard.querySelector('.product-category').innerText = product.category;
    
    fragment.append(productCard);
});

document.querySelector('#product-list').append(fragment);