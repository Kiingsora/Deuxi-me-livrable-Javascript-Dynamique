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
        buttonModifier.innerHTML = `
            <i class="fa-regular fa-pen-to-square" aria-hidden="true"></i>
            <span>modifier</span>
        `;

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
        modaleWindow.querySelector(".modal-add-photo").addEventListener("click", toggleModalView);
        modaleWindow.querySelector(".modal-back").addEventListener("click", toggleModalView);

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

    // Affiche les miniatures des travaux dans la vue galerie de la modale.
    function renderModalGallery() {
        const galleryModal = modaleWindow.querySelector(".modal-gallery");

        // Nettoie la galerie avant de la reconstruire.
        galleryModal.innerHTML = "";

        reponse_PROJECT.forEach(work => {
            // Cree un item de galerie.
            const figure = document.createElement("figure");
            figure.classList.add("modal-project");

            // Image du projet.
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            // Bouton supprimer (icone poubelle).
            const buttonDelete = document.createElement("button");
            buttonDelete.type = "button";
            buttonDelete.classList.add("modal-delete");
            buttonDelete.setAttribute("aria-label", "Supprimer le media");
            buttonDelete.innerHTML = `<i class="fa-solid fa-trash-can" aria-hidden="true"></i>`;

            // Assemble la vignette et l'ajoute a la grille.
            figure.appendChild(img);
            figure.appendChild(buttonDelete);
            galleryModal.appendChild(figure);
        });
    }

    // Gere l'etat actif/inactif du bouton Valider dans la vue d'ajout.
    function setupAddFormValidation() {
        const inputImage = modaleWindow.querySelector("#image-upload");
        const inputTitle = modaleWindow.querySelector("#title-upload");
        const inputCategory = modaleWindow.querySelector("#category-upload");

        inputImage.addEventListener("change", refreshValidateButton);
        inputTitle.addEventListener("input", refreshValidateButton);
        inputCategory.addEventListener("change", refreshValidateButton);

        refreshValidateButton();
    }

    function refreshValidateButton() {
        const inputImage = modaleWindow.querySelector("#image-upload");
        const inputTitle = modaleWindow.querySelector("#title-upload");
        const inputCategory = modaleWindow.querySelector("#category-upload");
        const buttonValidate = modaleWindow.querySelector(".modal-validate");

        if (inputImage.files.length === 0) {
            buttonValidate.classList.remove("modal-validate-active");
            return;
        }

        if (inputTitle.value.trim() === "") {
            buttonValidate.classList.remove("modal-validate-active");
            return;
        }

        if (inputCategory.value === "") {
            buttonValidate.classList.remove("modal-validate-active");
            return;
        }

        buttonValidate.classList.add("modal-validate-active");
    }

    // Ouvre la modale sur la vue galerie.
    function openModal() {
        // Cree la modale au premier clic, sinon reutilise l'existante.
        createModal()

        // Affiche les projets dans la galerie de modale.
        renderModalGallery();

        // Garantit l'ouverture sur la premiere vue.
        modaleWindow.querySelector(".modal-add-view").classList.add("modal-hidden");
        modaleWindow.querySelector(".modal-gallery-view").classList.remove("modal-hidden");

        // Rend la modale visible et bloque le scroll de fond.
        modaleWindow.classList.add("modal-open");
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
        document.body.classList.remove("modal-active");
    }

    // Alterne entre la vue galerie et la vue ajout photo.
    function toggleModalView() {
        modaleWindow.querySelector(".modal-gallery-view").classList.toggle("modal-hidden");
        modaleWindow.querySelector(".modal-add-view").classList.toggle("modal-hidden");

        refreshValidateButton();
    }
}
