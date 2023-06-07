// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCp-fSR5TCp7gMZGO96DHLKtaJLISFsQdQ",
    authDomain: "favio-6345f.firebaseapp.com",
    projectId: "favio-6345f",
    storageBucket: "favio-6345f.appspot.com",
    messagingSenderId: "58244825457",
    appId: "1:58244825457:web:b7e9404f0df998dc10b6d0",
    measurementId: "G-1F3R2JMW0L"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const db = getFirestore(app);