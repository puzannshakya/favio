signin.addEventListener('click', async(e) => {
    // alert("hello");
    const signInEmail = email.value;
    const signInPassword = password.value;
    const isDriver = document.querySelector('input[name="driver"]:checked');
    const isDriverFlag = isDriver.value === "yes" ? true : false;


    firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword)
    .then((userCredential) => {
        // alert("You have signed in successfully!");
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



  // Register Service Worker when window load event happen
window.addEventListener('load', async () => {
  // does the browser support service workers?
  if ('serviceWorker' in navigator) {
      // then register our service worker
    try {
      const reg = await  navigator.serviceWorker.register('./../../sw.js', { scope: '/' });
      // display a success message
      console.log(`Service Worker is Registered:`, reg);
    } catch(error) {
      // display an error message
      console.log(`Service Worker Error (${error})`);
    };

    // ready is a Promise that never rejects and resolved when the service worker is active. 
    const active = await navigator.serviceWorker.ready;
    // we have an active service worker working for us
    console.log(`Service Worker is Active:`, active);
    // At this point, you can call methods that require an active service worker,
    // like registration.pushManager.subscribe() for push notification
  } else {
    // happens when the app isn't served over a TLS connection (HTTPS)
    console.warn('Service Worker is not available');
  }
})
  