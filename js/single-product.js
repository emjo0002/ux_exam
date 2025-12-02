import { BASE_URL, LOCAL_STORAGE_USER_EMAIL, LOCAL_STORAGE_CART } from './info.js';

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
        <a href="product.htm?id=${product.id}">
          <img src="${product.image}" alt="${product.title}" />
        </a>
        <h3><a href="product.htm?id=${product.id}">${product.title}</a></h3>
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
        const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);

        if (!userEmail) {
            btn.disabled = true;
        } else {
            btn.addEventListener('click', () => {
                const quantityInput = document.querySelector('#quantity');
                const quantity = parseInt(quantityInput.value, 10);

                if (quantity > 0) {
                    try {
                        const key = `${LOCAL_STORAGE_CART}${userEmail}`;
                        // Prefer localStorage per-user cart
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
                        alert('Added to cart');
                    } catch (_) {
                        // Fallback: at least try to save a minimal local cart
                        const key = `${LOCAL_STORAGE_CART}${userEmail}`;
                        localStorage.setItem(key, JSON.stringify([{ id: Number(productID), quantity }]));
                        alert('Added to cart');
                    }
                }
            });
        }
    }
};