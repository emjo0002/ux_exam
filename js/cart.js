import { BASE_URL, SESSION_STORAGE_CART, SESSION_STORAGE_USER_EMAIL } from './info.js';

const container = document.querySelector('#cart');

const getCartItemsFromSession = () => {
  try {
    const sessionCart = sessionStorage.getItem(SESSION_STORAGE_CART) || '[]';
    const parsedCart = JSON.parse(sessionCart);
    if (Array.isArray(parsedCart) && parsedCart.every(item => typeof item === 'object' && item.id && item.quantity)) {
      return parsedCart;
    }
    if (Array.isArray(parsedCart) && parsedCart.every(item => typeof item === 'number')) {
      const newCart = parsedCart.map(id => ({ id, quantity: 1 }));
      setCartItemsInSession(newCart);
      return newCart;
    }
    return [];
  } catch (_) {
    return [];
  }
};

const setCartItemsInSession = (cartItems) => {
  sessionStorage.setItem(SESSION_STORAGE_CART, JSON.stringify(cartItems));
};

const renderEmpty = (msg) => {
  if (!container) return;
  container.innerHTML = `
    <h2>Your Cart</h2>
    <p>${msg}</p>
  `;
};

const init = async () => {
  if (!container) return;

  let cartItems = getCartItemsFromSession();

  if (cartItems.length === 0) {
    const userEmail = sessionStorage.getItem(SESSION_STORAGE_USER_EMAIL);
    const message = userEmail ? 'Your cart is empty.' : 'Login to get items in your cart';
    renderEmpty(message);
    return;
  }

  try {
    const products = await Promise.all(
      cartItems.map(item => fetch(`${BASE_URL}/${item.id}`).then(response => response.json()))
    );

    const list = document.createElement('ul');
    let total = 0;

    products.forEach(product => {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (!cartItem) return;

      total += (product.price || 0) * cartItem.quantity;

      const li = document.createElement('li');
      li.innerHTML = `
        <article class="product">
          <a href="single_product.htm?id=${product.id}">
            <img src="${product.image}" alt="${product.title}" width="50" height="50" />
          </a>
          <a href="single_product.htm?id=${product.id}">${product.title}</a>
          <div class="product-quantity">
            <button type="button" class="quantity-change" data-product-id="${product.id}" data-change="-1">-</button>
            <span>${cartItem.quantity}</span>
            <button type="button" class="quantity-change" data-product-id="${product.id}" data-change="1">+</button>
          </div>
          <div class="product-price">${(product.price * cartItem.quantity).toFixed(2)} DKK</div>
          <button type="button" class="remove-item" data-product-id="${product.id}">Remove</button>
        </article>
      `;
      list.appendChild(li);
    });

    container.innerHTML = '<h2>Your Cart</h2>';
    container.appendChild(list);

    const summary = document.createElement('div');
    summary.className = 'cart-summary';

    const totalElement = document.createElement('div');
    totalElement.className = 'cart-total';
    totalElement.textContent = `Total: ${total.toFixed(2)} DKK`;
    summary.appendChild(totalElement);

    list.querySelectorAll('.quantity-change').forEach(button => {
      button.addEventListener('click', () => {
        const productId = Number(button.dataset.productId);
        const change = Number(button.dataset.change);
        const currentCartItems = getCartItemsFromSession();
        const itemToUpdate = currentCartItems.find(item => item.id === productId);

        if (itemToUpdate) {
          itemToUpdate.quantity += change;
        }

        const updatedCartItems = currentCartItems.filter(item => item.quantity > 0);
        setCartItemsInSession(updatedCartItems);
        init();
      });
    });

    list.querySelectorAll('.remove-item').forEach(removeButton => {
      removeButton.addEventListener('click', () => {
        const productId = Number(removeButton.dataset.productId);
        const currentCartItems = getCartItemsFromSession();
        const updatedCartItems = currentCartItems.filter(item => item.id !== productId);
        setCartItemsInSession(updatedCartItems);
        init();
      });
    });

    const emptyCartButton = document.createElement('button');
    emptyCartButton.type = 'button';
    emptyCartButton.textContent = 'Empty cart';
    emptyCartButton.addEventListener('click', () => {
      setCartItemsInSession([]);
      init();
    });
    summary.appendChild(emptyCartButton);

    container.appendChild(summary);
  } catch (_) {
    renderEmpty('Failed to load cart.');
  }
};

init();
