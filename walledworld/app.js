// Initialisation de la carte centrée sur le monde entier avec des limites
var map = L.map('map', {
    center: [20, 0],
    zoom: 3,
    maxZoom: 5,
    minZoom: 3,
    worldCopyJump: true, // Empêche la carte d'être infinie horizontalement
    fadeAnimation: false, // Désactive l'animation de transition pour éviter les flashs
    maxBounds: [
      [-60, -180], // Sud-ouest
      [80, 180]    // Nord-est
    ],
    maxBoundsViscosity: 10,
    tilePadding: 1 // Augmente la taille du padding autour des tuiles
  });


L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png', {
  attribution: '&copy; OpenStreetMap contributors',
  tileSize: 256,
  keepBuffer: 8,
  updateWhenIdle: true,
  updateWhenZooming: true
}).addTo(map).on('tileloadstart', function (event) {
  setTimeout(function () {
    event.tile.style.opacity = 1;
  }, 50); // Délai de 50 ms pour le chargement des tuiles
});

// L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
//   attribution: '&copy; Esri, HERE, Garmin, FAO, NOAA, USGS, EPA',
//   keepBuffer: 4,
// }).addTo(map);


// L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
//   attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
//   tileSize: 256,
//   keepBuffer: 2,
//   updateWhenIdle: true,
//   updateWhenZooming: false,
// }).addTo(map);


// // Ajouter une couche de tuiles avec des améliorations anti-flash
// L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
//   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>',
//   tileSize: 256,
//   keepBuffer: 2,
//   updateWhenIdle: true,
//   updateWhenZooming: false,
// }).addTo(map);

// Ajouter un fond de carte sombre et minimaliste (CartoDB Dark Matter)
// L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://carto.com/attributions">CARTO</a>',
//     tileSize: 256,
//     zoom: 3,
//     maxZoom: 5,
//     minZoom: 3,
//     keepBuffer: 2,
//     updateWhenIdle: true,        // Recharge les tuiles seulement après déplacement
//     updateWhenZooming: false,    // Empêche le rechargement des tuiles pendant le zoom
//     maxBounds: [
//       [-80, -180], // Sud-ouest
//       [84, 180]    // Nord-est
//     ],
//   }).addTo(map);

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
            layer.on('mouseover', function() {
              const countryName = feature.properties.name;
              const info = countryData[countryName];

              let popupContent = `<h3>${countryName}</h3>`;
              if (info) {
                popupContent += `<span>Population: ${info.population}<br></span>`;
                popupContent += `<span>Superficie: ${info.area}</span>`;
              } else {
                popupContent += "<p>Données non disponibles</p>";
              }
              layer.bindPopup(popupContent).openPopup();
            });

            layer.on('mouseout', function () {
              layer.closePopup();
            });
          }
        }).addTo(map);
      })
      .catch(error => console.error('Erreur lors du chargement des données GeoJSON :', error));
  })
  .catch(error => console.error('Erreur lors du chargement des données des pays :', error));
