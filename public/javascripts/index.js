mapboxgl.accessToken = 'pk.eyJ1IjoiYWJvcnVjaG92YXMiLCJhIjoiY2p0bGt4ZXBuMjJnMDQ5bXhudDd5NWh5eCJ9.ccNP3Cgnb_uvymR_KGiSaw';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [-1.470085, 53.381129], // starting position [lng, lat]
  zoom: 14 // starting zoom
});

picnicSpots.forEach(spot => {
  var marker = new mapboxgl.Marker()
  .setLngLat(spot.location)
  .addTo(map);
});

// Add geolocate control to the map.
map.addControl(new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
}));