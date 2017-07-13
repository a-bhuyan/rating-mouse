
//==========================   DATABASE   ==========================//






//==========================   VARIABLES   ==========================//
//------------------   Google Geolocation Variables   ------------------//
var map;
var infoWindow;
var marker;

var latVar = 30.2747;
var lngVar = -97.7405;

var zoomVar = 14;

var mapTypeIdVar = "roadmap";

var targetLocation = {lat: latVar, lng: lngVar};


//------------------   Google Autocomplete Variables   ------------------//







//=======================   EVENTS   =======================//











//=======================   FUNCTIONS  =======================//
//------------------   Google Map Functions   ------------------//
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: targetLocation,
    zoom: zoomVar,
    mapTypeId: mapTypeIdVar
  });


// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(browserHasGeolocation ?
//     'Error: The Geolocation service failed.' :
//     'Error: Your browser doesn\'t support geolocation.');
//
//   infoWindow.open(map);
// }


function setNewMarker () {
  marker = new google.maps.Marker({
    position: targetLocation,
    map: map
  });
}

//=======================   MAIN  =======================//

  //-----------------   HTML5 Geolocation (User's Location)   -----------------//
//   infoWindow = new google.maps.InfoWindow();
//
//   if(navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       var pos = {
//         lat: position.coords.latitude,
//         lng: position.coords.longitude
//       };
//
//       latVar = position.coords.latitude;
//       lngVar = position.coords.longitude;
//
//
//       infoWindow.setPosition(pos);
//       infoWindow.setContent("Location found.");
//       infoWindow.open(map);
//       map.setCenter(pos);
//
//       // setNewMarker();
//
//     }, function() {
//       handleLocationError(true, infoWindow, map.getCenter());
//     });
//   } else {
//     handleLocationError(false, infoWindow, map.getCenter());
//   }
// }









//==========================   GOOGLE SEARCH AND MAP API   ==========================//
  // This example requires the Places library. Include the libraries=places
  // parameter when you first load the API. For example:
  // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

  // function initMap() {
  //   var map = new google.maps.Map(document.getElementById('map'), {
  //     //sets the starting location
  //     center: {
  //       lat: 30.2672,
  //       lng: -97.7431
  //     },
  //     zoom: 13
  //   });
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      //PLACE.NAME is where the string place name is stored
      console.log(place.name);
      infowindowContent.children['place-address'].textContent = address;
      console.log(address);
      infowindow.open(map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      var radioButton = document.getElementById(id);
      radioButton.addEventListener('click', function() {
        autocomplete.setTypes(types);
      });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

    document.getElementById('use-strict-bounds')
      .addEventListener('click', function() {
        console.log('Checkbox clicked! New state=' + this.checked);
        autocomplete.setOptions({
          strictBounds: this.checked
        });
      });
  }



  //==========================   AUSTIN311 API   ==========================//








  //==========================   MAIN   ==========================//















  //==========================   END   ==========================//
