// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { EmailAuthProvider, getAuth, signOut, onAuthStateChanged, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD3aSCovpmTN7N4Tc3olFuhDsh-pcRdUkE",
  authDomain: "farmers-match.firebaseapp.com",
  projectId: "farmers-match",
  storageBucket: "farmers-match.firebasestorage.app",
  messagingSenderId: "353551545898",
  appId: "1:353551545898:web:74a7e1739018c5304d3553",
  measurementId: "G-Z8FV5JX0N4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

$('#submit').on('click', function() {
  let email = $('#email').val();
  let password = $('#password').val();
  console.log(email)
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    location.href="home.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });
  return false;
});