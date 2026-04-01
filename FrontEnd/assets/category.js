const API_BASE_URL = await fetch('http://localhost:5678/api/categories');
const reponse = await API_BASE_URL.json();
console.log(reponse);

const category = document.getElementById("category");

reponse.forEach(objet => {
    
    const categorie = document.createElement("button");
    categorie.innerText = objet.name;
    categorie.classList = "btn-category"
    category.appendChild(categorie);

});

console.log(category);
