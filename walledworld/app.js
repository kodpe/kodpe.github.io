// Initialisation de la carte centrée sur le monde entier avec des limites
var map = L.map('map', {
    center: [20, 0],
    zoom: 3,
    maxZoom: 5,
    minZoom: 3,
    worldCopyJump: true, // Empêche la carte d'être infinie horizontalement
    maxBounds: [
      [-60, -180], // Sud-ouest
      [80, 180]    // Nord-est
    ],
    maxBoundsViscosity: 10,
  });

// Ajouter un fond de carte sombre et minimaliste (CartoDB Dark Matter)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>',
    zoom: 3,
    maxZoom: 5,
    minZoom: 3,
    maxBounds: [
      [-80, -180], // Sud-ouest
      [84, 180]    // Nord-est
    ],
  }).addTo(map);

// Variable pour stocker les données des pays
let countryData = {};

// Charger les données des pays depuis le fichier JSON
fetch('countries_data.json')
  .then(response => response.json())
  .then(data => {
    countryData = data;

    // Charger les données GeoJSON des pays et ajouter les fonctionnalités de clic
    fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
      .then(response => response.json())
      .then(geoData => {
        L.geoJSON(geoData, {
          style: {
            color: '#00aa00',
            weight: 0.5,
            fillOpacity: 0.01
          },
          onEachFeature: function(feature, layer) {
            // Rendre chaque pays cliquable et afficher un popup avec des infos
            layer.on('click', function() {
              const countryName = feature.properties.name;
              const info = countryData[countryName];

              let popupContent = `<h3>${countryName}</h3>`;
              if (info) {
                popupContent += `<span>Population: ${info.population}<br></span>`;
                popupContent += `<span>Superficie: ${info.area}</span>`;
              } else {
                popupContent += "<p>Données non disponibles</p>";
              }

              // Affiche le popup sur la carte
              layer.bindPopup(popupContent).openPopup();
            });
          }
        }).addTo(map);
      })
      .catch(error => console.error('Erreur lors du chargement des données GeoJSON :', error));
  })
  .catch(error => console.error('Erreur lors du chargement des données des pays :', error));
