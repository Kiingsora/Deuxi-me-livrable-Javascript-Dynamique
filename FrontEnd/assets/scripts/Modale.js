let modaleWindow = document.querySelector(".section-edition");

export function enableEditMode(token, categorys, reponse_PROJECT, reponse_Button) {
   
    if (!token) {
        return;
    }

    // Configure l'interface admin.
    updateLoginLink();
    injectModifierButton();

    // cache tt les éléments boutons de tri + ajout mot logout
    function updateLoginLink() {

        const loginLink = document.querySelector("nav ul li a");
        if (!loginLink) return;
        
        categorys.style.display = "none";

        loginLink.textContent = "logout";
        loginLink.onclick = event => {
            event.preventDefault();
            
            localStorage.removeItem("token");
            window.location.reload();
        };
    }

    // Ajoute le bouton "modifier" a cote de "Mes Projets".
    function injectModifierButton() {
        
        const portfolioSection = document.getElementById("portfolio");
        const portfolioHeader = document.createElement("div");
        portfolioHeader.className = "portfolio-header";

        const titrePortfolio = portfolioSection.querySelector("h2");
        
        // prepend pour ajouter un noeud avant le firstchild
        portfolioSection.prepend(portfolioHeader, titrePortfolio);
        portfolioHeader.appendChild(titrePortfolio);

        const buttonModifier = document.createElement("button");
        buttonModifier.type = "button";
        buttonModifier.className = "btn-modifier";
        buttonModifier.innerHTML = ` [i] <span>modifier</span>`;

        buttonModifier.addEventListener("click", openModal);

        portfolioHeader.appendChild(buttonModifier);
    }

    function createModal() {

        // Empêche l'envoi reel du formulaire tant que l'API d'ajout n'est pas branchee.
        const formAdd = modaleWindow.querySelector(".modal-form-add");
        formAdd.addEventListener("submit", event => {
            event.preventDefault();
        });

        // Remplit la liste des categories et initialise la validation du bouton.
        populateCategorySelect()
        setupAddFormValidation();

        modaleWindow.querySelector(".modal-overlay").addEventListener("click", closeModal);
        modaleWindow.querySelector(".modal-close").addEventListener("click", closeModal);
        modaleWindow.querySelector(".modal-add-photo").addEventListener("click", openAddView);
        modaleWindow.querySelector(".modal-back").addEventListener("click", openGalleryView);

        return modaleWindow;
    }

    // ajoute les categories avec les donnees API (nom des boutons) pour l'ajout des projets.
    function populateCategorySelect() {
        const select = modaleWindow.querySelector("#category-upload");

        reponse_Button.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.innerText = category.name;
            select.appendChild(option);
        });
    }

    // Ouvre la modale sur la vue galerie.
    function openModal() {
        // Cree la modale au premier clic, sinon reutilise l'existante.
        if (!createModal()) return;

        // Affiche les projets dans la galerie de modale.
        renderModalGallery();

        // Garantit l'ouverture sur la premiere vue.
        openGalleryView();

        // Rend la modale visible et bloque le scroll de fond.
        modaleWindow.classList.add("modal-open");
        modaleWindow.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-active");
    }

    // Ferme la modale.
    function closeModal() {
        // Si pas de modale creee, on ne fait rien.
        if (!modaleWindow) {
            return;
        }

        // Cache la modale et retablit le scroll de page.
        modaleWindow.classList.remove("modal-open");
        modaleWindow.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-active");
    }


}