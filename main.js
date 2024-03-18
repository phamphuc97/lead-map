import './style.css';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

export { searchAddress, highlightBoundary };

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 5
  })
});

function highlightBoundary(coordinates) {
  // Remove existing marker layers if any
  map.getLayers().forEach(layer => {
    if (layer.get('name') === 'markerLayer') {
      map.removeLayer(layer);
    }
  });

  // Create a marker feature at the searched location
  var marker = new ol.Feature({
    geometry: new ol.geom.Point(coordinates)
  });

  // Style the marker
  var markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: '3d-pin.jpeg', // Path to the marker icon
      anchor: [0.5, 1], // Position the anchor point of the icon
    }),
  });
  marker.setStyle(markerStyle);

  // Create a vector layer to hold the marker
  var markerLayer = new ol.layer.Vector({
    name: 'markerLayer', // Add a name to identify the layer
    source: new ol.source.Vector({
      features: [marker],
    }),
  });

  // Add the vector layer (marker) to the map
  map.addLayer(markerLayer);
}

function searchAddress() {

  var address = document.getElementById('address-input').value;
  var url = 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(address) + '&format=json';

  fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.length > 0) {
          var lon = parseFloat(data[0].lon);
          var lat = parseFloat(data[0].lat);
          var coordinates = fromLonLat([lon, lat]);
          map.getView().setCenter(coordinates);
          map.getView().setZoom(12);

          // Highlight the boundary
          highlightBoundary(coordinates);
        } else {
          alert('Address not found!');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while searching for the address.');
      });
}

document.getElementById('search-button').addEventListener('click', searchAddress);