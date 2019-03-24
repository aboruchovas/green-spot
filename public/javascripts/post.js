mapboxgl.accessToken = 'pk.eyJ1IjoiYWJvcnVjaG92YXMiLCJhIjoiY2p0bGt4ZXBuMjJnMDQ5bXhudDd5NWh5eCJ9.ccNP3Cgnb_uvymR_KGiSaw';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [0, 0],
  zoom: 2 // starting zoom
});

map.on('load', function() {
  // Insert the layer beneath any symbol layer.
  var layers = map.getStyle().layers;
   
  var labelLayerId;
  for (var i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
      labelLayerId = layers[i].id;
      break;
    }
  }
   
  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',
      
      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "height"]
      ],
      'fill-extrusion-base': [
        "interpolate", ["linear"], ["zoom"],
        15, 0,
        15.05, ["get", "min_height"]
      ],
      'fill-extrusion-opacity': .6
    }
  }, labelLayerId);
});

map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken }));

map.addControl(new mapboxgl.NavigationControl());

var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
})

map.addControl(geolocate);

setTimeout(function() {
  geolocate.trigger();
}, 0);

picnicSpots.forEach(spot => {
  var marker = new mapboxgl.Marker({ color: '#2e9b63' })
  .setLngLat(spot.location)
  .addTo(map);
  
  // create DOM element for the marker
  var el = document.createElement('div');
  el.id = 'marker';
  
  // create the marker
  new mapboxgl.Marker(el)
    .setLngLat(spot.location)
    .addTo(map);
});

var draggableMarker = new mapboxgl.Marker({
  draggable: true
}).setLngLat([0, 0]).addTo(map);

geolocate.on('geolocate', function(position) {
  draggableMarker.setLngLat([position.coords.longitude, position.coords.latitude]);
});

function selectSpot()  {
  var coords = draggableMarker.getLngLat();
  document.getElementById('map-wrapper').style.display = 'none';
  document.getElementById('form-wrapper').style.display = 'block';
  document.getElementById('longitude').value = coords.lng.toFixed(7);
  document.getElementById('latitude').value = coords.lat.toFixed(7);
}