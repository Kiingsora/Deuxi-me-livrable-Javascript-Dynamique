const API_BASE_URL = await fetch("http://localhost:5678/api/works");
const reponse = await API_BASE_URL.json();

const projets = document.getElementById("portfolio");
const gallery = document.querySelector(".gallery");

reponse.forEach(objet => {

    let projet = document.createElement("figure");
    let imageProjet = document.createElement("img");
    imageProjet.src = objet.imageUrl;
    imageProjet.alt = objet.title;

    let figcaptionProjet = document.createElement("figcaption")
    figcaptionProjet.innerText = objet.title;

    gallery.appendChild(projet);
    projet.appendChild(imageProjet);
    projet.appendChild(figcaptionProjet);
});

// document.addEventListener('DOMContentLoaded', {
// })