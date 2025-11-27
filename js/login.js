import {USERS_BASE_URL, SESSION_STORAGE_USER_EMAIL} from "./info.js";
import {showModal} from "./modal.js";

document.querySelector("#login-form form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    fetch(`${USERS_BASE_URL}/users`)
    .then(response => response.json())
    .then(users => {
        let found = false;
        
        users.forEach(user => {
            if (user.email === email && user.password === password) {
                found = true;
                sessionStorage.setItem(SESSION_STORAGE_USER_EMAIL, email);
                window.location.href = "index.html";
            }
        });
        
        if (!found) {
            showModal("Invalid email or password");
        }
    })
    .catch(() => showModal("An error occurred."));
});