let userDocId = sessionStorage.getItem("userDocId");
let deliveryRequestId = sessionStorage.getItem("deliveryRequestId");
let deliveryRequest;
var bookingFee = 2;
var minimumFare = 5;
var intervalId;
var progressTrackingCount = 0;
let delivery_completed_image_confirmation_flag = false;


if (userDocId == null) {
  userDocId = "ZqrR2gICV2cuT2DCAJIStDE4YEi1";
}

if (deliveryRequestId == null) {
  deliveryRequestId = "UTo3DxygvHA790xU5a3n";
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

      if (!deliveryRequest.delivery_completed_image_confirmation_flag) {
        setIntervalForProgressTracking();
      }

      if (deliveryRequest.delivery_completed_flag) {
        completedImage.src = `${deliveryRequest.delivery_completed_image_url}`;
        completedImage.style.display = "block";
        if (!deliveryRequest.delivery_completed_image_confirmation_flag) {
          confirmCompletedImage.style.display = "block";
          // cancelCompletedImage.style.display="block";
        }
      }

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
      // alert("walk selected");
      travelMode = google.maps.TravelMode.WALKING;
      break;

    case "Bikes or Scooters":
      // alert("Bikes or Scooters selected");
      travelMode = google.maps.TravelMode.BICYCLING;
      break;

    case "Cars":
      // alert("Cars selected");
      travelMode = google.maps.TravelMode.DRIVING;
      break;

    case "Transit":
      // alert("Transit selected");
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
      if (price.totalPrice < 10) {
        feeSummary.innerHTML = `<h4>Fee Summary</h4>             
              <ul class="FavioPriceUl"> <li> Base Price       ${deliveryRequest.basePrice} </li>
                                              <li>Minimum Fare       ${deliveryRequest.minimumFare}</li>
                                              <li>+ per Km            ${deliveryRequest.perKm}</li>
                                              <li>+ per min           ${deliveryRequest.perMin}</li>
                                              <li> Booking Fee        ${deliveryRequest.bookingFee}</li> 
                                              </ul>`
      }
      else {
        delivery_total_fee = price.totalPrice;
        feeSummary.innerHTML = `<h2>Fee Summary</h2>
              
              <ul class="FavioPriceUl"> <li> Base Price       ${deliveryRequest.basePrice} </li>
                                              <li>+ per Km            ${deliveryRequest.perKm}</li>
                                              <li>+ per min           ${deliveryRequest.perMin}</li>
                                              <li> Booking Fee        ${deliveryRequest.bookingFee}</li> 
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
  document.getElementById("progressTracking").innerHTML = "";

  const checkboxContainer = document.createElement("div");
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
    const label = document.createElement("label");
    label.htmlFor = checkboxLabel.id;
    label.textContent = checkboxLabel.label;

    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    checkboxContainer.appendChild(document.createElement("br"));
  });


  const container = document.getElementById("progressTracking");
  container.appendChild(checkboxContainer);
  populateCheckboxes();

}
// const docRef = firebase
//   .firestore()
//   .collection("delivery_request_tests")
//   .doc('RP90LL6vPwzgKjzanVu7')


// docRef.get().then((doc) => {
//   if (doc.exists) {
//     const delivery_progress = doc.data().delivery_progress;
//     populateCheckboxes(delivery_progress);
//   } else {
//     console.log("Document not found");
//   }
// })
//   .catch((error) => {
//     console.log("Error retrieving document:", error);
//   });




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
      console.log(deliveryRequest);
      console.log(deliveryRequest.delivery_completed_flag);
      if (deliveryRequest.delivery_completed_flag == true) {
        clearInterval(intervalId);

        let dialogElement = processDeliveryRequest(deliveryRequestId);
        showDialog(dialogElement);

      }
      showProgressTracking();

    });
}

const populateCheckboxes = () => {
  const deliveryStart = document.getElementById('deliveryStart')
  const inProgress = document.getElementById('inProgress')
  const deliveryComplete = document.getElementById('deliveryComplete')
  deliveryStart.checked = deliveryRequest.delivery_confirmation_flag;
  inProgress.checked = deliveryRequest.delivery_inprogress_flag;
  deliveryComplete.checked = deliveryRequest.delivery_completed_flag;

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
    <button class="dialogClose">Confirm Later</button>
    <button class="dialogConfirmNow">Confirm Now</button>
  `;
  dialog.appendChild(dialogContent);
  completedImage.src = `${imageUrl}`;
  completedImage.style.display = "block";


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
      dialogElement.remove();
      confirmCompletedImage.style.display = "block";
      // cancelCompletedImage.style.display="block";
      // setIntervalForProgressTracking();
    });

    const confirmNowModal = dialogElement.querySelector(".dialogConfirmNow");
    confirmNowModal.addEventListener("click", function (event) {
      console.log(deliveryRequestId);
      firebase.firestore().collection('delivery_request_tests').doc(deliveryRequestId).update({
        delivery_completed_image_confirmation_flag: true
      })
        .then((docRef) => {
          console.log('delivery_completed_image_confirmation_flag Updated ');
        })
        .catch((error) => {
          console.log('Error updating ');
        });
      dialogElement.close();
      dialogElement.remove();
    });

    // Close dialog when clicking outside
    dialogElement.addEventListener("click", function (event) {
      if (event.target === dialogElement) {
        dialogElement.close();
        dialogElement.remove();
        confirmCompletedImage.style.display = "block";
        // cancelCompletedImage.style.display="block";
      }
    });
  } else {
    console.error('Invalid dialogElement provided or dialog is already open');
  }
}

function confirmDeliveryImage() {
  firebase.firestore().collection('delivery_request_tests').doc(deliveryRequestId).update({
    delivery_completed_image_confirmation_flag: true
  })
    .then((docRef) => {
      clearInterval(intervalId);
      confirmCompletedImage.style.display = "none";
      console.log('delivery_completed_image_confirmation_flag Updated ');
    })
    .catch((error) => {
      console.log('Error updating ');
    });
}
