let userDocId = (sessionStorage.getItem("userDocId"));
let user_name;
let delivery_estimated_time;
let delivery_total_fee;
let delivery_distance;
var bookingFee = 2;
var minimumFare = 5;
var intervalId;
let requestDocumentRef;

console.log(userDocId);

if (userDocId == null) {
  userDocId = 'jIqGYzdFTxUz5IVrFPGo';
}
let selectedVehicle = "Car";


// selectedVehicleRadio.checked = true;

getUserData();

async function getUserData() {
  //delete this after testing

  console.log(userDocId);
  let docData = await firebase.firestore().collection("users_tests").doc(userDocId).get();
  if (docData.exists) {
    user_name = docData.data().user_name;
    console.log(user_name);
  }
  else {
    console.log("No Such document");
  }


}


/****** Loading Map Part and origin and destination */

/**
 * read the current geolocation position & handling
it, when it fails. 
*/
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => { // success callback is passed a GeoLocationPosition
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      console.log("latitude = " + latitude);
      console.log("longitude = " + longitude);
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
    (error) => { // failure callback is passed an error object
      console.log(error);
      if (error.code == error.PERMISSION_DENIED) {
        window.alert("geolocation permission denied");
      }
    });
} else { // no geolocation in navigator. in case running in an old browser
  console.log("Geolocation is not supported by this browser.");
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
  const checkedVechicleRadio = document.querySelector('input[name="courier-option-radio"]:checked');
  console.log(checkedVechicleRadio.value);
  let travelMode = google.maps.TravelMode.DRIVING;

  switch (checkedVechicleRadio.value) {
    case "Walk":
      alert("walk selected");
      travelMode = google.maps.TravelMode.WALKING;
      break;

    case "Bikes or Scooters":
      alert("Bikes or Scooters selected");
      travelMode = google.maps.TravelMode.TWO_WHEELER;
      break;

    case "Cars":
      alert("Cars selected");
      travelMode = google.maps.TravelMode.DRIVING;
      break;

    case "Transit":
      alert("Transit selected");
      travelMode = google.maps.TravelMode.TRANSIT;
      break;
  }
  console.log(travelMode);
  var request = {
    origin: document.getElementById("from").value,
    destination: document.getElementById("to").value,
    travelMode: travelMode, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC
  }

  console.log(request);

  //pass the request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {


      // //Get distance and time
      // const output = document.querySelector('#output');
      // output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

      //display route
      delivery_distance = result.routes[0].legs[0].distance.text;
      delivery_estimated_time = result.routes[0].legs[0].duration.text;
      estimatedDistance.innerHTML = delivery_distance;
      estimatedTime.innerHTML = delivery_estimated_time;
      const price = calculatePayment(request.travelMode, delivery_distance, delivery_estimated_time);

      if (price.totalPrice < 10) {
        price.totalPrice = price.totalPrice + minimumFare;
        delivery_total_fee = price.totalPrice;
        estimatedTotal.innerHTML = `${price.totalPrice}
              
              <ul class="FavioPriceUl"> <li> Base Price       ${price.basePrice} </li>
                                              <li>Minimum Fare       ${minimumFare}</li>
                                              <li>+ per Km            ${price.distanceMultiplier}</li>
                                              <li>+ per min           ${price.timeMultiplier}</li>
                                              <li> Booking Fee        ${bookingFee}</li> 
                                              </ul>`
      }
      else {
        delivery_total_fee = price.totalPrice;
        estimatedTotal.innerHTML = `${price.totalPrice}
              
              <ul class="FavioPriceUl"> <li> Base Price       ${price.basePrice} </li>
                                              <li>+ per Km            ${price.distanceMultiplier}</li>
                                              <li>+ per min           ${price.timeMultiplier}</li>
                                              <li> Booking Fee        ${bookingFee}</li> 
                                              </ul>`

      }



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

db.collection("courier-option").get().then(function (query) {
  var data = [];
  query.forEach(function (doc) {

    console.log(doc);
    console.log(doc.data());
    console.log(doc.data()['courier-options-name']);

    data.push(doc.data());
  });
  generateContent(data);

  let radioCars = document.getElementById('radioCars');
  radioCars.checked = true;


}).catch(function (error) {
  console.log("Error getting documents: ", error);
});

function selectObject(array, propertyName, value) {
  return array.find(function (object) {
    return object[propertyName] === value;
  });
}


function generateContent(data) {
  // const option_name_from_db = ['Walk', 'Bikes or Scooters', 'Cars', 'Transit'];
  // const option_img_name = ['walk', 'bike', 'car', 'transportation'];

  const option_name_from_db = ['Bikes or Scooters', 'Cars', 'Transit'];
  const option_img_name = ['bike', 'car', 'transportation'];

  const courier_option = document.getElementById('courier-option');
  const courier_option_head = document.createElement("h2");
  courier_option_head.textContent = "Courier Options";
  courier_option.insertBefore(courier_option_head, courier_option.firstChild);
  const courier_form = document.createElement("form");
  courier_option.appendChild(courier_form);

  option_name_from_db.forEach((option, index) => {
    const courier_item = selectObject(data, 'courier-options-name', option);

    const radioContainer = document.createElement("div");
    radioContainer.classList.add("form-courier-options");
    courier_form.appendChild(radioContainer);

    const radioInput = document.createElement("input");
    radioInput.type = "radio";
    radioInput.id = `radio${option}`;
    radioInput.name = "courier-option-radio";
    radioInput.talk = "courier-option-radio";
    radioInput.onchange = calcRoute;
    radioInput.value = option;
    radioContainer.appendChild(radioInput);

    const radioLabel = document.createElement("label");
    radioLabel.htmlFor = `radio${option}`;
    radioLabel.textContent = option;
    radioContainer.appendChild(radioLabel);

    const courierIcon = document.createElement("div");
    courierIcon.classList.add("courier-icon");
    radioContainer.appendChild(courierIcon);

    const courierIconImg = document.createElement("img");
    courierIconImg.src = `./../../img/${option_img_name[index]}.svg`;
    courierIconImg.alt = `${option}-img`;
    courierIcon.appendChild(courierIconImg);

    const courierInfo = document.createElement("div");
    courierInfo.classList.add("form-option");
    radioContainer.appendChild(courierInfo);

    const courierInfoText = document.createElement("div");
    courierInfoText.classList.add("courier-info");
    courierInfo.appendChild(courierInfoText);

    const weightSizeLimits = document.createElement("p");
    weightSizeLimits.innerHTML = `0kg - ${courier_item['weight-limit']}kg <br> ${courier_item['size-limit']} X ${courier_item['size-limit']} X ${courier_item['size-limit']} Centimeters`;
    courierInfoText.appendChild(weightSizeLimits);

    const description = document.createElement("p");
    description.textContent = "Cheapest and most sustainable delivery option: earn points every time you use sustainable delivery.";
    courierInfoText.appendChild(description);
  });
  // const submitButton = document.createElement("button");
  // submitButton.type = "submit";
  // submitButton.id = "submit-courier";
  // submitButton.textContent = "Select courier";
  // courier_form.appendChild(submitButton);
}
/****************** Ending of Loading Courier Options *************/



/******************** Saving the Delivery Request to Db **********/



async function saveDeliveryRequest() {
  alert("saveDeliveryRequest");
  let originInput = from.value;
  let destinationInput = to.value;
  let originLatitude;
  let originLongitude;
  let destinationLatitude;
  let destinationLongitude;
  const checkedVechicleRadio = document.querySelector('input[name="courier-option-radio"]:checked');
  console.log(`originInput:${originInput}`);
  console.log(`destinationInput:${destinationInput}`);
  deliveryInfo= storeDateTimeAndDropoffOption();
  requestDocumentRef = firebase.firestore().collection("delivery_request_tests").doc();
  await requestDocumentRef.set({
    deliveryRequestId: requestDocumentRef.id,
    seekerDocId: userDocId,
    delivery_requested_by: user_name,
    origin_name: originInput,
    destination_name: destinationInput,
    selected_courier_options: checkedVechicleRadio.value,
    scheduled_delivery_datetime: deliveryInfo.dateTime,
    selected_drop_off_option: deliveryInfo.dropoffOption,
    notes: deliveryInfo.notes,
    delivery_distance: delivery_distance,
    delivery_estimated_time: delivery_estimated_time,
    delivery_total_fee : delivery_total_fee,
    delivery_picked_up_flag: false,
    delivery_completed_flag:false,
    delivery_confirmation_flag:false,
    delivery_inprogress_flag:false,
    delivery_completed_image_confirmation_flag:false,
    delivery_completed_confirmation_flag: false,
    created_at: new Date().toISOString(),


  });


  // Make a request to the Google Maps Geocoding API for Origin
  const geocodingUrlOrigin = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(originInput)}&key=AIzaSyDFyOKnoicCueguKZctIMwiDDD-bZ35VMA`;

  fetch(geocodingUrlOrigin)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        originLatitude = location.lat;
        originLongitude = location.lng;
        console.log('Latitude:', originLatitude);
        console.log('Longitude:', originLongitude);
        requestDocumentRef.update({
          origin_geolocation: new firebase.firestore.GeoPoint(originLatitude, originLongitude)


        });


      } else {
        console.log('Geocoding API request failed.');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });

  // Make a request to the Google Maps Geocoding API for Origin
  const geocodingUrlDestination = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destinationInput)}&key=AIzaSyDFyOKnoicCueguKZctIMwiDDD-bZ35VMA`;

  fetch(geocodingUrlOrigin)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        destinationLatitude = location.lat;
        destinationLongitude = location.lng;
        console.log('Latitude:', destinationLatitude);
        console.log('Longitude:', destinationLongitude);
        requestDocumentRef.update({
          destination_geolocation: new firebase.firestore.GeoPoint(destinationLatitude, destinationLongitude)
           

        });

        setIntervalForConfirmationDialog();




      } else {
        console.log('Geocoding API request failed.');
      }
      alert("Request Created");
    })
    .catch(error => {
      console.log('Error:', error);
    });
}


