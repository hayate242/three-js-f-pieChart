
function initMap() {
  var mapPosition = {lat: 35.170662, lng: 136.923430}
  var mapArea = document.getElementById('maps');
  var mapOptions = {
    center: mapPosition,
    zoom: 16,
  };
  var map = new google.maps.Map(mapArea, mapOptions);
}
