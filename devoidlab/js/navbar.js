window.addEventListener('load', function() {
    var navbarContainer = document.querySelector("#navbar-container");
    
    fetch('navbar.html') // Charger le fichier navbar.html
        .then(response => response.text())  // Lire le contenu du fichier
        .then(data => {
            navbarContainer.innerHTML = data;  // Insérer la navbar dans le conteneur
        })
        .catch(error => console.log('Erreur lors du chargement de la navbar:', error));
});
