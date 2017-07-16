//==========================   DATABASE   ==========================//
var config = {
  apiKey: "AIzaSyCPeD_m4M-00LiLAVvRE7Gzdizim2qDD4A",
  authDomain: "anaproject-4cb91.firebaseapp.com",
  databaseURL: "https://anaproject-4cb91.firebaseio.com",
  projectId: "anaproject-4cb91",
  storageBucket: "anaproject-4cb91.appspot.com",
  messagingSenderId: "78796771551"
};
firebase.initializeApp(config);
var database = firebase.database();

var displayName;
$("#signup").on("click", function() {
  displayName = $("#name").val();
  var email = $("#email").val();
  var password = $("#password").val();
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function(user) {
      user.updateProfile({
        displayName: displayName
      });
      console.log(user);
    }).
  catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
});

$("#signIn").on("click", function() {
  //var displayName=document.querySelector("#name");
  var email = $("#email").val();
  var password = $("#password").val();
  firebase.auth().signInWithEmailAndPassword(email, password).
  catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });

});





//==========================   VARIABLES   ==========================//
//------------------   Google Geolocation Variables   ------------------//
var map;
var infoWindow;
var marker;
var service;


//------------------   Google Autocomplete Variables   ------------------//
var rating;
var restaurantName;
var streetNum;
var newArray;
var latestDate;
var inspection_date;
var score;
var addressTry;












//=======================   EVENTS   =======================//

//--------------   Plots map on page load   --------------
// function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: {
//       lat: 30.2747,
//       lng: -97.7405
//     },
//     zoom: 14
//   });
// }


//--------------   Current Location and Surrounding Restaurants on button click  --------------
$("#current-location").on("click",
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 30.2747,
        lng: -97.7405
      },
      zoom: 14
    });

    //--------------   My location   --------------
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        marker = new google.maps.Marker({
          position: pos,
          map: map,
          title: 'You are here'
        });

        // infoWindow.setPosition(pos);
        // infoWindow.setContent('Location found.');
        // infoWindow.open(map);
        map.setCenter(pos);

        //--------------   Plot nearby restaurants   --------------
        service = new google.maps.places.PlacesService(map);

        service.nearbySearch({
            location: pos,
            radius: 1000,
            type: ['restaurant']
          }, callback);

        //--------------   Handle errors   --------------
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  }
);




//=======================   FUNCTIONS  =======================//

//--------------   Handling broswer error for Geolocation   --------------
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

//--------------   Callback for plotting nearby restuarants   --------------
function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

//--------------   Plotting markers for nearby restuarants   --------------
function createMarker(place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent(place.name);
    infoWindow.open(map, this);
  });
}






