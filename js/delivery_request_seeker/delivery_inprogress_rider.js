const progressTracking = document.getElementById('progressTracking');
let userDocId = sessionStorage.getItem("userDocId");
let deliveryRequestId = sessionStorage.getItem("deliveryRequestId");
let deliveryRequest;
var bookingFee = 2;
var minimumFare = 5;
var intervalId;

if (userDocId == null) {
  userDocId = "7CAw8QAmzYgBou8dgYqKCzUTqaC2";
}

if (deliveryRequestId == null) {
  deliveryRequestId = "srQEPaonGRbngJBaqBVU";
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
      // document.getElementById('deliveryStart').checked = deliveryRequest.delivery_picked_up_flag;
      // document.getElementById('inProgress').checked = deliveryRequest.delivery_inprogress_flag;
      // document.getElementById('deliveryComplete').checked = deliveryRequest.delivery_completed_flag ;
      calcRoute();
      progressTrackingChangeListener();
      if(!deliveryRequest.delivery_completed_image_confirmation_flag){
        setIntervalForProgressTracking();
        }else{
          if(deliveryRequest.delivery_completed_rider_flag ){
            submitButtonDeliveryCompleteRider.style.backgroundColor = "#07B875";
          }else{
            submitButtonDeliveryCompleteRider.style.backgroundColor = "#07B875";
          }
          
        }


      if(deliveryRequest.delivery_completed_flag ){
        completedImage.src=`${deliveryRequest.delivery_completed_image_url}`;
        completedImage.style.display="block";
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
      if (deliveryRequest.totalPrice < 6) {
        feeSummary.innerHTML = `<h4>Fee Summary</h4>             
              <ul class="FavioPriceUl"> <li> Base Price       ${deliveryRequest.basePrice} </li>
                                              <li>Minimum Fare       ${deliveryRequest.minimumFare}</li>
                                              <li>+ per Km            ${deliveryRequest.perKm}</li>
                                              <li>+ per min           ${deliveryRequest.perMin}</li>
                                              <li> Booking Fee        ${deliveryRequest.bookingFee}</li> 
                                              </ul>`
      }
      else {
        delivery_total_fee = deliveryRequest.totalPrice;
        feeSummary.innerHTML = `<h4>Fee Summary</h4>
              
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

progressTracking.addEventListener('change', () => {
  console.log(deliveryRequestId);
  const docRef = firebase.firestore().collection("delivery_request_tests").doc(deliveryRequestId);
  const deliveryStart = document.getElementById('deliveryStart').checked;
  const inProgress = document.getElementById('inProgress').checked;
  const deliveryComplete = document.getElementById('deliveryComplete').checked;

  const delivery_progress = {
      deliveryStart: deliveryStart,
      inProgress: inProgress,
      deliveryComplete: deliveryComplete
  };
  if(deliveryComplete)
  {
    docRef.update({
      delivery_progress: delivery_progress,
      delivery_inprogress_flag:inProgress
  })
       .then(() => {
          // alert("Delivery progress updated successfully.");
      })
      .catch((error) => {
         console.log("Error updating delivery progress: " + error);
    });
  }else{
    docRef.update({
      delivery_progress: delivery_progress,
      delivery_completed_flag:deliveryComplete,
      delivery_inprogress_flag:inProgress
  })
       .then(() => {
          // alert("Delivery progress updated successfully.");
      })
      .catch((error) => {
         console.log("Error updating delivery progress: " + error);
    });
  }
 
   
      //  if(inProgress){
      //   if(deliveryComplete){
      //     openDialog(); 
      //   }
      //  }

       if(inProgress && deliveryComplete){
          openDialog(); 
       }
        
});


function progressTrackingChangeListener(){
  const allItems = document.querySelectorAll(".pt ul li span");
  console.log(deliveryRequestId);
  const docRef = firebase.firestore().collection("delivery_request_tests").doc(deliveryRequestId);
  let deliveryStart = true;
  let inProgress = deliveryRequest.delivery_inprogress_flag;
  let deliveryComplete = deliveryRequest.delivery_completed_flag;

  console.log(deliveryRequest.delivery_inprogress_flag);

  allItems.forEach(item => {
    if(item.innerText == "In Progress" && deliveryRequest.delivery_inprogress_flag){
      item.classList.add("active");
    }

    if(item.innerText == "Delivery Complete" && deliveryRequest.delivery_completed_flag){
      item.classList.add("active");
    }

})

  allItems.forEach(item => {
    if(item.innerText != "Delivery Start"){
      item.addEventListener("click", function(e){
        console.log(e.target);
        e.target.classList.toggle("active")
        console.log(e.target.classList.value);
        let delivery_progress = {
          deliveryStart: deliveryStart,
          inProgress: inProgress,
          deliveryComplete: deliveryComplete
      };
      console.log(delivery_progress);

      if(e.target.innerText == "In Progress"){
        if( e.target.classList.value == "active"){
          inProgress = true;
        }else{
          inProgress = false;
        }
      }else if (e.target.innerText == "Delivery Complete"){
        if( e.target.classList.value == "active"){
          deliveryComplete = true;
        }else{
          deliveryComplete = false;
        }
      }

        

       

        delivery_progress = {
          deliveryStart: deliveryStart,
          inProgress: inProgress,
          deliveryComplete: deliveryComplete
      };

       
      console.log(delivery_progress);
      if(deliveryComplete)
      {
        docRef.update({
          delivery_progress: delivery_progress,
          delivery_inprogress_flag:inProgress
      })
           .then(() => {
             console.log("Delivery progress updated successfully.");
          })
          .catch((error) => {
             console.log("Error updating delivery progress: " + error);
        });
      }else{
        docRef.update({
          delivery_progress: delivery_progress,
          delivery_completed_flag:deliveryComplete,
          delivery_inprogress_flag:inProgress
      })
           .then(() => {
            console.log("Delivery progress updated successfully.");
          })
          .catch((error) => {
             console.log("Error updating delivery progress: " + error);
        });
      }
      
       
      
           if(inProgress && deliveryComplete){
              openDialog(); 
           }



    })
    }
      
  })

  

}


// Set delivery_completed_flag to false when the page is reloaded
window.addEventListener('DOMContentLoaded', () => {
  const docRef = firebase.firestore().collection("delivery_request_tests").doc(deliveryRequestId);
  docRef.update({
      "delivery_progress.delivery_completed_flag": false
    })
    .then(() => {
      console.log("Delivery progress updated to false on page reload.");
    })
    .catch((error) => {
      console.error("Error updating delivery progress on page reload: ", error);
    });
});


function openDialog() {
  console.log("hi");
  const dialogElement = createDialogElement();
  showDialog(dialogElement);
  startCamera();
}




function createDialogElement() {
  const dialog = document.createElement("dialog");
  dialog.setAttribute("class", "modal");
  dialog.id = "modal";

  const dialogContent = document.createElement("div");
  dialogContent.setAttribute("class", "dialogContent");

  dialogContent.innerHTML = `
    <div class="photo2">
      <div>
        <button id="snap" onclick="snapPhoto()">Snap Photo</button>
      </div>
      <br />
      <video id="video" width="320" height="240" autoplay></video>
      <br />
      <canvas id="canvas" width="320" height="240"></canvas>
    </div>
`; 
  dialog.appendChild(dialogContent);

  // Show dialog event listener
  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
      stopCamera();
      dialog.remove();
    }
  });

  return dialog;
}

function showDialog(dialogElement) {
  if (
    dialogElement instanceof HTMLElement &&
    dialogElement.tagName === "DIALOG" &&
    !dialogElement.hasAttribute("open")
  ) {
    document.body.appendChild(dialogElement);
    dialogElement.showModal();

    // camera
     

const filetext = document.querySelector(".filetext");
const uploadpercent = document.querySelector(".uploadpercent");
const progress = document.querySelector(".progress");
let percentval;
let fileitem;
let filename;
const img = document.querySelector(".img");

function getfile(e){
    fileitem = e.target.files[0];
    filename = fileitem.name;
    filetext.innerHTML = filename;
}

function uploadimg(){
     let storageref = firebase.storage().ref("images/"+filename);
     let uploadtask = storageref.put(fileitem);

     uploadtask.on("state_changed", (snapshot)=>{
        console.log(snapshot);
        percentval = Math.floor((snapshot.bytesTransferred/snapshot.totalBytes)*100);
        console.log(percentval);
        uploadpercent.innerHTML = percentval+"%";
        progress.style.width=percentval+"%";
     }, (error) =>{
        console.log("error is", error);
     }, ()=>{
        uploadtask.snapshot.ref.getDownloadURL().then((url)=>{
            console.log("url", url);

            if(url != ""){
                img.setAttribute("src", url);
                img.style.display="block";
            }
        })
     })
}




    const video = document.getElementById('video');

    // Elements for taking the snapshot
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    context.scale(0.5, 0.5);


    // const startBtn = dialogElement.querySelector("#start");
    // const stopBtn = dialogElement.querySelector("#stop");

    // Elements for taking the snapshot
    const snapBtn = dialogElement.querySelector("#snap");

   

    // Trigger photo take event listener
    snapBtn.addEventListener("click", snapPhoto);

    
    function snapPhoto() {
      context.drawImage(video, 0, 0);
    
      const canvasDataURL = canvas.toDataURL();
      video.style.display = "block";
      canvas.style.display = "block";
      // Here you can upload this data to store the image in storage
      console.log("URL", canvasDataURL);
    
      // This is just to show we can also create an image element
      uploadimagevid(canvasDataURL);
     
  

    }

    
    function uploadimagevid(canvasDataURL) {
      // Convert the base64 dataURL to a Blob object
      const byteString = atob(canvasDataURL.split(',')[1]);
      const mimeType = canvasDataURL.match(/(:)([a-z\/]+)(;)/)[2];
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: mimeType });
  
      // Generate a unique filename for the image
      const filename = 'images/' + Date.now() + '.png';
  
      // Upload the image to Firebase Storage
      const storageRef = firebase.storage().ref(filename);
      const uploadTask = storageRef.put(blob);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress.toFixed(2) + '%');
        },
        (error) => {
          console.log('Error:', error);
        },
        () => {
          // Upload complete, get the download URL
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log('File available at:', downloadURL);
  
            // Store the download URL in Firebase Firestore
            const db = firebase.firestore();
            db.collection('delivery_request_tests').doc(deliveryRequestId).update({
              delivery_completed_image_url : downloadURL,
              delivery_completed_flag:true
            })
            .then((docRef) => {
              setIntervalForProgressTracking();
              console.log('Completed Image Src');
              completedImage.src=downloadURL;
              completedImage.style.display ="block";
              console.log(completedImage);
              console.log('Download URL stored with ID:', docRef.id);
            })
            .catch((error) => {
              console.log('Error storing download URL:', error);
            });
  
            // Display the uploaded image
            img.setAttribute('src', downloadURL);
            img.style.display = 'block';
          });
        }
      );
      }

    

  
} else {
    console.error("Invalid dialogElement provided or dialog is already open");
  }
}

function startCamera() {
  // alert('starting camera');
  console.log(deliveryRequestId);
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    video.style.display = "block";
    canvas.style.display = "none";
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        // startBtn.disabled = false;
        // stopBtn.disabled = false;
      })
      .catch((error) => {
        console.error("Error starting camera:", error);
      });
  } else {
    console.log("This browser doesn't support media devices");
  }
}


function stopCamera() {
  video.style.display = "none";
  canvas.style.display = "block";
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
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
      console.log(deliveryRequest);
      console.log(deliveryRequest.delivery_completed_image_confirmation_flag);
      if (deliveryRequest.delivery_completed_image_confirmation_flag) {
        clearInterval(intervalId);
        if(deliveryRequest.delivery_completed_rider_flag){
          // alert("completed");
          submitButtonDeliveryCompleteRider.style.backgroundColor = "#07B875";
       }else{
      submitButtonDeliveryCompleteRider.style.backgroundColor = "#07B875";
        }
       
      }
     

    });
}


function deliveryCompletedFinal(){
  console.log(submitButtonDeliveryCompleteRider.style.backgroundColor);
  // if(submitButtonDeliveryCompleteRider.style.backgroundColor == 'rgb(7, 184, 117)'){
  //   // window.location.href = './../../pages/delivery_request_seeker/delivery_request_rider.html';
  // }

  const allItems = document.querySelectorAll(".pt ul li span");
  const docRef = firebase.firestore().collection("delivery_request_tests").doc(deliveryRequestId);
  let deliveryStart = true;
  let inProgress = false ;
  let deliveryComplete = false;

  allItems.forEach(item => {
    console.log(item);
 
    if(item.innerText == "Delivery Complete" ){
      if(item.classList.value == "active"){
        deliveryComplete = true;
      }
     
    }


})

console.log(deliveryComplete);


  if(deliveryComplete && submitButtonDeliveryCompleteRider.style.backgroundColor == 'rgb(7, 184, 117)'){
    firebase.firestore().collection('delivery_request_tests').doc(deliveryRequestId).update({
      delivery_completed_rider_flag :true
    })
    .then((docRef) => {
      console.log('delivery_completed_rider_flag  Updated ');
      submitButtonDeliveryCompleteRider.style.backgroundColor = "#07B875";
      console.log(submitButtonDeliveryCompleteRider.style.backgroundColor);
      window.location.href = './../../pages/delivery_request_seeker/delivery_request_rider.html';
  
    })
    .catch((error) => {
      console.log('Error updating ');
    });
  }

 
  
}






