const progressTracking = document.getElementById('progressTracking');
let userDocId = sessionStorage.getItem("userDocId");
let deliveryRequestId = sessionStorage.getItem("deliveryRequestId");

if (userDocId == null) {
  userDocId = "3LmDMgI3D3aRjLgNWx4yNxmY29E3";
}

if (deliveryRequestId == null) {
  deliveryRequestId = "32bj1sNrr8lfOHZ5Io5b";
}

progressTracking.addEventListener('change', () => {
  const deliveryComplete = document.getElementById('deliveryComplete').checked;

  if (deliveryComplete) {
    const completebtn = document.getElementById("completebtn");

    if (!completebtn) {
      const completebtn = document.createElement("button");
      completebtn.id = "completebtn";
      completebtn.innerText = "Complete";
      progressTracking.appendChild(completebtn);

      // Update delivery_completed_flag in Firestore
      const docRef = firebase.firestore().collection("delivery_request_tests").doc(deliveryRequestId);
      docRef.update({
          "delivery_progress.delivery_completed_flag": true
        })
        .then(() => {
          console.log("Delivery progress updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating delivery progress: ", error);
        });
    }
  } else {
    const completebtn = document.getElementById("completebtn");

    if (completebtn) {
      completebtn.remove();

      // Update delivery_completed_flag in Firestore
      const docRef = firebase.firestore().collection("delivery_request_tests").doc(deliveryRequestId);
      docRef.update({
          "delivery_progress.delivery_completed_flag": false
        })
        .then(() => {
          console.log("Delivery progress updated successfully.");
        })
        .catch((error) => {
          console.error("Error updating delivery progress: ", error);
        });
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


getDeliveryDoc();
async function getDeliveryDoc() {
  await firebase
    .firestore()
    .collection("delivery_request_tests")
    .doc(deliveryRequestId)
    .get()
    .then((doc) => {
      console.log(doc.data());
      console.log(doc.data().delivery_progress.delivery_completed_flag);

      let delivery_completed_flag = doc.data().delivery_progress.delivery_completed_flag;

      showVerifyButton(delivery_completed_flag);
    });
}
function showVerifyButton(delivery_completed_flag) {
  const completediv = document.getElementById("complete");

  if (delivery_completed_flag) {
    const completebtn = document.createElement("button");
    completebtn.id = "completebtn";
    completebtn.innerText = "Complete";
    completebtn.setAttribute("onclick", "openDialog()");
    completediv.appendChild(completebtn);
  }
}

// fix this cannot close dialog after click button 
openDialog(); 


function openDialog() {
  console.log("hi");
  const dialogElement = createDialogElement();
  showDialog(dialogElement);
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
    <button id="start">Start Camera</button>
    <button id="snap" onclick="snapPhoto()">Snap Photo</button>
    <button id="stop" disabled>Stop Camera</button>
  </div>
  <br />
  <video id="video" width="320" height="240" autoplay></video>
  <br />
  <canvas id="canvas" width="320" height="240"></canvas>
  </div>
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





// camera ==========================
const img = document.createElement('img');
img.style.display = 'none';


const video = document.getElementById('video');

// Elements for taking the snapshot
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
context.scale(0.5, 0.5);

// elements to control actions
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');

function startCamera() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` bcuz we only want video
    navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      // video.play();  // or autplay
      startBtn.disabled = true;
      stopBtn.disabled = false;
    })
    .catch((error) => {
      context.font = '34px Tahoma';
      context.fillText(error, 50, 100);
    });
  } else {
    console.log("this browser doesn't support media devices");
  }
}
startBtn.addEventListener('click', startCamera);

function stopCamera() {
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  startBtn.disabled = false;
  stopBtn.disabled = true;
}
stopBtn.addEventListener('click', stopCamera);

// Trigger photo take
document.getElementById('snap').addEventListener('click', snapPhoto);

function snapPhoto() {
  //canvas.width = video.videoWidth;
  //canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0);

  const canvasDataURL = canvas.toDataURL();
  //here you can upload this data to store image in an Storage
  console.log("url",canvasDataURL);

  //this is just to show we can also create image element
  uploadimagevid(canvasDataURL);

}


function createSnapshotImage(dataURL) {
  const copyImg = document.createElement('img');
  copyImg.style.height = '120px';
  copyImg.src = dataURL;
  document.body.appendChild(copyImg);
}


function uploadimagevid(dataURL) {
  const docRef = firebase.firestore().collection("delivery_request_tests").doc(deliveryRequestId);
  docRef.update({
      "delivery_completed_image_url": dataURL
    })
    .then(() => {
      console.log("upload img url.");
    })
    .catch((error) => {
      console.error("Error upload img url: ", error);
    });
  }

