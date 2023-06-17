var db = firebase.firestore();
console.log(db);


var signup = document.getElementById('signup');

signup.addEventListener('submit', async(e) => {
    e.preventDefault();

    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var phone = document.getElementById('phone').value;
    var dob = document.getElementById('dob').value;
    var password = document.getElementById('password').value;
    var isDriver = document.querySelector('input[name="driver"]:checked');
    var confirmPassword = document.getElementById('confirm-password').value;
    if (password == confirmPassword) {


        firebase.auth().createUserWithEmailAndPassword(email,password   )

            .then((userCredential) => {
                firebase.firestore().collection("users_tests").doc().set({
                    user_name: name,
                    email: email,
                    phone: phone,
                    dob: dob,
                    isDriver: isDriver.value,
                    userId: userCredential.user.uid

                });
                const user = userCredential.user;
                console.log(user);
                alert("Your account has been created!");
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage)
            })
    }

    else {
        console.log("error");
    }
});