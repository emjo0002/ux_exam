import { BASE_URL, SESSION_STORAGE_CART } from './info.js';

const container = document.querySelector('#cart');

const getCartProductIdsFromSession = () => {
  try {
    const sessionCart = sessionStorage.getItem(SESSION_STORAGE_CART) || '[]';
    const parsedCart = JSON.parse(sessionCart);
    return Array.isArray(parsedCart) ? parsedCart : [];
  } catch (_) {
    return [];
  }
};

const setCartProductIdsInSession = (productIds) => {
  sessionStorage.setItem(SESSION_STORAGE_CART, JSON.stringify(productIds));
};

const renderEmpty = (msg = 'Your cart is empty.') => {
  if (!container) return;
  container.innerHTML = `
    <h2>Your Cart</h2>
    <p>${msg}</p>
  `;
};

const init = async () => {
  if (!container) return;

  let productIds = getCartProductIdsFromSession();

  if (productIds.length === 0) {
    renderEmpty();
    return;
  }

  try {
    const products = await Promise.all(
      productIds.map((productId) => fetch(`${BASE_URL}/${productId}`).then(response => response.json()))
    );

    const list = document.createElement('ul');
    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `
        <article class="product">
          <a href="single_product.htm?id=${product.id}">
            <img src="${product.image}" alt="${product.title}" width="50" height="50" />
          </a>
          <a href="single_product.htm?id=${product.id}">${product.title}</a>
          <div class="product-price">${product.price} DKK</div>
          <button type="button" data-product-id="${product.id}">Remove</button>
        </article>
      `;
      list.appendChild(li);
    });

    container.innerHTML = '<h2>Your Cart</h2>';
    container.appendChild(list);

    // Total price + actions container
    const summary = document.createElement('div');
    summary.className = 'cart-summary';

    const total = products.reduce((sum, product) => sum + Number(product.price || 0), 0);
    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.textContent = `Total: ${total.toFixed(2)} DKK`;
    summary.appendChild(totalElement);

    // Attach remove handlers
    list.querySelectorAll('[data-product-id]').forEach(removeButton => {
      removeButton.addEventListener('click', () => {
        const productId = Number(removeButton.getAttribute('data-product-id'));
        const currentProductIds = getCartProductIdsFromSession();
        const updatedProductIds = currentProductIds.filter(id => id !== productId);
        setCartProductIdsInSession(updatedProductIds);
        init();
      });
    });

    // Empty cart button
    const emptyCartButton = document.createElement('button');
    emptyCartButton.type = 'button';
    emptyCartButton.textContent = 'Empty cart';
    emptyCartButton.addEventListener('click', () => {
      setCartProductIdsInSession([]);
      init();
    });
    summary.appendChild(emptyCartButton);

    container.appendChild(summary);
  } catch (_) {
    renderEmpty('Failed to load cart.');
  }
};

init();
