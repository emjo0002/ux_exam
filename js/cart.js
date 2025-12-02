import { BASE_URL, LOCAL_STORAGE_USER_EMAIL, LOCAL_STORAGE_CART } from './info.js';

const container = document.querySelector('#cart');

const getCartItems = () => {
  const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);
  if (!userEmail) return [];
  const key = `${LOCAL_STORAGE_CART}${userEmail}`;
  try {
    const localCartRaw = localStorage.getItem(key);
    if (localCartRaw) {
      const localCart = JSON.parse(localCartRaw);
      if (Array.isArray(localCart) && localCart.every(item => typeof item === 'object' && item.id && item.quantity)) {
        return localCart;
      }
    }
    return [];
  } catch (_) {
    return [];
  }
};

const setCartItems = (cartItems) => {
  const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);
  if (!userEmail) return;
  const key = `${LOCAL_STORAGE_CART}${userEmail}`;
  localStorage.setItem(key, JSON.stringify(cartItems));
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

  let cartItems = getCartItems();

  if (cartItems.length === 0) {
    const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);
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
          <a href="product.htm?id=${product.id}">
            <img src="${product.image}" alt="${product.title}" width="50" height="50" />
          </a>
          <a href="product.htm?id=${product.id}">${product.title}</a>
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

    const checkoutLink = document.createElement('a');
    checkoutLink.href = 'checkout.htm';
    checkoutLink.className = 'btn-checkout';
    checkoutLink.textContent = 'Proceed to checkout';
    summary.appendChild(checkoutLink);

    list.querySelectorAll('.quantity-change').forEach(button => {
      button.addEventListener('click', () => {
        const productId = Number(button.dataset.productId);
        const change = Number(button.dataset.change);
        const currentCartItems = getCartItems();
        const itemToUpdate = currentCartItems.find(item => item.id === productId);

        if (itemToUpdate) {
          itemToUpdate.quantity += change;
        }

        const updatedCartItems = currentCartItems.filter(item => item.quantity > 0);
        setCartItems(updatedCartItems);
        init();
      });
    });

    list.querySelectorAll('.remove-item').forEach(removeButton => {
      removeButton.addEventListener('click', () => {
        const productId = Number(removeButton.dataset.productId);
        const currentCartItems = getCartItems();
        const updatedCartItems = currentCartItems.filter(item => item.id !== productId);
        setCartItems(updatedCartItems);
        init();
      });
    });

    const emptyCartButton = document.createElement('button');
    emptyCartButton.type = 'button';
    emptyCartButton.textContent = 'Empty cart';
    emptyCartButton.addEventListener('click', () => {
      setCartItems([]);
      init();
    });
    summary.appendChild(emptyCartButton);

    container.appendChild(summary);
  } catch (_) {
    renderEmpty('Failed to load cart.');
  }
};

init();
