const db = firebase.firestore();
console.log(db);
var downloadUrl="";

const signupForm = document.getElementById('signup');
signupForm.addEventListener('submit', handleSignup);

async function handleSignup(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const dobDate = new Date(dob).getFullYear();
    const today = new Date().getFullYear();
    const age = today - dobDate;

    const password = document.getElementById('password').value;
    const isDriver = document.querySelector('input[name="driver"]:checked');
    const confirmPassword = document.getElementById('confirm-password').value;

    if (!checkPasswordMatch(password, confirmPassword)) {
        alert("The password you have entered doesn't match");
        return;
    }

    if (!checkEmailFormat(email)) {
        alert("Invalid email format");
        return;
    }

    if (!checkAgeEligibility(isDriver, age)) {
        alert("You are not eligible");
        return;
    }

    try {
        const existingEmail = await checkExistingEmail(email);
        if (existingEmail) {
            alert('Email already exists');
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(email, password);
        const isDriverFlag = isDriver.value === "yes" ? true : false;
        console.log(`isDriver:${isDriver}`);
        console.log(`isDriverFlag:${isDriverFlag}`);

        const userDocId = await createUserDocument(name, email, phone, dob, isDriverFlag, userCredential.user.uid, downloadUrl);

        console.log(userDocId);

        sessionStorage.setItem("userDocId",userDocId);
        sessionStorage.setItem("isDriver",isDriver.value);

        navigateToNextPage();

        // alert("Your account has been created!");
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);
    }
}

function checkPasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

function checkEmailFormat(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function checkAgeEligibility(isDriver, age) {
    return isDriver && age >= 18 || !isDriver && age >= 12;
}

async function checkExistingEmail(email) {
    const existingEmail = await firebase.auth().fetchSignInMethodsForEmail(email);
    return existingEmail.length > 0;
}

async function createUserWithEmailAndPassword(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

async function createUserDocument(name, email, phone, dob, isDriverValue, uid,downloadUrl) {
    const docRef = firebase.firestore().collection("users_tests").doc(uid);
    await docRef.set({
        uid: uid,
        user_name: name,
        email: email,
        phone: phone,
        dob: dob,
        isDriver: isDriverValue,
        userDocId: docRef.id,
        img: downloadUrl
    });

    return docRef.id;
}

function navigateToNextPage() {
    window.location.href = './../../pages/registration/select-vehicle-driver.html';
}



var loadImgBtn = document.getElementById('loadimgbtn');
var imageOutput = document.getElementById('output');

  
var loadFile = function(event) {
  var file = event.target.files[0];
  var image = document.getElementById('output');

  // Initialize Firebase Storage
  var storageRef = firebase.storage().ref("profile/");
  var imageName = `${Date.now()}.jpg`; // Set the desired image name in the storage.

  // Upload the file to Firebase Storage.
  var uploadTask = storageRef.child(imageName).put(file);

  // Monitor the upload progress.
  uploadTask.on('state_changed',
    function(snapshot) {
      // You can track the upload progress here.
      console.log('uploading')
    },
    function(error) {
      // Handle any errors during the upload.
      console.error('Error uploading image:', error);
    },
    function() {
      // Upload complete. Get the download URL of the image and save it to Firestore.
    var downloadURL=  uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
        // Save the downloadURL to Firestore.

        // Display the uploaded image on the page.
        image.src = downloadURL;
        downloadUrl =downloadURL;

        imageOutput.style.display = "block";
        loadImgBtn.style.display = "none";
      }).catch(function(error) {
        // Handle any errors while getting the download URL.
        console.error('Error getting download URL:', error);
      });
    }
  );
};