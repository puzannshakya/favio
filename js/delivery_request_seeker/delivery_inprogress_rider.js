const progressTracking = document.getElementById('progressTracking');
let userDocId = sessionStorage.getItem("userDocId");
let deliveryRequestId = sessionStorage.getItem("deliveryRequestId");

if (userDocId == null) {
  userDocId = "7CAw8QAmzYgBou8dgYqKCzUTqaC2";
}

if (deliveryRequestId == null) {
  deliveryRequestId = "srQEPaonGRbngJBaqBVU";
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
          alert("Delivery progress updated successfully.");
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
          alert("Delivery progress updated successfully.");
      })
      .catch((error) => {
         console.log("Error updating delivery progress: " + error);
    });
  }
 
   
       if(inProgress){
        if(deliveryComplete){
          openDialog(); 
        }
       }
        
});


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


    const startBtn = dialogElement.querySelector("#start");
    const stopBtn = dialogElement.querySelector("#stop");

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
  alert('starting camera');
  console.log(deliveryRequestId);
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    video.style.display = "block";
    canvas.style.display = "none";
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        startBtn.disabled = false;
        stopBtn.disabled = false;
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






