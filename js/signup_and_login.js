signin.addEventListener('click', async(e) => {
    alert("hello");
    const signInEmail = email.value;
    const signInPassword = password.value;
    alert(signInEmail);
    alert(signInPassword);

    firebase.auth().signInWithEmailAndPassword(signInEmail, signInPassword)
    .then((userCredential) => {
       sessionStorage.setItem("uid",userCredential.user.uid);
       window.location.href = "./../pages/home.html";
        const user = userCredential.user;
        alert("You have signed in successfully!");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage)
    })
});


signup.addEventListener('click', async(e) => {
    e.preventDefault();
alert("bro");
});