signin.addEventListener('click', async(e) => {
    alert("hello");
    const signInEmail = email.value;
    const signInPassword = password.value;
    const isDriver = document.querySelector('input[name="driver"]:checked');
    const isDriverFlag = isDriver.value === "yes" ? true : false;


    firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword)
    .then((userCredential) => {
        alert("You have signed in successfully!");
       sessionStorage.setItem("userDocId",userCredential.user.uid);
       sessionStorage.setItem("isDriver",isDriver.value);
     
       if(isDriver.value === "yes"){
        window.location.href = "./../../pages/delivery_request_seeker/delivery_request_rider.html";       
       }else{
        window.location.href = "./../../pages/delivery_request_seeker/delivery_request_seeker.html";
       }
      
       
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
    })
});


signup.addEventListener('click', async(e) => {
    e.preventDefault();
    window.location.href = "./../../pages/registration/signup.html";
});