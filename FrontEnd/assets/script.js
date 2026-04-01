async function fetchURL(){
    const API_BASE_URL = await fetch("http://localhost:5678/api/works");
    const reponse = await API_BASE_URL.json();
    console.log(reponse);
}

