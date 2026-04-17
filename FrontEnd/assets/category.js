const API_PROJECT = await fetch("http://localhost:5678/api/works");
const reponse_PROJECT = await API_PROJECT.json();

const API_CATEGORY = await fetch('http://localhost:5678/api/categories');
const reponseButton = await API_CATEGORY.json();

const projects = document.querySelector(".gallery");
const categorys = document.getElementById("category");
const gallery = document.querySelectorAll(".gallery figure");


