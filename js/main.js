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
       

        firebase.auth().createUserWithEmailAndPassword(email,password)
            
            .then((userCredential) => {
                const doc_ref = firebase.firestore().collection("users_tests").doc();
                const documentId= doc_ref.id;
                doc_ref.set({
                    id:doc_ref.id,
                    user_name: name,
                    email: email,
                    phone: phone,
                    dob: dob,
                    isDriver: isDriver.value,
                    userId: userCredential.user.uid
                }).then(() => {
                    navigateToNextPage(documentId);
                }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode + errorMessage)
            });

                    console.log(doc_ref.id);

                  const userId = userCredential.user.uid;
              
                sessionStorage.setItem("uid",userCredential.user.uid);
                         
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



function navigateToNextPage(documentId) {
    window.location.href = '../login-payment.html?documentId=' + documentId;
}

