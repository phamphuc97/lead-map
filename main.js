import './style.css';
import {Map, View, Feature} from 'ol';
import TileLayer from 'ol/layer/Tile';
import {Point} from 'ol/geom';
import {Vector as vectorLayer} from 'ol/layer';
import {Vector as vectorSource} from 'ol/source';
import {Icon, Style} from 'ol/style';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

export { searchAddress, placeMarker };

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [10, 20],
    zoom: 3
  })
});

function placeMarker(coordinates) {
  // Remove existing marker layers if any
  map.getLayers().forEach(layer => {
    if (layer.get('name') === 'markerLayer') {
      map.removeLayer(layer);
    }
  });

  // Create a marker feature at the searched location
  var marker = new Feature({
    geometry: new Point(coordinates)
  });

  // Style the marker
  var markerStyle = new Style({
    image: new Icon({
      src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png', // Path to the marker icon
      anchor: [0.5, 1], // Position the anchor point of the icon
    }),
  });
  marker.setStyle(markerStyle);

  // Create a vector layer to hold the marker
  var markerLayer = new vectorLayer({
    name: 'markerLayer', // Add a name to identify the layer
    source: new vectorSource({
      features: [marker],
    }),
  });

  // Add the marker to the map
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

          // Mark the position of the coordinates on the map
          placeMarker(coordinates);

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