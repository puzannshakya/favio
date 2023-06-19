/**
 * read the current geolocation position & handling
it, when it fails. 
*/
if ( navigator.geolocation ) {
navigator.geolocation.getCurrentPosition(
( position ) => { // success callback is passed a GeoLocationPosition
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
console.log( "latitude = " + latitude );
console.log( "longitude = " + longitude );
// Make a request to the Google Maps Geocoding API
const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDFyOKnoicCueguKZctIMwiDDD-bZ35VMA`;

  
fetch(geocodingUrl)
  .then(response => response.json())
  .then(data => {
    if (data.status === 'OK') {
      const formattedAddress = data.results[0].formatted_address;
        //Putting the formatted address in the input text box of origin
        from.value = formattedAddress;
      console.log('Formatted Address:', formattedAddress);
    } else {
      console.log('Geocoding API request failed.');
    }
  })
  .catch(error => {
    console.log('Error:', error);
  });




},
( error ) => { // failure callback is passed an error object
console.log( error );
if ( error.code == error.PERMISSION_DENIED ) {
window.alert( "geolocation permission denied" );
}
});
} else { // no geolocation in navigator. in case running in an old browser
console.log( "Geolocation is not supported by this browser." );
}



var myLatLng = { lat: 49.2820, lng: -123.1171 };
var mapOptions = {
    center: myLatLng,
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapId: '8ee82cfaab8ad410'

};

//create map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);


//define calcRoute function
function calcRoute() {
    alert("hello");
    //create request
    var request = {
        origin: document.getElementById("from").value,
        destination: document.getElementById("to").value,
        travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    //pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            // //Get distance and time
            // const output = document.querySelector('#output');
            // output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            // output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });

}



//create autocomplete objects for all inputs
// var options = {
//     types: ['(cities)']
// }

// var options = {
//     types: ["address"]
// }

var options = {
    types: []
}

var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);


var products = document.getElementsByClassName('pac-item');

alert(products[0].value);

products[0].addEventListener('click', async (e) => {
    e.preventDefault();
alert("hello");

});