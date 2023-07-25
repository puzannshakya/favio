function logoutFunc(e){
    console.log("logout");
    e.preventDefault();
    firebase.auth().signOut()
        .then(() => {
            // Clear session storage or any other necessary cleanup
            sessionStorage.clear();
            // alert("You have signed out successfully!");
            // Redirect to the login page or any other desired destination
            window.location.href = "./../../index.html";
        })
        .catch((error) => {
            console.log(error);
        });
}