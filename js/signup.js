import {USERS_BASE_URL} from './info.js';
import {showModal} from './modal.js';

const container = document.querySelector('#signup-form');
if (container) {
  const form = container.querySelector('form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const newUser = { email, password };

    fetch(`${USERS_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then(() => {
        e.target.reset();
        showModal('Signup successful!');
      })
      .catch(() => showModal('An error occurred.'));
  });
}
