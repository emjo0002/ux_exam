import {USERS_BASE_URL} from './info.js';
import { showModal } from './modal.js';

const container = document.querySelector('#signup-form');
if (container) {
  const form = container.querySelector('form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;

    const showFormError = (text) => { showModal(text); };

    // Basic validation
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) { showFormError('Please enter a valid email address.'); return; }

    // Password: 8-20 chars, at least one lowercase, uppercase, number, and special character
    const passwordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
    if (!passwordValid.test(password)) { showFormError('Password must be 8-20 chars and include lowercase, uppercase, number, and special character.'); return; }

    if (password !== password2) { showFormError('Passwords do not match.'); return; }

    // First check for duplicate email, then defer the POST until user chooses an action
    fetch(`${USERS_BASE_URL}/users`)
      .then(response => response.json())
      .then(users => {
        const exists = Array.isArray(users) && users.some(user => (user.email || '') === email);
        if (exists) {
          showModal('Email already exists. Try login instead.');
          // Hide login button when user already exists (do not remove so it can be shown later)
          const btn = document.querySelector('#mdlInfo #btn');
          if (btn) btn.style.display = 'none';
          return;
        }

        // Put pending signup into session storage
        sessionStorage.setItem('pendingSignup', JSON.stringify({ email, password }));

        // Show modal and wire local handlers to flush on either button
        showModal('You have now created a user. Close to stay on the site, or go to the login page.');

        const loginBtn = document.querySelector('#mdlInfo #btn');
        if (loginBtn) loginBtn.style.display = '';
        const closeBtn = document.querySelector('#mdlInfo button:not(#btn)');

        loginBtn?.addEventListener('click', () => {
          const raw = sessionStorage.getItem('pendingSignup');
          if (!raw) return;
          fetch(`${USERS_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: raw,
          })
          .then(() => { sessionStorage.removeItem('pendingSignup'); window.location.href = 'login.htm'; });
        }, { once: true });

        closeBtn?.addEventListener('click', () => {
          const raw = sessionStorage.getItem('pendingSignup');
          if (!raw) return;
          fetch(`${USERS_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: raw,
          })
          .then(() => { sessionStorage.removeItem('pendingSignup'); });
        }, { once: true });
      })
      .catch((err) => { if (err !== 'DUPLICATE_EMAIL') showFormError('An error occurred.'); });
  });
}
