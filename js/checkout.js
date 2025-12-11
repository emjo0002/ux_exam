import { LOCAL_STORAGE_USER_EMAIL, LOCAL_STORAGE_CART } from './info.js';
import { showModal } from './modal.js';

const form = document.querySelector('#checkout-form');

const getUserEmail = () => localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);
const cartKeyFor = (email) => `${LOCAL_STORAGE_CART}${email}`;

const showMessage = (msg) => { showModal(msg); };

if (form) {
  const userEmail = getUserEmail();
  if (!userEmail) {
    showMessage('Please log in to proceed to checkout.');
  }


  form.addEventListener('submit', (event) => {
    event.preventDefault();


    const email = getUserEmail();
    if (!email) {
      showMessage('Please log in to proceed to checkout.');
      return;
    }

    // Clear the current user's cart from localStorage
    try {
      localStorage.removeItem(cartKeyFor(email));
    } catch (_) {
      // ignore
    }

    // Show completion modal using shared modal system and redirect on close
    form.reset();
    showModal('Success! Your order has been placed.');
    const mdl = document.getElementById('mdlInfo');
    if (mdl) {
      mdl.addEventListener('close', () => {
        window.location.href = 'index.html';
      }, { once: true });
    }
  });
}
