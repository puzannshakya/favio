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
        // alert("User information updated successfully!");

        navigateToNextPage();
        
    } catch (error) {
        console.log("Error updating user information:", error);
    }
});


function navigateToNextPage() {
    window.location.href = './../../index.html';
}

document.addEventListener('DOMContentLoaded', function () {
    // Get all radio buttons with name="vehicle"
    const vehicleRadios = document.querySelectorAll('input[name="vehicle"]');

    // Add a click event listener to each radio button
    vehicleRadios.forEach(function (radio) {
        radio.addEventListener('click', function () {
            // Remove "checked" class from all divs inside .favio_SelectVehicle
            const divs = document.querySelectorAll('.favio_SelectVehicle div');
            divs.forEach(function (div) {
                div.classList.remove('checked');
            });

            // If the radio button is checked, add the "checked" class to the corresponding div
            if (radio.checked) {
                radio.parentNode.classList.add('checked');
            }
        });
    });
});






