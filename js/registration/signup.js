const db = firebase.firestore();
console.log(db);

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

        const userDocId = await createUserDocument(name, email, phone, dob, isDriverFlag, userCredential.user.uid, file);

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

async function createUserDocument(name, email, phone, dob, isDriverValue, uid) {
    const docRef = firebase.firestore().collection("users_tests").doc(uid);
    await docRef.set({
        uid: uid,
        user_name: name,
        email: email,
        phone: phone,
        dob: dob,
        isDriver: isDriverValue,
        userDocId: docRef.id
    });
    if (imageFile) {
        const filename = 'profile/' + Date.now() + '.png';
        // Convert the image to a Blob
        const blob = new Blob([imageFile], { type: imageFile.type });
    
        // Upload the Blob to Firebase Storage
        const storageRef = firebase.storage().ref(filename);
        const uploadTask = storageRef.put(blob);
    
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Handle upload progress if needed
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload progress:', progress.toFixed(2) + '%');
          },
          (error) => {
            console.log('Error:', error);
          },
          () => {
            // Upload complete, get the download URL
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
              console.log('File available at:', downloadURL);
    
              // Update the user document with the image download URL
              docRef.update({
                img: downloadURL,
              })
              .then(() => {
                console.log('Download URL stored');
              })
              .catch((error) => {
                console.log('Error storing download URL:', error);
              });
            });
          }
        );
      }
    
    return docRef.id;
}

function navigateToNextPage() {
    window.location.href = './../../pages/registration/select-vehicle-driver.html';
}







  
var loadFile = function(event) {
    var image = document.getElementById('output');
    image.src = URL.createObjectURL(event.target.files[0]);
    const file = event.target.files[0];
    const filename = 'profile/' + Date.now() + '.png';
  
    // Convert the image to a Blob
    const blob = new Blob([file], { type: file.type });

    // Upload the Blob to Firebase Storage
    const storageRef = firebase.storage().ref(filename);
    const uploadTask = storageRef.put(blob);

    // uploadTask.on(
    //   'state_changed',
    //   (snapshot) => {
    //     // Handle upload progress if needed
    //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //     console.log('Upload progress:', progress.toFixed(2) + '%');
    //   },
    //   (error) => {
    //     console.log('Error:', error);
    //   },
    //   () => {
    //     // Upload complete, get the download URL
    //     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
    //       console.log('File available at:', downloadURL);
  
    //       // Store the download URL in Firebase Firestore
    //       const db = firebase.firestore();
    //       const uid = "replace_with_your_user_id"; // Replace this with the actual user ID
    //       db.collection('users_tests').doc(uid).update({
    //         img: downloadURL,
    //       })
    //       .then(() => {
    //         console.log('Completed Image Src');
    //         console.log('Download URL stored');
    //       })
    //       .catch((error) => {
    //         console.log('Error storing download URL:', error);
    //       });
    //     });
    //   }
    // );
  }