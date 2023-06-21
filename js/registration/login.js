signin.addEventListener('click', async(e) => {
    alert("hello");
    const signInEmail = email.value;
    const signInPassword = password.value;


    firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword)
    .then((userCredential) => {
        alert("You have signed in successfully!");
       sessionStorage.setItem("uid",userCredential.user.uid);
     
       window.location.href = "./../../pages/delivery_request_seeker/delivery_request_seeker.html";
       
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