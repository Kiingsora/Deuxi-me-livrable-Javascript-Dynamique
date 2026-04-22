const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const errorMessage = document.createElement("p");
errorMessage.classList.add("error-login");

loginForm.appendChild(errorMessage);

async function login(user) {
    const chargeUtile = JSON.stringify(user);
    
    const API_LOGIN = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: chargeUtile
    });
    
    // ok = objet de réponse qui permet de savoir si le lien est bien en statut reussi (200 -> 299)
    if (!API_LOGIN.ok) {
        throw new Error("erreur côté serveur" + API_LOGIN.status);
    }
    
    const reponse_LOGIN = await API_LOGIN.json();   
    return reponse_LOGIN;
}