function calculatePayment(travelMode, distance, time) {
  let distanceMultiplier, timeMultiplier, basePrice;

  switch (travelMode) {
    case "DRIVING":
      distanceMultiplier = 0.20;
      timeMultiplier = 0.08;
      basePrice = 5;
      break;
    case "TRANSIT":
      distanceMultiplier = 0.50;
      timeMultiplier = 0.10;
      basePrice = 4;
      break;
    case "TWO_WHEELER":
      distanceMultiplier = 0.25;
      timeMultiplier = 0.05;
      basePrice = 2;
      break;
    default:
      console.log("error");
      return null; // Or any other suitable error handling mechanism
  }

  const distancePrice = calculateDistancePrice(distance, distanceMultiplier);
  const timePrice = calculateTimePrice(time, timeMultiplier);
  const totalPrice = calculateTotalPrice(distancePrice, timePrice, basePrice, this.bookingFee);

  return {
    distanceMultiplier: distanceMultiplier,
    timeMultiplier: timeMultiplier,
    distancePrice: distancePrice,
    timePrice: timePrice,
    totalPrice: totalPrice,
    basePrice: basePrice
  };


}
function calculateDistancePrice(distance, distanceMultiplier) {
  const distanceFloat = parseFloat(distance) * 1.60934;
  return distanceMultiplier * distanceFloat;
}

