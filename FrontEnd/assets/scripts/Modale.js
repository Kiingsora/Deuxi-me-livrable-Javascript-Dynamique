// Garde une reference unique de la modale pour eviter d'en creer plusieurs.
let modalEdition = null;

export function enableEditMode(token, categorys, reponse_PROJECT, reponse_Button) {
   
    if (!token) {
        return;
    }

    // Configure l'interface admin.
    updateLoginLink();
    injectModifierButton();

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
        
        // prepend pour ajouter un noed avant le firstchild
        portfolioSection.prepend(portfolioHeader, titrePortfolio);
        portfolioHeader.appendChild(titrePortfolio);

        const buttonModifier = document.createElement("button");
        buttonModifier.type = "button";
        buttonModifier.className = "btn-modifier";
        buttonModifier.innerHTML = ` [i] <span>modifier</span>`;

        buttonModifier.addEventListener("click", openModal);

        portfolioHeader.appendChild(buttonModifier);
    }
// reprendre ici
    function createModal() {

        const modalTemplate = document.getElementById("modal-template");
        if (!modalTemplate) return null;

        modalEdition = modalTemplate.content.firstElementChild.cloneNode(true);

        // Injecte la modale dans le DOM.
        document.body.appendChild(modalEdition);

        // Gestion des actions de fermeture/ouverture des vues.
        modalEdition.querySelector(".modal-overlay").addEventListener("click", closeModal);
        modalEdition.querySelector(".modal-close").addEventListener("click", closeModal);
        modalEdition.querySelector(".modal-add-photo").addEventListener("click", openAddView);
        modalEdition.querySelector(".modal-back").addEventListener("click", openGalleryView);

        // Ferme la modale avec la touche Echap.
        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && modalEdition.classList.contains("modal-open")) {
                closeModal();
            }
        });

        // Empche l'envoi reel du formulaire tant que l'API d'ajout n'est pas branchee.
        const formAdd = modalEdition.querySelector(".modal-form-add");
        formAdd.addEventListener("submit", event => {
            event.preventDefault();
        });

        // Remplit la liste des categories et initialise la validation du bouton.
        populateCategorySelect();
        setupAddFormValidation();

        return modalEdition;
    }

    // Remplit le select des categories avec les donnees API.
    function populateCategorySelect() {
        const select = modalEdition.querySelector("#category-upload");

        reponse_Button.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.innerText = category.name;
            select.appendChild(option);
        });
    }

    // Affiche les miniatures des travaux dans la vue galerie de la modale.
    function renderModalGallery() {
        const galleryModal = modalEdition.querySelector(".modal-gallery");

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
            buttonDelete.innerHTML = `
                <svg class="modal-delete-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v8h-2V9zm4 0h2v8h-2V9zM7 9h2v8H7V9z"></path>
                </svg>
            `;

            // Assemble la vignette et l'ajoute a la grille.
            figure.appendChild(img);
            figure.appendChild(buttonDelete);
            galleryModal.appendChild(figure);
        });
    }

    // Gere l'etat actif/inactif du bouton Valider dans la vue d'ajout.
    function setupAddFormValidation() {
        const inputImage = modalEdition.querySelector("#image-upload");
        const inputTitle = modalEdition.querySelector("#title-upload");
        const inputCategory = modalEdition.querySelector("#category-upload");
        const buttonValidate = modalEdition.querySelector(".modal-validate");

        // Verifie que les 3 champs obligatoires sont renseignes.
        const refreshState = () => {
            const formIsValid =
                inputImage.files.length > 0 &&
                inputTitle.value.trim() !== "" &&
                inputCategory.value !== "";

            // Active la classe CSS quand le formulaire est valide.
            buttonValidate.classList.toggle("modal-validate-active", formIsValid);
        };

        // Recalcule l'etat a chaque modification de champ.
        inputImage.addEventListener("change", refreshState);
        inputTitle.addEventListener("input", refreshState);
        inputCategory.addEventListener("change", refreshState);

        // Etat initial.
        refreshState();
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
        modalEdition.classList.add("modal-open");
        modalEdition.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-active");
    }

    // Ferme la modale.
    function closeModal() {
        // Si pas de modale creee, on ne fait rien.
        if (!modalEdition) {
            return;
        }

        // Cache la modale et retablit le scroll de page.
        modalEdition.classList.remove("modal-open");
        modalEdition.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-active");
    }

    // Passe de la vue galerie a la vue ajout photo.
    function openAddView() {
        modalEdition.querySelector(".modal-gallery-view").classList.add("modal-hidden");
        modalEdition.querySelector(".modal-add-view").classList.remove("modal-hidden");

        // Reinitialise visuellement le bouton Valider (etat non actif).
        modalEdition.querySelector(".modal-validate").classList.remove("modal-validate-active");
    }

    // Revient de la vue ajout photo vers la vue galerie.
    function openGalleryView() {
        modalEdition.querySelector(".modal-add-view").classList.add("modal-hidden");
        modalEdition.querySelector(".modal-gallery-view").classList.remove("modal-hidden");
    }
}
