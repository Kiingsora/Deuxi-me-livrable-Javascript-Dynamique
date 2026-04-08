const API_BASE_URL = await fetch("http://localhost:5678/api/works");
export const reponseJSON = await API_BASE_URL.json();

const projects = document.querySelector(".gallery");

function elements(reponseApi, gallery) {
    gallery.innerHTML = "";

    reponseApi.forEach(objet => {

        let projet = document.createElement("figure");
        let imageProjet = document.createElement("img");
        let figcaptionProjet = document.createElement("figcaption");

        imageProjet.src = objet.imageUrl;
        imageProjet.alt = objet.title;
        figcaptionProjet.innerText = objet.title;

        projet.appendChild(imageProjet);
        projet.appendChild(figcaptionProjet);
        gallery.appendChild(projet);
        
    });
}

elements(reponseJSON, projects);
export { elements }

