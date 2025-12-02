import { LOCAL_STORAGE_USER_EMAIL } from './info.js';

// Check if user is logged in and toggle login/logout links
const userEmail = localStorage.getItem(LOCAL_STORAGE_USER_EMAIL);
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');
const signupLink = document.getElementById('signup-link');
const loginItem = loginLink?.closest('li');
const logoutItem = logoutLink?.closest('li');
const signupItem = signupLink?.closest('li');

if (userEmail) {
    // User is logged in, show logout and hide login
    if (loginItem) loginItem.classList.add("hidden");
    if (signupItem) signupItem.classList.add("hidden");
    if (logoutItem) logoutItem.classList.remove("hidden");
} else {
    // User is not logged in, show login and hide logout
    if (loginItem) loginItem.classList.remove("hidden");
    if (signupItem) signupItem.classList.remove("hidden");
    if (logoutItem) logoutItem.classList.add("hidden");
}

// Handle logout click
if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem(LOCAL_STORAGE_USER_EMAIL);
        window.location.reload();
    });
}
