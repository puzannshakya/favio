const select_option_driver = document.getElementById('select-option-driver');
console.log(sessionStorage.getItem("userDocId"));

select_option_driver.addEventListener('click', async (e) => {
    e.preventDefault();
    const selected_vehicle = document.querySelector('input[name="vehicle"]:checked');
    console.log(selected_vehicle.value)
    //  const documentId = 'L4ZlXvu0t8aycD4GOzi8';
    const documentId = sessionStorage.getItem("userDocId");



    try {
        await firebase.firestore().collection("users_tests").doc(documentId).update({
            selected_vehicle : selected_vehicle.value
        });
        alert("User information updated successfully!");

        navigateToNextPage();
        
    } catch (error) {
        console.log("Error updating user information:", error);
    }
});


function navigateToNextPage() {
    window.location.href = './../../index.html';
}