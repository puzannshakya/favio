let userDocId = (sessionStorage.getItem("userDocId"));
let isDriverFlag = (sessionStorage.getItem("isDriver"));
let isDriver =false;
let historyArray = [];
console.log(userDocId);

if(isDriverFlag === "yes"){
    isDriver =true;
}

getDeliveryRequestData();

// if(isDriver){
//     getDeliveryRequestData();
// }else{
//     getDeliveryRequestData();
// }



async function getDeliveryRequestData(){
       //delete this after testing

       if(isDriver){
        console.log(userDocId);
        await firebase.firestore().collection("delivery_request_tests").where('riderDocId', '==', userDocId).get().then( docData => {
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
       }else{
        console.log(userDocId);
        await firebase.firestore().collection("delivery_request_tests").where('seekerDocId', '==', userDocId).get().then( docData => {
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


function showHistory(){
    let result = `<ul>
    <li> 
        <h2>Name</h2>
        <h2>Time & Date</h2>
        <h2>Pickup and Drop off</h2>
        <h2>Status</h2>
        <h2>Duration</h2>
        <h2>Distance</h2>
        <h2>Total Fee</h2>
    </li>
</ul>`;
    historyArray.forEach(history => {
         let formattedDate = getFormattedDate(history.created_at);
         let deliveryProgressRow = deliveryProgress(history.delivery_completed_flag ,history.delivery_picked_up_flag );
        

        let row = `<li> <p> ${history.delivery_picked_up_by} </p> 
                         <p>${formattedDate} </p>   
                         <p> From ${history.origin_name} to ${history.destination_name}</p>
                         <p>${history.deliveryProgressRow} </p>
                         <p> ${history.delivery_estimated_time}</p>
                         <p>${history.delivery_distance} </p>
                         <p> $ ${history.delivery_total_fee}</p></li>`;
        result = result +  row;
    })
    
    showHistoryDiv.innerHTML=result;
}


function deliveryProgress(delivery_completed_flag,delivery_picked_up_flag){
    if(delivery_picked_up_flag){
        if(delivery_completed_flag){
            return "Completed";
        }else{
            return "In Progress";
        }
    }
}

function getFormattedDate(timestamp){
   
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
