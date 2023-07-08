let userDocId = sessionStorage.getItem("userDocId");
let deliveryRequestId = sessionStorage.getItem("deliveryRequestId");
let deliveryRequest;
var bookingFee = 2;
var minimumFare = 5;
var intervalId;
var progressTrackingCount =0;


if (userDocId == null) {
  userDocId = "ZqrR2gICV2cuT2DCAJIStDE4YEi1";
}

if (deliveryRequestId == null) {
  deliveryRequestId = "RP90LL6vPwzgKjzanVu7";
}

getDeliveryDoc();
async function getDeliveryDoc() {
  await firebase
    .firestore()
    .collection("delivery_request_tests")
    .doc(deliveryRequestId)
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
    checkbox.disabled = true; 
    checkbox.checked = true;// Adding the disabled property
  

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
    .doc('RP90LL6vPwzgKjzanVu7')


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
    .doc(deliveryRequestId)
    .get()
    .then((doc) => {
      deliveryRequest = doc.data();
      console.log(deliveryRequest.delivery_completed_flag);
      if (deliveryRequest.delivery_completed_flag == true) {
        clearInterval(intervalId);
        
        let dialogElement = processDeliveryRequest(deliveryRequestId);
        showDialog(dialogElement);

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



function processDeliveryRequest(deliveryRequestId) {
  console.log("Processing Delivery Request:", deliveryRequestId);
  const imageUrl = deliveryRequest.delivery_completed_image_url; 
  const dialogElement = createDialogElement(imageUrl);
  showDialog(dialogElement);
  return dialogElement;
}

function createDialogElement(imageUrl) {
  const dialog = document.createElement("dialog");
  dialog.setAttribute("class", "modal");
  dialog.id = "modal";

  const dialogContent = document.createElement("div");
  dialogContent.setAttribute("class", "dialogContent");
  dialogContent.innerHTML = `
    <p class="dialog-head">Sent a request</p>
    <img class="dialog-img" style="width: 50px; height: 50px;" src="${imageUrl}">
    <button class="dialogClose">Close</button>
  `;
  dialog.appendChild(dialogContent);

  return dialog;
}

function showDialog(dialogElement) {
  if (
    dialogElement instanceof HTMLElement &&
    dialogElement.tagName === 'DIALOG' &&
    !dialogElement.hasAttribute('open')
  ) {
  document.body.appendChild(dialogElement);
  dialogElement.showModal();

  const closeModal = dialogElement.querySelector(".dialogClose");
  closeModal.addEventListener("click", function (event) {
    dialogElement.close();
  });

  // Close dialog when clicking outside
  dialogElement.addEventListener("click", function (event) {
    if (event.target === dialogElement) {
      dialogElement.close();
    }
  });
} else {
  console.error('Invalid dialogElement provided or dialog is already open');
}
}
