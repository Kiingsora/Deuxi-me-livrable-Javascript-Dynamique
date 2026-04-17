const API_PROJECT = await fetch("http://localhost:5678/api/works");
const API_CATEGORY = await fetch('http://localhost:5678/api/categories');
const reponse_PROJECT = await API_PROJECT.json();
const reponse_Button = await API_CATEGORY.json();

const projects = document.querySelector(".gallery");
const categorys = document.getElementById("category");

function display(displayWorks) {
    projects.innerHTML = "";
    displayWorks.forEach(work => {
        let projet = document.createElement("figure");
        let imageProjet = document.createElement("img");
        imageProjet.src = work.imageUrl;
        imageProjet.alt = work.title;

        let figcaptionProjet = document.createElement("figcaption");
        figcaptionProjet.innerText = work.title;

        projet.appendChild(imageProjet);
        projet.appendChild(figcaptionProjet);
        projects.appendChild(projet);
    });
}

display(reponse_PROJECT);


const buttonAll = document.createElement("button");
buttonAll.textContent = "Tous";
buttonAll.classList.add("btn-category", "selected");
buttonAll.addEventListener("click", () => {
    document.querySelectorAll('.btn-category').forEach(btn => {
        btn.classList.remove('selected');
    });
    buttonAll.classList.add('selected');
    display(reponse_PROJECT);
});
categorys.appendChild(buttonAll);

reponse_Button.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.classList.add("btn-category");
    button.addEventListener("click", () => {
        document.querySelectorAll('.btn-category').forEach(btn => {
            btn.classList.remove('selected');
        });
        button.classList.add('selected');
        const filteredWorks = reponse_PROJECT.filter(project => project.categoryId === category.id);
        display(filteredWorks);
    });
    categorys.appendChild(button);
});

