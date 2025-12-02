import { BASE_URL } from './info.js';

const assignLink = (anchor, url, text) => {
    anchor.href = url;
    anchor.title = text;
};

const container = document.querySelector('#product-list');

async function loadProducts() {
  if (!container) return;
  container.textContent = 'Loading products…';

    try {
    const res = await fetch(`${BASE_URL}`);
    const products = await res.json();

    const fragment = document.createDocumentFragment();
    products.forEach(product => {
      const productCard = document.querySelector('#product-card').content.cloneNode(true);

    const linkURL = `product.htm?id=${product.id}`;

    const headerLink = productCard.querySelector('h3 > a');
    headerLink.innerText = product.title;
    assignLink(headerLink, linkURL, product.title);
    
    const pictureLink = productCard.querySelector('a:has(img)');
    assignLink(pictureLink, linkURL, product.title);

    const thumbnail = productCard.querySelector('img');
    thumbnail.setAttribute('src', product.image);
    thumbnail.setAttribute('alt', product.title);
    thumbnail.setAttribute('loading', 'lazy');

    productCard.querySelector('.product-price').innerText = `${product.price} DKK`;
    productCard.querySelector('.product-category').innerText = product.category;
    
    fragment.append(productCard);
    });

    container.textContent = '';
    container.append(fragment);
    } catch (error) {
    console.error('Error fetching products:', error);
    container.textContent = 'Failed to load products. Please try again later.';
    }
}

loadProducts();