//=======================   GOOGLE AUTOCOMPLETE API  =======================//
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 30.2747,
      lng: -97.7405
    },
    zoom: 14
  });

  // var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  // var types = document.getElementById('type-selector');
  // var strictBounds = document.getElementById('strict-bounds-selector');

  // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

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

    $("#map").css({
      "width": "50%"
    });


       $("#map").css({ "width": "50%"});


    $(".gScore").show();
    $(".aRating").show();
    $(".googleScore").show();
    $(".healthRating").show();




    //*******Grabbing the restaurant name from google api object
    restaurantName = place.name;
    //*******Grabbing the rating from google api object
    rating = place.rating;


    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    }).done(function(data) { 
    /*** Empty the array****/      
   newArray=[];
   // if the object is not null
    if(data.length>0)
    {
      for(var i = 0; i < data.length; i++)
      {
      // addressTry is grabbing the address from the austin 311 api  
      addressTry= data[i].address_address.substring(0, data[i].address_address.indexOf(" "));//+","+" "+data[i].address_city+","+" "+data[i].address_state+" "+data[i].address_zip+","+" "+"USA";      
      //console.log(addressTry);
      
      //Checking two addresses from google api and austin 311 api are matching or not
      if(addressTry===streetNum){ 

          //grab all the inspection dates of the restaurant and push it into an array        
          newArray.push(new Date(data[i].inspection_date));

          //Get the latestDate among the inspection dates
          latestDate = new Date(Math.max.apply(null, newArray));        
          var inspectionDate=moment(latestDate).format("MMMM Do YYYY, h:mm:ss a")
          status=true;
          $("#map").css({ "width": "50%"});
        }      
           
     } 
    if(status==false)
    {

       //alert("No matching restaurant details in the Austin 311");
       //Added Error messages
       $(".restaurantName").html("No matching data for the restaurant");
       $(".googleScore").html(""); 
       $(".inspectDate").html(""); 
       $(".healthRating").html(""); 

    $(".gScore").hide();
    $(".aRating").hide();
    $(".googleScore").hide();
    $(".healthRating").hide();

      // $("#map").css({ "width": "100%"});
      //alert("No matching restaurant details in the Austin 311");


    // Clearing the seach box input after each search
    $("#pac-input").val("");
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

     //Looping through the data of Austin api to get the the details of the restaurant         
    
   for(var i = 0; i < data.length; i++)
   {
        addressTry= data[i].address_address.substring(0, data[i].address_address.indexOf(" "));//data[i].address_address+","+" "+data[i].address_city+","+" "+data[i].address_state+" "+data[i].address_zip+","+" "+"USA";         
        var newDatedate=new Date(data[i].inspection_date);        
     if((addressTry===streetNum)&&(newDatedate.valueOf()==latestDate.valueOf())){
         console.log("Here is our Matching restaurant and its score of latest inspection date");
         console.log("good");
         console.log(data[i].restaurant_name);
         console.log(data[i].score);
         console.log(inspectionDate);
         console.log(rating);        

      
      $(".restaurantName").html(data[i].restaurant_name);  
      $(".googleScore").html(rating) 
      $(".inspectDate").html("Inspection Date: " + inspectionDate); 
      $(".healthRating").html(data[i].score);  

      $(".gScore").text("Google User Rating");
      $(".aRating").text("Health Inspector Rating");


      /**** Display the restaurant_name,score,rating,inspection date in the out html page***/ 
      }
      else{
        console.log("no");
      }
    }

  }
  else{
      //alert("no matching data found");
      //Added error messages
       $(".restaurantName").html("Please search with a proper restaurant name");
      $(".googleScore").html(""); 
      $(".inspectDate").html(""); 
      $(".healthRating").html(""); 

    $(".gScore").hide();
    $(".aRating").hide();
    $(".googleScore").hide();
    $(".healthRating").hide();

    } 



}) ; 


      ].join(' ');
    }

    // Grabbing the street Number from the google api
    streetNum = place.address_components[0] && place.address_components[0].short_name;
    console.log(place);
    console.log(streetNum);

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    //PLACE.NAME is where the string place name is stored
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);









    //=======================   AUSTIN311 API  =======================//

    var status = false;

    $.ajax({
      url: "https://data.austintexas.gov/resource/nguv-n54k.json?restaurant_name=" + restaurantName,

      type: "GET",
      data: {
        "$$app_token": "0Es7kBaUTwfCUw1s8Z9vBuapF"
      }
    }).done(function(data) {
      /*** Empty the array****/
      newArray = [];
      // if the object is not null
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          // addressTry is grabbing the address from the austin 311 api
          addressTry = data[i].address_address.substring(0, data[i].address_address.indexOf(" ")); //+","+" "+data[i].address_city+","+" "+data[i].address_state+" "+data[i].address_zip+","+" "+"USA";
          //console.log(addressTry);

          //Checking two addresses from google api and austin 311 api are matching or not
          if (addressTry === streetNum) {

            //grab all the inspection dates of the restaurant and push it into an array
            newArray.push(new Date(data[i].inspection_date));

            //Get the latestDate among the inspection dates
            latestDate = new Date(Math.max.apply(null, newArray));
            var inspectionDate = moment(latestDate).format("MMMM Do YYYY, h:mm:ss a")
            status = true;
            $("#map").css({
              "width": "50%"
            });
          }

        }
        if (status == false) {

          //alert("No matching restaurant details in the Austin 311");
          //Added Error messages
          $(".restaurantName").html("No matching data for the restaurant");
          $(".googleScore").html("");
          $(".inspectDate").html("");
          $(".healthRating").html("");

          $(".gScore").hide();
          $(".aRating").hide();
          $(".googleScore").hide();
          $(".healthRating").hide();

          //$("#map").css({ "width": "100%"});
          //alert("No matching restaurant details in the Austin 311");

        }
        //Looping through the data of Austin api to get the the details of the restaurant

        for (var i = 0; i < data.length; i++) {
          addressTry = data[i].address_address.substring(0, data[i].address_address.indexOf(" ")); //data[i].address_address+","+" "+data[i].address_city+","+" "+data[i].address_state+" "+data[i].address_zip+","+" "+"USA";
          var newDatedate = new Date(data[i].inspection_date);
          if ((addressTry === streetNum) && (newDatedate.valueOf() == latestDate.valueOf())) {
            console.log("Here is our Matching restaurant and its score of latest inspection date");
            console.log("good");
            console.log(data[i].restaurant_name);
            console.log(data[i].score);
            console.log(inspectionDate);
            console.log(rating);


            // $(".restaurantName").html(data[i].restaurant_name);
            // $(".googleScore").html("Google User Rating: " + rating)
            // $(".inspectDate").html("Inspection Date: " + inspectionDate);
            // $(".healthRating").html("Health Inspector Rating: " + data[i].score);

            $(".restaurantName").html(data[i].restaurant_name);
            $(".googleScore").html(rating);
            $(".inspectDate").html("Inspection Date: " + inspectionDate);
            $(".healthRating").html(data[i].score);

            $(".gScore").html("Google User Rating");
            $(".aRating").html("Health Inspector Rating");


            /**** Display the restaurant_name,score,rating,inspection date in the out html page***/
          } else {
            console.log("no");
          }
        }

      } else {
        //alert("no matching data found");
        //Added error messages
        $(".restaurantName").html("Please search with a proper restaurant name");
        $(".googleScore").html("");
        $(".inspectDate").html("");
        $(".healthRating").html("");

        $(".gScore").hide();
        $(".aRating").hide();
        $(".googleScore").hide();
        $(".healthRating").hide();
      }

    });

  });

}





//=======================   END  =======================//
