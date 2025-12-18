import { BASE_URL } from './info.js';

const assignLink = (anchor, url, text) => {
    anchor.href = url;
    anchor.title = text;
};

const renderProductCard = (product) => {
  const productCard = document.querySelector('#product-card').content.cloneNode(true);

  const linkURL = `product.htm?id=${product.id}`;

  const headerLink = productCard.querySelector('h2 > a');
  headerLink.innerText = product.title;
  assignLink(headerLink, linkURL, product.title);
  
  const pictureLink = productCard.querySelector('a:has(img)');
  assignLink(pictureLink, linkURL, product.title);

  const thumbnail = productCard.querySelector('img');
  thumbnail.setAttribute('src', product.image);
  thumbnail.setAttribute('alt', product.title);
  thumbnail.setAttribute('loading', 'lazy');

  const price = productCard.querySelector('.product-price');
  price.innerText = `${product.price} DKK`;

  const category = productCard.querySelector('.product-category');
  category.innerText = product.category;

  return productCard;
};

const container = document.querySelector('#product-list');

async function loadProducts() {
  if (!container) return;
  try {
    const res = await fetch(`${BASE_URL}`);
    const products = await res.json();

    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
      fragment.append(renderProductCard(product));
    });

    container.textContent = '';
    container.append(fragment);
  } catch (error) {
    console.error('Error fetching products:', error);
    container.textContent = 'Failed to load products. Please try again later.';
  }
}

loadProducts();