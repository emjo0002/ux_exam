// Check if user is logged in and toggle login/logout links
const userEmail = sessionStorage.getItem('fake-shop_user-email');
const loginLink = document.querySelector('header a#login-link');
const logoutLink = document.querySelector('header a#logout-link');

if (userEmail) {
  if (loginLink) loginLink.classList.add('hidden');
  if (logoutLink) logoutLink.classList.remove('hidden');
} else {
  if (loginLink) loginLink.classList.remove('hidden');
  if (logoutLink) logoutLink.classList.add('hidden');
}

if (logoutLink) {
  logoutLink.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.removeItem('fake-shop_user-email');
    window.location.reload();
  });
}
