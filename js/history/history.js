let userDocId = (sessionStorage.getItem("userDocId"));
let isDriverFlag = (sessionStorage.getItem("isDriver"));
let isDriver = false;
let historyArray = [];
let historyArrayCompleted = [];
console.log(userDocId);

if (isDriverFlag === "yes") {
  isDriver = true;
}

getDeliveryRequestData();

// if(isDriver){
//     getDeliveryRequestData();
// }else{
//     getDeliveryRequestData();
// }



async function getDeliveryRequestData() {
  //delete this after testing

  if (isDriver) {
    console.log(userDocId);
    await firebase.firestore().collection("delivery_request_tests").where('riderDocId', '==', userDocId).orderBy('created_at', 'desc').get().then(docData => {
      if (docData.empty) {
        console.log("No Such document");

      }
      else {
        docData.forEach(doc => {
          historyArray.push(doc.data());
        });

      }
      console.log(historyArray);
      showHistory();
    });
  } else {
    console.log(userDocId);
    await firebase.firestore().collection("delivery_request_tests").where('seekerDocId', '==', userDocId).orderBy('created_at', 'desc').get().then(docData => {
      if (docData.empty) {
        console.log("No Such document");

      }
      else {
        docData.forEach(doc => {
          historyArray.push(doc.data());
        });

      }
      console.log(historyArray);
      showHistory();
    });
  }

}


function showHistory() {
  let result = `<ul>
    <li class="favioHeaderli"> 
        <h5>&nbsp;</h5>
        <h5>Time & Date</h5>
        <h5>Pickup and Drop off</h5>
        <h5>Status</h5>
        <h5>Distance</h5>
        <h5>Total Fee</h5>
    </li>
</ul>`;
  let index = 0;
  historyArray.forEach(history => {
    let formattedDate = getFormattedDate(history.created_at);
    let deliveryProgressRow = deliveryProgress(history.delivery_completed_flag, history.delivery_picked_up_flag);


    let row = `<ul class="favio_historyListUl">
        <li class="favio_listStyle"onclick="showdialogAll(${index})"> <p> <a href="#" >${history.delivery_picked_up_by == null ? "Not Picked" : history.delivery_picked_up_by}</a> </p> 
                         <p><a href="#" >${formattedDate}</a> </p>   
                         <p><a class="favio_historyFromTO" href="#" > <span class="favio_historyDistance"> From ${history.origin_name}</span> <span class="favio_historyDistance"> To ${history.destination_name}</span></a> </p>
                         <p><a href="#" id="favio_historyId" class="favio_historyStatus" >${deliveryProgressRow} </a></p>
                         <p><a class="favio_distance" href="#" >${history.delivery_distance} </a></p>
                         <p><a href="#" >$ ${history.delivery_total_fee}</a> </p>
                         <p><i class="fa-solid fa-arrow-right"></i></p>
                         </li></ul>`;
    result = result + row;
    index = index + 1;
    // const dialogElement = dialogData(i);
    // document.body.appendChild(dialogElement);

    //     document.addEventListener("click", function (event) {
    //        console.log(history)
    //   });


  })

  showHistoryDiv.innerHTML = result;
  colorHistory();
}


function deliveryProgress(delivery_completed_flag, delivery_picked_up_flag) {
  console.log(delivery_completed_flag);
  console.log(delivery_picked_up_flag);
  if (delivery_picked_up_flag) {
    if (delivery_completed_flag) {
      return "Completed";
    } else {
      return "In Progress";
    }
  } else {
    return "Not Picked";
  }
}

function getFormattedDate(timestamp) {

  const date = new Date(timestamp);

  // Months array to get the month name
  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  // Get the month, day, year, hours, minutes, and AM/PM
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12;

  // Format the final string
  const formattedDate = `${month} ${day}, ${year} ${hours}:${minutes.toString().padStart(2, '0')}${ampm}`;

  console.log(formattedDate);
  return formattedDate;
}



