// Initialisation de la carte centrée sur le monde entier
var map = L.map('map').setView([20, 0], 2);

// Ajouter un fond de carte
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Charger les données GeoJSON des pays
fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
  .then(response => response.json())
  .then(data => {
    // Ajouter les pays à la carte en utilisant GeoJSON
    L.geoJSON(data, {
      style: {
        color: '#3388ff',
        weight: 1,
        fillOpacity: 0.2
      },
      onEachFeature: function(feature, layer) {
        // Rendre chaque pays cliquable
        layer.on('click', function() {
          alert(`Vous avez cliqué sur : ${feature.properties.name}`);
        });
      }
    }).addTo(map);
  })
  .catch(error => console.error('Erreur lors du chargement des données GeoJSON :', error));
