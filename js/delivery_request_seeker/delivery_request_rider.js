let userDocId = (sessionStorage.getItem("userDocId"));
let isDriverFlag = (sessionStorage.getItem("isDriver"));
let isDriver =false;


if(isDriverFlag === "yes"){
    isDriver =true;
}

/******* driver: show up request > popup > confirm > update ********/
// change div of section : request
// const allPages = document.querySelectorAll("div.page");
// navigateToPage();
// window.addEventListener("hashchange", navigateToPage);
// function navigateToPage(event) {
//     const pageId = location.hash? location.hash : '#request';
//     for(let page of allPages) {
//         if (pageId === '#'+page.id) {
//             page.style.display = "block";
//         } else {
//             page.style.display = "none";
//         }
//     }
//     return;
// }


// query data
var db = firebase.firestore();

if (userDocId == null) {
    userDocId = '7CAw8QAmzYgBou8dgYqKCzUTqaC2';
}

let data;

// driver_availability: users_tests
//In Progress works

showRequests();

function showRequests(){
  db.collection("users_tests").get().then(function(query) {
    var user_data = [];
    query.forEach(function(doc) {
        user_data.push(doc.data());
    });
    var filtered_data = user_data.filter(function(user) {
        return user.userDocId === userDocId;
    });

    const user_name = filtered_data[0].user_name;
    const driver_availability = filtered_data[0].driver_availability;
    return {
        user_name: user_name,
        driver_availability: driver_availability
    };
}).then(function(userData) {
    data = [];
    db.collection("delivery_request_tests").where('delivery_picked_up_flag' , '==',false).get().then(function(query) {
        query.forEach(function(doc) {
            data.push(doc.data());
            return data;
        });
        generateContent(data, userDocId,userData.user_name, userData.driver_availability,"requests");
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}).catch(function(error) {
    console.log("Error getting documents: ", error);
});
}


let dialogElement;
function dialogData(data,request_type) {
    // Code that relies on the data goes here
    console.log(data);
    console.log("test",data.delivery_requested_by);

    const dialog = document.createElement("dialog");
    dialog.setAttribute('class', "modal");
    dialog.id = "modal";

    let requestDt = new Date(data.created_at);

    const dialogContent = document.createElement("div"); 
    dialogContent.setAttribute('class', "dialogContent"); 
    dialogContent.innerHTML = `
        <p class="dialog-head">${data.delivery_requested_by} sent a request</p>
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
        <p class="dialog-detail">${data.note}</p>

        <p class="dialog-title">Estimated Time:</p>
        <p class="dialog-detail">${data.delivery_estimated_time}</p>

        <p class="dialog-distance">${data.delivery_distance}km</p>
        <p class="dialog-price">$ ${data.delivery_total_fee} CAD</p>
        `;
    dialog.appendChild(dialogContent);

    if(request_type === 'requests'){
      const dialogButtonConfirm = document.createElement("button");
      dialogButtonConfirm.textContent = "Confirm";
      dialogButtonConfirm.id = "dialogButtonConfirmId";
      dialogButtonConfirm.setAttribute('class', "dialogConfirm");
      dialog.appendChild(dialogButtonConfirm);
    }
    

    const dialogButtonClose = document.createElement("button");
    dialogButtonClose.textContent = "Cancel";
    dialogButtonClose.id = "dialogButtonCloseId";
    dialogButtonClose.setAttribute('class', "dialogClose");
    dialog.appendChild(dialogButtonClose);
    return dialog;
  }






function generateContent(data, userDocId, user_name,driver_availability,request_type) {
   console.log(data);
   let  request= document.getElementById('request')
   request.innerHTML='';
    if (driver_availability == true){
    
   
    let clickedData; 


    data.forEach((i) => {
        const requestlink = document.createElement("a"); // 
        requestlink.href = "#"; 
        requestlink.classList.add("request-link");
        request.appendChild(requestlink);

        const requestContainer = document.createElement("div");
        requestContainer.classList.add("request-div");
        requestlink.appendChild(requestContainer);

        // div left: time, distance
        const requestContainer1 = document.createElement("div"); 
        requestContainer1.classList.add("request-div-left");
        requestContainer.appendChild(requestContainer1);
        // fix
        // add img
        const image = document.createElement("img");
        image.src = "./../../img/bike.svg"; 
        image.style.width = "200px"; 
        image.style.maxHeight  = "30px"; 
        requestContainer1.appendChild(image);
        //add name
        const requestName= document.createElement("p");
        requestName.innerHTML = i.delivery_requested_by;
        requestContainer1.appendChild(requestName);
        //  date
        let requestDt = new Date(i.created_at);
        const requestDate = document.createElement("p");
        requestDate.innerHTML = `${requestDt.getDate()} ${requestDt.toLocaleString('default', { month: 'long' })} ${requestDt.getFullYear()}`;
        requestContainer1.appendChild(requestDate);

        const requestTime = document.createElement("p");
        requestTime.innerHTML =requestDt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
        requestContainer1.appendChild(requestTime);
        
        // div center: time, distance
        const requestContainer2 = document.createElement("div"); 
        requestContainer2.classList.add("request-div-center");
        requestContainer.appendChild(requestContainer2);
        // origin
        const requestOrigin = document.createElement("p");
        requestOrigin.innerHTML = i.origin_name;
        requestContainer2.appendChild(requestOrigin);
        // destination
        const requestDestination = document.createElement("p");
        requestDestination.innerHTML = i.destination_name;
        requestContainer2.appendChild(requestDestination);
        // estimate time
        const requestEstimateTime = document.createElement("p");
        requestEstimateTime.innerHTML = i.delivery_estimated_time;
        requestContainer2.appendChild(requestEstimateTime);
        // distance
        const requestDistance = document.createElement("p");
        requestDistance.innerHTML = i.delivery_distance;
        requestContainer2.appendChild(requestDistance);

        // div right : request button, fee
        const requestContainer3 = document.createElement("div");
        requestContainer3.classList.add("request-div-right");
        requestContainer3.setAttribute("data-value", data.indexOf(i));
        requestContainer.appendChild(requestContainer3);
        const requestbutton = document.createElement("button");
        requestbutton.textContent = "Requests"
        requestbutton.classList.add("request-button");
        requestContainer3.appendChild(requestbutton);
        const requestfee = document.createElement("p");
        requestfee.textContent = `$ ${i.delivery_total_fee} CAD`;
        requestfee.classList.add("request-fee");
        requestContainer3.appendChild(requestfee);


        const dialogElement = dialogData(i,request_type);
        document.body.appendChild(dialogElement);

        requestlink.addEventListener("click", function (event) {
            event.preventDefault(); 

            const clickedContainer3 = this.querySelector(".request-div div[data-value]"); 
            const value = clickedContainer3.getAttribute("data-value");
            clickedData = data[value];

        showDialog(dialogElement, clickedData, user_name, userDocId); 
      });
    });
  } else {
    return;
  }
}

// Function to handle the dialog actions
function showDialog(dialogElement, clickedData, user_name, userDocId) {
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

    await updateDeliveryPickedUp(clickedData.deliveryRequestId, user_name, userDocId);
    dialogElement.close();
    setIntervalForConfirmationTracking(clickedData.deliveryRequestId);
    
  };
  confirmButton.addEventListener("click", confirmButtonClickHandler);
}




async function updateDeliveryPickedUp(deliveryRequestId, user_name,userDocId) {
    try {
      await firebase.firestore().collection("delivery_request_tests").doc(deliveryRequestId).update({
        delivery_picked_up_flag: true,
        delivery_picked_up_by: user_name,
        riderDocId : userDocId,
        delivery_completed_flag : false 
      });
      alert("Delivery request updated successfully!");
    } catch (error) {
      alert("Error updating delivery request:", error);
    }
  }
  




/********** driver: update availability status ***********/
const favioAvailabilityCheckBox = document.getElementById("Favio_availabilityCheckBox");



favioAvailabilityCheckBox.addEventListener('change', (e) => {
    e.preventDefault();
    const docRef = firebase.firestore().collection("users_tests").doc(userDocId);
    const driverAvailability = favioAvailabilityCheckBox.checked;
    
    if (isDriver) {
        docRef.update({
            driver_availability: driverAvailability
        })
        .then(() => {
            alert("Driver availability updated successfully.");
            updateRequestSectionVisibility(driverAvailability);
        })
        .catch((error) => {
            alert("Error updating driver availability:", error);
        });
        // Update visible immediately
        updateRequestSectionVisibility(driverAvailability);
    }
});

// Hide the change-request element initially
const changeRequest = document.getElementById("change-request");

function updateRequestSectionVisibility(driverAvailability) {
    const requestSection = document.getElementById('request');
    const googleMap = document.getElementById("googleMap");
   
    if (driverAvailability) {
         requestSection.style.display = 'block';
        googleMap.style.display = "block";
        changeRequest.style.display = "flex";
    } else {
        requestSection.style.display = 'none';
        googleMap.style.display = "none";
        changeRequest.style.display = "none";
    }
}

// Set initial availability and visibility
const initialAvailability = false; // Set initial availability to false
favioAvailabilityCheckBox.checked = initialAvailability;
updateRequestSectionVisibility(initialAvailability);

/******************* map *******************/
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


function showInProgress(){
  console.log("In Progress");
  db.collection("users_tests").get().then(function(query) {
    var user_data = [];
    query.forEach(function(doc) {
        user_data.push(doc.data());
    });
    var filtered_data = user_data.filter(function(user) {
        return user.userDocId === userDocId;
    });

    const user_name = filtered_data[0].user_name;
    const driver_availability = filtered_data[0].driver_availability;
    return {
        user_name: user_name,
        driver_availability: driver_availability
    };
}).then(function(userData) {
    data = [];
    db.collection("delivery_request_tests").where('delivery_picked_up_flag' , '==',true).where('delivery_completed_flag' , '==',false).get().then(function(query) {
        query.forEach(function(doc) {
            data.push(doc.data());
            return data;
        });
        console.log(data);
        generateContent(data, userDocId,userData.user_name, true,"in progress");
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}).catch(function(error) {
    console.log("Error getting documents: ", error);
});
}


function showCompleted(){
  console.log("Completed");
  db.collection("users_tests").get().then(function(query) {
    var user_data = [];
    query.forEach(function(doc) {
        user_data.push(doc.data());
    });
    var filtered_data = user_data.filter(function(user) {
        return user.userDocId === userDocId;
    });

    const user_name = filtered_data[0].user_name;
    const driver_availability = filtered_data[0].driver_availability;
    return {
        user_name: user_name,
        driver_availability: driver_availability
    };
}).then(function(userData) {
    data = [];
    db.collection("delivery_request_tests").where('delivery_picked_up_flag' , '==',true).where('delivery_completed_flag' , '==',true).get().then(function(query) {
        query.forEach(function(doc) {
            data.push(doc.data());
            return data;
        });
        console.log(data);
        generateContent(data, userDocId,userData.user_name, true,"completed");
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}).catch(function(error) {
    console.log("Error getting documents: ", error);
});
}



function setIntervalForConfirmationTracking(deliveryRequestId) {
    intervalId = setInterval(() => {
        getConfirmationTracking(deliveryRequestId);
    }, 8000);
  }
  
  async function getConfirmationTracking(deliveryRequestId) {
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
        if (deliveryRequest.delivery_confirmation_flag == true) {
          clearInterval(intervalId);
          sessionStorage.setItem("deliveryRequestId",deliveryRequestId);
          window.location.href = "./../../pages/delivery_request_seeker/delivery_inprogress_rider.html";  
        }
      
  
      });
  }