let modaleWindow = document.querySelector(".section-edition");
let modaleInitialisee = false;

export function enableEditMode(token, categorys, reponse_PROJECT, reponse_Button) {

    if (!token) {
        return;
    }

    // Configure l'interface admin.
    updateLoginLink();
    addButtonModify();

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

    // Ajout du bouton "modifier" a côté de "Mes projects".
    function addButtonModify() {

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
        if (modaleInitialisee) return modaleWindow;

        // Empêche l'envoi reel du formulaire tant que l'API d'ajout n'est pas branché.
        const formAdd = document.querySelector(".modal-form-add");
        
        formAdd.addEventListener("submit", event => {
            event.preventDefault();

            const inpuImgValue = document.getElementById("image-upload").files[0];
            const inputTitleValue = document.getElementById("title-upload").value;
            const inputCategoryValue = document.getElementById("category-upload").value;
            addNewProject(inpuImgValue, inputTitleValue, inputCategoryValue)
        });



        // Remplit la liste des catégories et initialise la validation du bouton.
        optionList();
        setupAddFormValidation();

        const modalOverlay = document.querySelector(".modal-overlay");
        const buttonClose = document.querySelector(".modal-close");
        const buttonAddPhoto = document.querySelector(".modal-add-photo");
        const buttonBack = document.querySelector(".modal-back");

        modalOverlay.addEventListener("click", closeModal);
        buttonClose.addEventListener("click", closeModal);
        buttonAddPhoto.addEventListener("click", toggleModalView);
        buttonBack.addEventListener("click", toggleModalView);

        modaleInitialisee = true;
        return modaleWindow;
    }

    // ajoute les categories avec les donnees API (nom des boutons) pour l'ajout des projects.
    function optionList() {
        const selectCategory = document.querySelector("#category-upload");

        reponse_Button.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.innerText = category.name;
            selectCategory.appendChild(option);
        });
    }

    // gérer try/catch

    // Affiche les miniatures des travaux dans la vue galerie de la modale.
    function modalGallery() {
        const galleryModal = document.querySelector(".modal-gallery");
        // Nettoie la galerie avant de la reconstruire.
        galleryModal.innerHTML = "";

        reponse_PROJECT.forEach(work => {
            // Cree un item de galerie.
            const figure = document.createElement("figure");
            figure.classList.add("modal-project");

            // Image du project
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;

            // Bouton supprimer (icone poubelle).
            const buttonDelete = document.createElement("button");
            buttonDelete.type = "button";
            buttonDelete.classList.add("modal-delete");
            buttonDelete.setAttribute("aria-label", "Supprimer le media");
            buttonDelete.innerHTML = `<i class="fa-solid fa-trash-can" aria-hidden="true"></i>`;

            buttonDelete.addEventListener('click', event => {
                event.preventDefault();
                deleteProject(work.id, token, figure);
            });

            // Assemble la vignette et l'ajoute a la grille.
            figure.appendChild(img);
            figure.appendChild(buttonDelete);
            galleryModal.appendChild(figure);
        });
    }

    function activeColorateButton() {
        const inputImage = document.querySelector("#image-upload");
        const inputTitle = document.querySelector("#title-upload");
        const inputCategory = document.querySelector("#category-upload");
        const buttonValidate = document.querySelector(".modal-validate");
        
        if ( inputImage.files.length === 0 || inputTitle.value.trim() === "" || inputCategory.value === "") {
            buttonValidate.classList.remove("modal-validate-active");
            return;
        }        

        buttonValidate.classList.add("modal-validate-active");
    }

    // Gestion etat bouton Valider (couleur/status) lorsqu'input rempli.
    function setupAddFormValidation() {
        const inputImage = document.querySelector("#image-upload");
        const inputTitle = document.querySelector("#title-upload");
        const inputCategory = document.querySelector("#category-upload");

        inputImage.addEventListener("change", () => {
            showImagePreview();
            activeColorateButton();
        });
        inputTitle.addEventListener("input", activeColorateButton);
        inputCategory.addEventListener("change", activeColorateButton);
        activeColorateButton();
    }

    function showImagePreview() {
        const inputImage = document.querySelector("#image-upload");
        const uploadZone = document.querySelector(".modal-upload-zone");
        const preview = document.querySelector(".upload-preview");

        if (inputImage.files.length === 0) return;

        preview.src = URL.createObjectURL(inputImage.files[0]);
        uploadZone.classList.add("image-selected");
    }

    // Ouvre la modale sur la vue galerie.
    function openModal() {
        // Cree la modale au premier clic, sinon reutilise l'existante.
        createModal()

        // Affiche les projects dans la galerie de modale.
        modalGallery();

        // Garantit l'ouverture sur la premiere vue.
        const modalAddView = document.querySelector(".modal-add-view");
        const modalGalleryView = document.querySelector(".modal-gallery-view");

        modalAddView.classList.add("modal-hidden");
        modalGalleryView.classList.remove("modal-hidden");

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
        const modalGalleryView = document.querySelector(".modal-gallery-view");
        const modalAddView = document.querySelector(".modal-add-view");

        modalGalleryView.classList.toggle("modal-hidden");
        modalAddView.classList.toggle("modal-hidden");

        activeColorateButton();
    }

    // suppression de project
    async function deleteProject(id, token, project) {

        try {
            const response = await fetch(`http://localhost:5678/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                window.location.href = "./view/login.html";
                return;
            }

            if (!response.ok) {
                throw new Error(`Erreur lors de la suppression du projet - statut ${response.status}`);
            }

            const projectIndex = reponse_PROJECT.findIndex(work => work.id === id);
            if (projectIndex !== -1) {
                reponse_PROJECT.splice(projectIndex, 1);
            }

            project.remove();
        } catch (error) {
            console.error("Erreur lors de la suppression du projet :", error);
        }
    }

    // Ajout de projet
    async function addNewProject(imageFile, title, categoryId) {

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("category", Number(categoryId));

        try {
            const response = await fetch(`http://localhost:5678/api/works/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Erreur lors de l'ajout du projet");
            }

            const newProject = await response.json();
            reponse_PROJECT.push(newProject);
            modalGallery();
            toggleModalView()
        } catch (error) {
            console.error("Erreur lors de l'ajout du projet :", error);
        }
    }
}