function calculateTimePrice(time, timeMultiplier) {
  const timeFloat = parseFloat(time);
  return timeMultiplier * timeFloat;
}

function calculateTotalPrice(distancePrice, timePrice, basePrice, bookingFee) {
  return basePrice + distancePrice + timePrice + bookingFee;
}


function setIntervalForConfirmationDialog(){
  intervalId = setInterval(() => {
    showConfirmationDialog();
  }, 8000);
}

async function showConfirmationDialog(){
  console.log("Confirmation Dialog");

  await firebase.firestore().collection("delivery_request_tests").doc(requestDocumentRef.id).get().then(doc =>{
    if(doc.data().delivery_picked_up_flag == true){
      console.log("true");
      clearInterval(intervalId);
      const dialogElement = dialogData(doc.data());
      document.body.appendChild(dialogElement);
      showDialog(dialogElement, doc.data(), userDocId); 
    }else{
      console.log("false");
      // clearInterval(intervalId);
      // const dialogElement = dialogData(doc.data());
      // document.body.appendChild(dialogElement);
      // showDialog(dialogElement, doc.data(), userDocId); 
    }
  })
}


function dialogData(data) {
// Code that relies on the data goes here
console.log(data);


const dialog = document.createElement("dialog");
dialog.setAttribute('class', "modal");
dialog.id = "modal";

let requestDt = new Date(data.created_at);

const dialogContent = document.createElement("div"); 
dialogContent.setAttribute('class', "dialogContent"); 
dialogContent.innerHTML = `
    <img class="dialog-img" style="width:50px; height:50px;" src="./../../img/bike.svg">
    <p>Your Favio rider is : ${data.delivery_picked_up_by}</p>
    
    `;
dialog.appendChild(dialogContent);

const dialogButtonConfirm = document.createElement("button");
dialogButtonConfirm.textContent = "Confirm";
dialogButtonConfirm.id = "dialogButtonConfirmId";
dialogButtonConfirm.setAttribute('class', "dialogConfirm");
dialog.appendChild(dialogButtonConfirm);


const dialogButtonClose = document.createElement("button");
dialogButtonClose.textContent = "Cancel";
dialogButtonClose.id = "dialogButtonCloseId";
dialogButtonClose.setAttribute('class', "dialogClose");
dialog.appendChild(dialogButtonClose);
return dialog;
}

