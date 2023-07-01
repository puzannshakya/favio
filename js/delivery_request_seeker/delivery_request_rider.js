let userDocId = (sessionStorage.getItem("userDocId"));
let isDriverFlag = (sessionStorage.getItem("isDriver"));
let isDriver =false;


if(isDriverFlag === "yes"){
    isDriver =true;
}

/******* driver: show up request > popup > confirm > update ********/
// change div of section : request
const allPages = document.querySelectorAll("div.page");
navigateToPage();
window.addEventListener("hashchange", navigateToPage);
function navigateToPage(event) {
    const pageId = location.hash? location.hash : '#request';
    for(let page of allPages) {
        if (pageId === '#'+page.id) {
            page.style.display = "block";
        } else {
            page.style.display = "none";
        }
    }
    return;
}


// query data
var db = firebase.firestore();

if (userDocId == null) {
    userDocId = '7CAw8QAmzYgBou8dgYqKCzUTqaC2';
}

// driver_availability: users_tests
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
    var data = [];
    db.collection("delivery_request_tests").get().then(function(query) {
        query.forEach(function(doc) {
            data.push(doc.data());
        });
        generateContent(data, userDocId,userData.user_name, userData.driver_availability);
    }).catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}).catch(function(error) {
    console.log("Error getting documents: ", error);
});

// popup
const dialog = document.createElement("dialog");
const dialogContent = document.createElement("p");  
dialog.setAttribute('class', "modal");
dialog.id = "modal";
dialogContent.textContent = "This is an open dialog window";
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

document.body.appendChild(dialog);



function generateContent(data, userDocId, user_name,driver_availability) {
    if (driver_availability == true){
      
    const request = document.getElementById('request');
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
        requestContainer.appendChild(requestContainer1);
        // fix
        // add img
        const image = document.createElement("img");
        image.src = "./../../img/bike.svg"; 
        image.style.width = "200px"; 
        image.style.height = "200px"; 
        requestContainer1.appendChild(image);
        //  date
        const requestDate = document.createElement("p");
        requestDate.innerHTML = i.created_at;
        requestContainer.appendChild(requestDate);
        
        // div center: time, distance
        const requestContainer2 = document.createElement("div"); 
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


        requestlink.addEventListener("click", function (event) {
            event.preventDefault(); 

            const clickedContainer3 = this.querySelector(".request-div div[data-value]"); 
            const value = clickedContainer3.getAttribute("data-value");
            clickedData = data[value];

            dialog.showModal(); 

    })
      
    });

    const closeModal = document.querySelector(".dialogClose");

    closeModal.addEventListener("click", function (event) {
      dialog.close();
    });

    // update in db
    document.getElementById("dialogButtonConfirmId").addEventListener("click", async function () {
        await updateDeliveryPickedUp(clickedData.deliveryRequestId, user_name, userDocId);
        dialog.close();
      });
    
    // Close dialog when clicking outside
    window.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });
} else {
    return;
}
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



function updateRequestSectionVisibility(driverAvailability) {
    const requestSection = document.getElementById('request');
    const googleMap = document.getElementById("googleMap");
    
    if (driverAvailability) {
        requestSection.style.display = 'block';
        googleMap.style.display = "block";
    } else {
        requestSection.style.display = 'none';
        googleMap.style.display = "none";
    }
}


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
