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

        const documentId = await createUserDocument(name, email, phone, dob, isDriver.value, userCredential.user.uid);

        console.log(documentId);

        sessionStorage.setItem("uid", userCredential.user.uid);

        navigateToNextPage(documentId);

        alert("Your account has been created!");
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

async function createUserDocument(name, email, phone, dob, isDriverValue, userId) {
    const docRef = firebase.firestore().collection("users_tests").doc();
    await docRef.set({
        id: docRef.id,
        user_name: name,
        email: email,
        phone: phone,
        dob: dob,
        isDriver: isDriverValue,
        userId: userId
    });
    return docRef.id;
}

function navigateToNextPage(documentId) {
    window.location.href = './../../pages/registration/signup-payment.html?documentId=' + documentId;
}