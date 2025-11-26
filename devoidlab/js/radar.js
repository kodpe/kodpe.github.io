window.addEventListener('load', function() {
    var container = document.querySelector("#radar-container");
    
    fetch('radar.html')
        .then(response => response.text())
        .then(data => {
            container.innerHTML = data;
            loadLocalization("data/champions/localization.json");
            loadChampion("data/champions/Gribiwee/Gribiwee.json"); // get champion name
        })
        .catch(error => console.log('Erreur lors du chargement du radar:', error));



});