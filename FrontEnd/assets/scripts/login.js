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
    
    if (!API_LOGIN.ok) {
        throw new Error("Erreur dans l'identifiant ou le mot de passe");
    }
    
    const reponse_LOGIN = await API_LOGIN.json();   
    return reponse_LOGIN;
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorMessage.innerText = "";
    
    const user = {
        email: emailInput.value,
        password: passwordInput.value
    };
    
    try {
        const responseId_Token = await login(user);
        
        localStorage.setItem("token", responseId_Token.token);
        window.location.href = "../index.html";
    } catch (error) {
        errorMessage.innerText = "Erreur dans l'identifiant ou le mot de passe";
    }
});