function showdialogAll(index) {
  console.log(index);
  const dialogElement = dialogData(historyArray[index]);
  document.body.appendChild(dialogElement);
  showDialog(dialogElement, historyArray[index], userDocId);
}

function dialogData(data) {
  // Code that relies on the data goes here
  console.log(data);
  console.log("test", data.delivery_requested_by);

  const dialog = document.createElement("dialog");
  dialog.setAttribute('class', "modal");
  dialog.id = "modal";

  let requestDt = new Date(data.created_at);

  const dialogContent = document.createElement("div");
  dialogContent.setAttribute('class', "dialogContent");
  dialogContent.innerHTML = `
        <p>${data.delivery_picked_up_by}</p>
        <img class="dialog-img" style="width:50px; height:50px;" src="./../../img/bike.svg">
        <p class="dialog-date">${requestDt.getDate()} ${requestDt.toLocaleString('default', { month: 'long' })} ${requestDt.getFullYear()}</p>
        <p class="dialog-time">${requestDt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</p>
        <p class="dialog-title">Pick-up Location: </p>
        <p class="dialog-detail">${data.origin_name}</p>
        <p class="dialog-title">Drop-off Location: </p>
        <p class="dialog-detail">${data.destination_name}</p>
        <p class="dialog-title">Package Details:</p>
        <p class="dialog-detail">Size: ${data.size}cm</p>
        <p class="dialog-detail">Weight: ${data.weight}kg</p>

        <p class="dialog-title">Drop-off Method:</p>
        <p class="dialog-detail">${data.selected_drop_off_option}</p>

        <p class="dialog-title">Notes:</p>
        <p class="dialog-detail">${data.notes}</p>

        <p class="dialog-title">Estimated Time:</p>
        <p class="dialog-detail">${data.delivery_estimated_time}</p>

        <p class="dialog-distance">${data.delivery_distance}</p>
        <p class="dialog-price">$ ${data.delivery_total_fee}</p>
        `;
  dialog.appendChild(dialogContent);

  const dialogButtonOpen = document.createElement("button");
  dialogButtonOpen.textContent = "Open";
  dialogButtonOpen.id = "dialogButtonOpenId";
  dialogButtonOpen.setAttribute('class', "dialogOpen");
  dialog.appendChild(dialogButtonOpen);

  const dialogButtonClose = document.createElement("button");
  dialogButtonClose.textContent = "Close";
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

  //OB
  const oB = dialogElement.querySelector("#dialogButtonOpenId");
  console.log(oB);
  const openButtonClickHandler = async function () {
    // alert("Open");
    oB.removeEventListener("click", openButtonClickHandler);
    sessionStorage.setItem("deliveryRequestId", clickedData.deliveryRequestId);
    dialogElement.close();
    goInProgress();


  };
  oB.addEventListener("click", openButtonClickHandler);

}


function showHistoryAll() {
  historyArray = [];
  showActiveLink("all")
  getDeliveryRequestData();
}


function showHistoryCompleted() {
  historyArrayCompleted = [];
  showActiveLink("completed")
  console.log("Completed");
  getDeliveryRequestDataCompleted();
}


function getDeliveryRequestDataCompleted() {

  if (isDriver) {
    console.log(userDocId);
    firebase.firestore().collection("delivery_request_tests").where('riderDocId', '==', userDocId).where('delivery_completed_flag', '==', true).orderBy('created_at', 'desc').get().then(docData => {
      if (docData.empty) {
        console.log("No Such document");

      }
      else {
        docData.forEach(doc => {
          historyArrayCompleted.push(doc.data());
        });

      }
      console.log(historyArrayCompleted);
      showHistoryCompletedInDiv();
    });
  } else {
    console.log(userDocId);
    firebase.firestore().collection("delivery_request_tests").where('seekerDocId', '==', userDocId).where('delivery_completed_flag', '==', true).orderBy('created_at', 'desc').get().then(docData => {
      if (docData.empty) {
        console.log("No Such document");

      }
      else {
        docData.forEach(doc => {
          historyArrayCompleted.push(doc.data());
        });

      }
      console.log(historyArrayCompleted);
      showHistoryCompletedInDiv();
    });
  }

}

