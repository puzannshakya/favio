let uid = (sessionStorage.getItem("uid"));
let user_name;
if(uid == null){
  uid = 'jIqGYzdFTxUz5IVrFPGo';
}

getUserData();

async function getUserData(){
  //delete this after testing

      
   let docData =  await firebase.firestore().collection("users_tests").doc(uid).get();
    if(docData.exists){
      user_name = docData.data().user_name;
      console.log(user_name);
    }
    else{
      console.log("No Such document");
    }
  
 
}


/****** Loading Map Part and origin and destination */

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


/****** Ending of Loading Map Part and origin and destination */


/****************** Loading Courier Options *************/
var db = firebase.firestore();

db.collection("courier-option").get().then(function(query) {
    var data = [];
    query.forEach(function(doc) {
        
        console.log(doc);
        console.log(doc.data());
        console.log(doc.data()['courier-options-name']);

        data.push(doc.data());
    });
    generateContent(data);
}).catch(function(error) {
    console.log("Error getting documents: ", error);
});

function selectObject(array, propertyName, value) {
    return array.find(function(object) {
      return object[propertyName] === value;
    });
}

function generateContent(data) {
    const option_name_from_db =  ['Walk', 'Bikes or Scooters', 'Cars', 'Transit'];
    const option_img_name =  ['walk', 'bike', 'car', 'transportation'];

    const courier_option = document.getElementById('courier-option');
    // subject
    const courier_option_head = document.createElement("h2");
    courier_option_head.textContent = "Courier Options";
    courier_option.appendChild(courier_option_head);

    option_name_from_db.forEach((option, index) => {
        const courier_item = selectObject(data, 'courier-options-name', option);
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="form-courier-options">
                <div class="options">
                    <a href="#">
                        <div class="courier-icon" >
                            <img src="./../../img/${option_img_name[index]}.svg" alt="${option}-img">
                        </div>
                        <div class="form-option">
                            <h3>${option}</h3>
                            <div class="courier-info">
                                <p>0kg - ${courier_item['weight-limit']}kg <br> ${courier_item['size-limit']} X ${courier_item['size-limit']} X ${courier_item['size-limit']} Centimeters</p>
                                <p>Cheapest and most sustainable delivery option: earn points every time you
                                    use sustainable delivery
                                <p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        `;
        courier_option.appendChild(div); 
});
}



/****************** Ending of Loading Courier Options *************/




/******************** Saving the Delivery Request to Db **********/



async function saveDeliveryRequest(){
 let originInput = from.value;
 let destinationInput= to.value;
 let originLatitude;
 let originLongitude;
 let destinationLatitude;
 let destinationLongitude;
 console.log(`originInput:${originInput}`);
 console.log(`destinationInput:${destinationInput}`);

 const docRef = firebase.firestore().collection("delivery_request_tests").doc();
    await docRef.set({
      deliveryRequestId: docRef.id,
      userId: uid,
      delivery_requested_by : user_name,
      origin_name : originInput,
      destination_name : destinationInput,


    });


 // Make a request to the Google Maps Geocoding API
const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(originInput)}&key=YOUR_API_KEY`;

fetch(geocodingUrl)
  .then(response => response.json())
  .then(data => {
    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      originLatitude = location.lat;
      originLongitude = location.lng;
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      
    } else {
      console.log('Geocoding API request failed.');
    }
  })
  .catch(error => {
    console.log('Error:', error);
  });
}

