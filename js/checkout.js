import { LOCAL_STORAGE_USER_EMAIL, LOCAL_STORAGE_CART } from './info.js';

const form = document.querySelector('#checkout-form');
const result = document.querySelector('#checkout-result');
const billingToggle = document.querySelector('#billing-different');
const billingFieldset = document.querySelector('#billing-fieldset');

const getUserEmail = () => localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);
const cartKeyFor = (email) => `${LOCAL_STORAGE_CART}${email}`;

const showMessage = (msg) => {
  if (!result) return;
  result.classList.remove('hidden');
  result.textContent = msg;
};

if (form) {
  const userEmail = getUserEmail();
  if (!userEmail) {
    showMessage('Please log in to proceed to checkout.');
    form.querySelector('button[type="submit"]').disabled = true;
  }

  // Toggle billing address visibility
  if (billingToggle && billingFieldset) {
    const updateBillingVisibility = () => {
      if (billingToggle.checked) {
        billingFieldset.classList.remove('hidden');
      } else {
        billingFieldset.classList.add('hidden');
      }
    };
    billingToggle.addEventListener('change', updateBillingVisibility);
    updateBillingVisibility();
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    // Minimal client-side validation
    const baseRequiredIds = [
      'delivery-name','delivery-address','delivery-city','delivery-zip','delivery-country',
      'cc-number','cc-exp','cc-cvc'
    ];
    const billingRequiredIds = [
      'billing-name','billing-address','billing-city','billing-zip','billing-country'
    ];
    const requireBilling = !!(billingToggle && billingToggle.checked);
    const requiredIds = requireBilling ? baseRequiredIds.concat(billingRequiredIds) : baseRequiredIds;

    for (const id of requiredIds) {
      const inputField = document.getElementById(id);
      if (!inputField || !inputField.value.trim()) {
        showMessage('Please fill out all fields.');
        return;
      }
    }

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

    showMessage('Success! Your order has been placed.');
    form.reset();
  });
}
