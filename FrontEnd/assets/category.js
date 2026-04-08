import { elements, reponseJSON } from "./projects.js";

const API_BASE_URL = await fetch('http://localhost:5678/api/categories');
const reponseButton = await API_BASE_URL.json();

reponseJSON.forEach(projet => {
    const category = projet.category
    console.log(category.id);
});

const categorys = document.getElementById("category");
let selectedButton = document.querySelector(".selected");

const buttonAllElements = document.createElement("button");
buttonAllElements.innerText = "Tous";
buttonAllElements.classList.add("btn-category", "selected");

categorys.appendChild(buttonAllElements);

// si clic btn tous remove .selected de tout les autresde
buttonAllElements.addEventListener("click", () => {
    document.querySelectorAll('.btn-category').forEach(btn => {
        btn.classList.remove('selected');
    });

    buttonAllElements.classList.add('selected');
});

reponseButton.forEach(objet => {
    const category = document.createElement("button");
    category.innerText = objet.name;
    category.classList.add("btn-category");

    category.addEventListener("click", () => {
        document.querySelectorAll('.btn-category').forEach(btn => {
            btn.classList.remove('selected');
        });

        category.classList.add('selected');
    });

    categorys.appendChild(category);
});