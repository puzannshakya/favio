const progressTracking = document.getElementById('progressTracking');
let userDocId = sessionStorage.getItem("userDocId");
let deliveryRequestId = sessionStorage.getItem("deliveryRequestId");


if (userDocId == null) {
    userDocId = "ZqrR2gICV2cuT2DCAJIStDE4YEi1";
  }
  
  if (deliveryRequestId == null) {
    deliveryRequestId = "UTo3DxygvHA790xU5a3n";
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
   
     docRef.update({
            delivery_progress: delivery_progress,
            delivery_completed_flag:deliveryComplete,
            delivery_inprogress_flag:inProgress
        })
             .then(() => {
                alert("Delivery progress updated successfully.");
            })
            .catch((error) => {
               alert("Error updating delivery progress: " + error);
          });
 });
