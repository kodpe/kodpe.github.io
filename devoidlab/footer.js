// Attendre que le contenu de la page soit complètement chargé
document.addEventListener("DOMContentLoaded", function() {
    // Créer un élément <footer>
    var footer = document.createElement('footer');
    
    // Récupérer l'année actuelle
    var currentYear = new Date().getFullYear();
    
    // Ajouter le contenu de la mention de copyright
    footer.innerHTML = `
      <p>© Copyright ${currentYear} kodpe.github.io. All rights reserved.
      kodpe.github.io isn't endorsed by Riot Games Corporation and doesn't reflect the views
      or opinions of Riot Games or anyone officially involved in producing or managing League of Legends.
      League of Legends and Riot Games are trademarks or registered trademarks of Riot Games, Inc.
      League of Legends © Riot Games, Inc.</p>
    `;
    
    // Ajouter le footer à la fin du body
    document.body.appendChild(footer);
});

document.addEventListener("scroll", function() {
    var footer = document.querySelector('footer');
    // Vérifier si l'utilisateur est en bas de la page
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        footer.style.bottom = '0'; // Afficher le footer en bas
    } else {
        footer.style.bottom = '-100px'; // Cacher le footer si on n'est pas en bas
    }
});
