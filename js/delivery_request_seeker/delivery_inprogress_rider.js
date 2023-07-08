const progressTracking = document.getElementById('progressTracking');
const docId = "32bj1sNrr8lfOHZ5Io5b"; // Replace with the actual document ID

progressTracking.addEventListener('change', () => {
    const docRef = firebase.firestore().collection("delivery_request_tests").doc(docId);
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
            delivery_confirmation_flag:deliveryStart,
            delivery_inprogress_flag:inProgress
        })
             .then(() => {
                alert("Delivery progress updated successfully.");
            })
            .catch((error) => {
               alert("Error updating delivery progress: " + error);
          });
 });