// Function to handle the dialog actions
function showDialog(dialogElement, clickedData, userDocId) {
dialogElement.showModal();

const closeModal = dialogElement.querySelector(".dialogClose");
closeModal.addEventListener("click", function (event) {
  dialogElement.close();
});

// Close dialog when clicking outside
window.addEventListener("click", function (event) {
  if (event.target === dialogElement) {
    dialogElement.close();
  }
});

// Update data on button click
const confirmButton = dialogElement.querySelector("#dialogButtonConfirmId");
const confirmButtonClickHandler = async function () {
  confirmButton.removeEventListener("click", confirmButtonClickHandler); 
  console.log("delivery_confirmation_flag : true");
  requestDocumentRef.update({
    delivery_confirmation_flag : true
     

  });
  dialogElement.close();
  sessionStorage.setItem("deliveryRequestId",requestDocumentRef.id);
  window.location.href = "./../../pages/delivery_request_seeker/delivery_inprogress_seeker.html";   
};
confirmButton.addEventListener("click", confirmButtonClickHandler);

}

var deliveryInfo = {};

function storeDateTimeAndDropoffOption() {
  var dateTimeInput = document.getElementById("scheduled_delivery_datetime");
  var dateTimeValue = dateTimeInput.value;

  var dropoffOptionInput = document.getElementById("dropoff_option");
  var dropoffOptionValue = dropoffOptionInput.value;

  var notesInput = document.getElementById("comments");
  var notesValue = notesInput.value;


  deliveryInfo = {
    dateTime: dateTimeValue,
    dropoffOption: dropoffOptionValue,
    notes: notesValue
  };

  // Add the delivery information to the array

  console.log(deliveryInfo); // Display the array in the console (optional)

  // You can perform further operations with the stored information here

  // Clear the input fields for the next entry (optional)
  dateTimeInput.value = "";
  dropoffOptionInput.value = "front_door";

  return deliveryInfo;
}


