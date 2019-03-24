mapboxgl.accessToken = 'pk.eyJ1IjoiYWJvcnVjaG92YXMiLCJhIjoiY2p0bGt4ZXBuMjJnMDQ5bXhudDd5NWh5eCJ9.ccNP3Cgnb_uvymR_KGiSaw';
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
  center: [0, 0],
  zoom: 5 // starting zoom
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

picnicSpots.forEach((spot, index) => {
  var marker = new mapboxgl.Marker({ color: '#2e9b63' })
  .setLngLat(spot.location)
  .addTo(map);

  var popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(
      `<h1 style="margin: 8px; font-size:1em;">
        ${drawStars(averageRating(spot.reviews))}
        <br><br>
        ${spot.reviews.length} review(s)
      </h1>
      <button type="button" class="btn btn-secondary" data-toggle="modal" data-spot="${index}" data-target="#spot-modal">View spot</button>`
  );
  
  // create DOM element for the marker
  var el = document.createElement('div');
  el.id = 'marker';
  
  // create the marker
  new mapboxgl.Marker(el)
    .setLngLat(spot.location)
    .setPopup(popup) // sets a popup on this marker
    .addTo(map);
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

var spotCoords;
var spotID;
setTimeout(function() {
  $('#spot-modal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var spotIndex = button.data('spot') // Extract info from data-* attributes
    var modal = $(this)
    var spot = picnicSpots[spotIndex];
    spotCoords = spot.location;
    spotID = spot.id;
    modal.find('.modal-title').text(drawStars(averageRating(spot.reviews)));
    var reviews = '';
    spot.reviews.forEach(review => {
      reviews += `<li class="list-group-item">
        <span class="float-right">${drawStars(review.rating)}</span>
        <h5>${review.user}</h5>
        <p>${review.review}</p>
      </li>\n`
    })
    modal.find('.modal-body').html(`
      <ul class="list-group list-group-flush">
        ${reviews}
      </ul>
    `)
  })
}, 500);

function selectSpot()  {
  // var coords = draggableMarker.getLngLat();
  document.getElementById('map-wrapper').style.display = 'none';
  document.getElementById('form-wrapper').style.display = 'block';
  document.getElementById('spotID').value = spotID;
}

function averageRating(array) {
  return Math.round(array.reduce((total, elem) => total + elem.rating, 0) / array.length);
}

function drawStars(numStars) {
  numStars = parseInt(numStars);
  return  '★'.repeat(numStars) + '☆'.repeat((5-numStars));
}