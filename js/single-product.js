import { BASE_URL, SESSION_STORAGE_CART } from './info.js';

const loadRelatedProducts = async (currentProduct) => {
  const container = document.querySelector('#related-products .related-list');
  if (!container) return;

  try {
    const res = await fetch(BASE_URL);
    const allProducts = await res.json();

    const related = allProducts
    .filter(product => product.category === currentProduct.category && product.id !== currentProduct.id)
    .slice(0, 3);

    container.innerHTML = related.map(product => `
      <article class="product">
        <a href="single_product.htm?id=${product.id}">
          <img src="${product.image}" alt="${product.title}" />
        </a>
        <h3><a href="single_product.htm?id=${product.id}">${product.title}</a></h3>
        <p class="product-price">${product.price} DKK</p>
        <span class="product-category">${product.category}</span>
      </article>
    `).join('');
  } catch (_) {
    // fail silently for related products
  }
};

const queryParams = new URLSearchParams(location.search);
const productID = queryParams.get('id');

fetch(`${BASE_URL}/${productID}`)
.then(response => response.json())
.then(data => {
    showProduct(data);
    loadRelatedProducts(data);
})
.catch(error => console.log(error));

const showProduct = (info) => {
    const productInfo = document.querySelector('#product-info');

    productInfo.querySelector('h2').innerText = info.title;

    const thumbnail = productInfo.querySelector('img');
    thumbnail.src = info.image;
    thumbnail.alt = info.title;

    productInfo.querySelector('.product-price').innerText = `${info.price} DKK`;
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