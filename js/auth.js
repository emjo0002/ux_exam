import { LOCAL_STORAGE_USER_EMAIL } from './info.js';

const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');
const signupLink = document.getElementById('signup-link');
const cartLink = document.getElementById('cart-link');
const loginItem = loginLink?.closest('li');
const logoutItem = logoutLink?.closest('li');
const signupItem = signupLink?.closest('li');
const cartItem = cartLink?.closest('li');

if (userEmail) {

    if (loginItem) loginItem.classList.add("hidden");
    if (signupItem) signupItem.classList.add("hidden");
    if (logoutItem) logoutItem.classList.remove("hidden");
    if (cartItem) cartItem.classList.remove("hidden");
} else {
    if (loginItem) loginItem.classList.remove("hidden");
    if (signupItem) signupItem.classList.remove("hidden");
    if (logoutItem) logoutItem.classList.add("hidden");
    if (cartItem) cartItem.classList.add("hidden");
}

if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem(LOCAL_STORAGE_USER_EMAIL);
        window.location.href = 'index.html';
    });
}
