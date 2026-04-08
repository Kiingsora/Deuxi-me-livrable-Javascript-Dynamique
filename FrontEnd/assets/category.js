const API_BASE_URL = await fetch('http://localhost:5678/api/categories');
const reponse = await API_BASE_URL.json();

const categorys = document.getElementById("category");
let selectedButton = document.querySelector(".selected ");

const allButton = document.createElement("button");
allButton.innerText = "Tous";
allButton.classList.add("btn-category", "selected"); // Sélectionné par défaut
categorys.appendChild(allButton);

allButton.addEventListener("click", () => {
    document.querySelectorAll('.btn-category').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    allButton.classList.add('selected');
    console.log("Affichage de tous les projets");
});

reponse.forEach(objet => {
    const category = document.createElement("button");
    category.innerText = objet.name;
    category.classList.add("btn-category");

    category.addEventListener("click", () => {
        document.querySelectorAll('.btn-category').forEach(btn => {
            btn.classList.remove('selected');
        });

        category.classList.add('selected');
        console.log("Catégorie sélectionnée:", category.textContent);
    });

    categorys.appendChild(category);
});