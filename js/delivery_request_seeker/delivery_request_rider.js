var db = firebase.firestore();

db.collection("delivery_request_tests").get().then(function(query) {
    var data = [];
    query.forEach(function(doc) {
        
        console.log(doc);
        console.log(doc.data());

        data.push(doc.data());
    });
    generateContent(data);
}).catch(function(error) {
    console.log("Error getting documents: ", error);
});

function selectObject(array, propertyName, value) {
    return array.find(function(object) {
      return object[propertyName] === value;
    });
}


//// show div
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



function filterDataByUserDocId(data, userDocId) {
    return data.filter(function(object) {
        return object.seekerDocId === userDocId;
    });
}


// fix this
const userDocId = "ZqrR2gICV2cuT2DCAJIStDE4YEi1";

function generateContent(data, user_id) {
    const request = document.getElementById('request');

    const filteredData = filterDataByUserDocId(data, userDocId);

    console.log(filteredData, "from");

    
    
    filteredData.forEach((i) => {
        console.log(i)
        const requestlink = document.createElement("a"); // Change from div to a
        // add link to next page popup page
        requestlink.href = "#"; // Set the URL or leave it as "#" if you want to handle it later
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
        image.src = "./../../img/bike.svg"; // Set the source path of the image
        image.style.width = "200px"; // Set the width to 200px
        image.style.height = "200px"; // Set the height 
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
        requestContainer.appendChild(requestContainer3);
        const requestbutton = document.createElement("button");
        requestbutton.textContent = "Requests"
        requestbutton.classList.add("request-button");
        requestContainer3.appendChild(requestbutton);
        const requestfee = document.createElement("p");
        requestfee.textContent = `$ ${i.delivery_total_fee} CAD`;
        requestfee.classList.add("request-fee");
        requestContainer3.appendChild(requestfee);


        requestlink.addEventListener("click", function () {
            const dialog = document.createElement("dialog");
            const dialogContent = document.createElement("p");
            dialogContent.textContent = "This is an open dialog window";
            dialog.appendChild(dialogContent);

            const dialogButtonClose = document.createElement("button");
            dialogButtonClose.textContent = "Close";
            dialogButtonClose.id = "dialogButtonCloseId";
            dialog.appendChild(dialogButtonClose);


            requestContainer.appendChild(dialog); // Append the dialog to the request container

            dialog.showModal(); // Show the dialog


            dialogCloseElement = document.getElementById('dialogButtonCloseId');

            // Close the dialog when clicking outside
            dialogCloseElement.addEventListener("click", function (event) {
                alert("hello");
                    dialog.close(); // Close the dialog
                
            });
    })


    // requestlink.addEventListener("click", function () {
    //     const dialog = document.createElement("dialog");
    //     const text = `<dialog open>This is an open dialog window</dialog>`;
    //     request.appendChild(text);

      
    });
};



