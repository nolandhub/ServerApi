// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyA5DUcYsW_wBSP34rEnFFK8gQVSZoFWyFw",
    authDomain: "bus-ticket-mazl.firebaseapp.com",
    projectId: "bus-ticket-mazl",
    storageBucket: "bus-ticket-mazl.firebasestorage.app",
    messagingSenderId: "167317050615",
    appId: "1:167317050615:web:4e4958a2fcea37fba92ff2",
    measurementId: "G-0Z8LTS7V5N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


export { db };