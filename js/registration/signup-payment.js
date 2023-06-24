const login_payment = document.getElementById('login_payment');

login_payment.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userDocId =   sessionStorage.getItem("userDocId");
    const isDriver = sessionStorage.getItem("isDriver");

    console.log(userDocId);
    console.log(isDriver);
    


    const payment_method = document.getElementById('payment_method').value;
    const card_number = document.getElementById('card_number').value;
    const card_holder_name = document.getElementById('card_holder_name').value;
    const expiry_date = document.getElementById('expiry_date').value;
    const cvc = document.getElementById('cvc').value;

    try {
        await firebase.firestore().collection("users_tests").doc(userDocId).update({
            payment_method,
            card_number,
            card_holder_name,
            expiry_date,
            cvc
        });
        alert("User information updated successfully!");

        navigateToNextPage(isDriver);
        
    } catch (error) {
        console.log("Error updating user information:", error);
    }
});


function navigateToNextPage(isDriver) {
    console.log(isDriver);
    if(isDriver === "yes"){
        window.location.href = './select-vehicle-driver.html';
    }else{
        window.location.href = './../../index.html';
    }
  
}