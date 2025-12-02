import {USERS_BASE_URL} from './info.js';
import { showModal } from './modal.js';

const container = document.querySelector('#signup-form');
if (container) {
  const form = container.querySelector('form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2')?.value || '';

    const showFormError = (text) => { showModal(text); };

    // Basic validation
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValid) { showFormError('Please enter a valid email address.'); return; }

    // Password: 8-20 chars, at least one lowercase, uppercase, number, and special character
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/;
    if (!passwordPolicy.test(password)) { showFormError('Password must be 8-20 chars and include lowercase, uppercase, number, and special character.'); return; }

    if (password !== password2) { showFormError('Passwords do not match.'); return; }

    const newUser = { email, password };

    fetch(`${USERS_BASE_URL}/users`)
      .then(response => response.json())
      .then(users => {
        const exists = Array.isArray(users) && users.some(user => (user.email || '') === email);
        if (exists) { showFormError('Email already exists'); return Promise.reject('DUPLICATE_EMAIL'); }
        return fetch(`${USERS_BASE_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        });
      })
      .then((response) => response.json())
      .then(() => {
        window.location.href = 'login.htm';
      })
      .catch((err) => { if (err !== 'DUPLICATE_EMAIL') showFormError('An error occurred.'); });
  });
}
