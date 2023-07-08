let userDocId = sessionStorage.getItem("userDocId");
let requestDocumentRefId = sessionStorage.getItem("requestDocumentRefId");
let deliveryRequest;
var bookingFee = 2;
var minimumFare = 5;
var intervalId;
var progressTrackingCount =0;


if (userDocId == null) {
  userDocId = "ZqrR2gICV2cuT2DCAJIStDE4YEi1";
}

if (requestDocumentRefId == null) {
  requestDocumentRefId = "UTo3DxygvHA790xU5a3n";
}

getDeliveryDoc();
async function getDeliveryDoc() {
  await firebase
    .firestore()
    .collection("delivery_request_tests")
    .doc(requestDocumentRefId)
    .get()
    .then((doc) => {
      deliveryRequest = doc.data();
      console.log(deliveryRequest);
      from.value = deliveryRequest.origin_name;
      to.value = deliveryRequest.destination_name;
      calcRoute();
      showProgressTracking();
      setIntervalForProgressTracking();
    });
}

var myLatLng = { lat: 49.282, lng: -123.1171 };
var mapOptions = {
  center: myLatLng,
  zoom: 14,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  mapId: "8ee82cfaab8ad410",
};

//create map
var map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map
directionsDisplay.setMap(map);

//define calcRoute function
function calcRoute() {
  //create request
  const checkedVechicle = deliveryRequest.selected_courier_options;
  console.log(checkedVechicle);
  let travelMode = google.maps.TravelMode.DRIVING;

  switch (checkedVechicle) {
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
    origin: deliveryRequest.origin_name,
    destination: deliveryRequest.destination_name,
    travelMode: travelMode, //WALKING, BYCYCLING, TRANSIT
    unitSystem: google.maps.UnitSystem.METRIC,
  };

  console.log(request);
  //pass the request to the route method
  directionsService.route(request, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      // //Get distance and time
      // const output = document.querySelector('#output');
      // output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

      //display route

      estimatedDistance.innerHTML = deliveryRequest.delivery_distance;
      estimatedTime.innerHTML = deliveryRequest.delivery_estimated_time;
      estimatedTotal.innerHTML = deliveryRequest.delivery_total_fee;

      const price = calculatePayment(request.travelMode, deliveryRequest.delivery_distance, deliveryRequest.delivery_estimated_time);

      if (price.totalPrice < 10) {
        price.totalPrice = price.totalPrice + minimumFare;
        delivery_total_fee = price.totalPrice;
        feeSummary.innerHTML = `<h2>Fee Summary</h2>
              
              <ul class="FavioPriceUl"> <li> Base Price       ${price.basePrice} </li>
                                              <li>Minimum Fare       ${minimumFare}</li>
                                              <li>+ per Km            ${price.distanceMultiplier}</li>
                                              <li>+ per min           ${price.timeMultiplier}</li>
                                              <li> Booking Fee        ${bookingFee}</li> 
                                              </ul>`
      }
      else {
        delivery_total_fee = price.totalPrice;
        feeSummary.innerHTML = `<h2>Fee Summary</h2>
              
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

function showProgressTracking() {

  const checkboxContainer = document.createElement("div");
if( progressTrackingCount ==0){
  const checkboxLabels = [
    { id: "deliveryStart", label: "Delivery Start" },
    { id: "inProgress", label: "In Progress" },
    { id: "deliveryComplete", label: "Delivery Complete" },
  ];

  checkboxLabels.forEach((checkboxLabel) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = checkboxLabel.id;
    checkbox.name = checkboxLabel.id;
    checkbox.value = checkboxLabel.id;

    const label = document.createElement("label");
    label.htmlFor = checkboxLabel.id;
    label.textContent = checkboxLabel.label;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    checkboxContainer.appendChild(document.createElement("br"));
  });


  const container = document.getElementById("progressTracking");
  container.appendChild(checkboxContainer);
  progressTrackingCount++;
}
  const docRef = firebase
    .firestore()
    .collection("delivery_request_tests")
    .doc('32bj1sNrr8lfOHZ5Io5b')


  docRef.get().then((doc) => {
    if (doc.exists) {
      const delivery_progress = doc.data().delivery_progress;
      populateCheckboxes(delivery_progress);
    } else {
      console.log("Document not found");
    }
  })
    .catch((error) => {
      console.log("Error retrieving document:", error);
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


function setIntervalForProgressTracking() {
  intervalId = setInterval(() => {
    getProgressTracking();
  }, 8000);
}

async function getProgressTracking() {
  console.log("Fetching Delivery Progress Tracking");
  await firebase
    .firestore()
    .collection("delivery_request_tests")
    .doc(requestDocumentRefId)
    .get()
    .then((doc) => {
      deliveryRequest = doc.data();
      console.log(deliveryRequest.delivery_completed_flag);
      if (deliveryRequest.delivery_completed_flag == true) {
        clearInterval(intervalId);
      }
      showProgressTracking();

    });
}

const populateCheckboxes = (deliveryProgress) => {
  const deliveryStart = document.getElementById('deliveryStart')
  const inProgress = document.getElementById('inProgress')
  const deliveryComplete = document.getElementById('deliveryComplete')
  deliveryStart.checked = deliveryProgress.deliveryStart;
  inProgress.checked = deliveryProgress.inProgress;
  deliveryComplete.checked = deliveryProgress.deliveryComplete;

};
function show(shown, hidden) {
  document.getElementById(shown).style.display='block';
  document.getElementById(hidden).style.display='none';
  return false;
}