function showHistoryCompletedInDiv() {
  let result = `<ul>
  <li class="favioHeaderli"> 
  <h5>&nbsp;</h5>
  <h5>Time & Date</h5>
  <h5>Pickup and Drop off</h5>
  <h5>Status</h5>
  <h5>Distance</h5>
  <h5>Total Fee</h5>
</li>
</ul>`;
  let index = 0;
  historyArrayCompleted.forEach(history => {
    let formattedDate = getFormattedDate(history.created_at);
    let deliveryProgressRow = deliveryProgress(history.delivery_completed_flag, history.delivery_picked_up_flag);


    let row = `<ul class="favio_historyListUl">
    <li  class="favio_listStyle" onclick="showdialogCompleted(${index})"> <p> <a href="#" >${history.delivery_picked_up_by == null ? "Not Picked" : history.delivery_picked_up_by}</a> </p> 
                         <p><a href="#" >${formattedDate}</a> </p>   
                         <p><a class="favio_historyFromTO" href="#" > <span class="favio_historyDistance"> From ${history.origin_name}</span> <span class="favio_historyDistance"> To ${history.destination_name}</span></a> </p>
                         <p><a href="#" id="favio_historyId" class="favio_historyStatus">${deliveryProgressRow} </a></p>
                         <p><a href="#" class="favio_distance" >${history.delivery_distance} </a></p>
                         <p><a href="#" >$ ${history.delivery_total_fee}</a> </p>
                         <p><i class="fa-solid fa-arrow-right"></i></p>
                         </li></ul>`;
    result = result + row;
    index = index + 1;
    // const dialogElement = dialogData(i);
    // document.body.appendChild(dialogElement);

    //     document.addEventListener("click", function (event) {
    //        console.log(history)
    //   });


  })

  showHistoryDiv.innerHTML = result;
  colorHistory();
}


function showdialogCompleted(index) {
  console.log(index);
  const dialogElement = dialogData(historyArrayCompleted[index]);
  document.body.appendChild(dialogElement);
  showDialog(dialogElement, historyArrayCompleted[index], userDocId);
}


function goHome() {
  if (isDriver) {
    window.location.href = "./../../pages/delivery_request_seeker/delivery_request_rider.html";
  } else {
    window.location.href = "./../../pages/delivery_request_seeker/delivery_request_seeker.html";
  }
}

function goInProgress() {
  if (isDriver) {
    window.location.href = "./../../pages/delivery_request_seeker/delivery_inprogress_rider.html";
  } else {
    window.location.href = "./../../pages/delivery_request_seeker/delivery_inprogress_seeker.html";
  }
}



function colorHistory() {
  const historyBoxes = document.getElementsByClassName('favio_historyStatus');

  for (const historyBox of historyBoxes) {
    if (historyBox.innerText === 'Completed') {
      historyBox.style.backgroundColor = '#07B875';
    } else if (historyBox.innerText === 'In Progress') {
      historyBox.style.backgroundColor = '#043C27';
    } else if (historyBox.innerText === 'Requests') {
      historyBox.style.backgroundColor = '#F5BF20';
    } else if (historyBox.innerText === 'Delay') {
      // Set default color for other status values
      historyBox.style.backgroundColor = '#F66256';
    }
  }
}


function showActiveLink(request_type) {
  switch (request_type) {
    case "all":
      document.getElementById("historyAllSpan").classList.add("active-link");
      document.getElementById("historyCompletedSpan").classList.remove("active-link");
;
      break;



    case "completed":
      document.getElementById("historyAllSpan").classList.remove("active-link");
      document.getElementById("historyCompletedSpan").classList.add("active-link");
      break;

   
  }
}

