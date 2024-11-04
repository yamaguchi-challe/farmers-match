// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);

// UIの初期化
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
  signInFlow: 'popup',
  signInSuccessUrl: './',
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false
    }
  ]
});

// サインアウト
function signout() {
  firebase.auth().signOut()
    .then(() => {
      console.log('Signed out')
    })
}

// サインイン状態
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    document.getElementById('sign-in-status').innerText = 'Signed in'
    document.getElementById('sign-out').style.display = 'block'
  } else {
    document.getElementById('sign-in-status').innerText = 'Signed out'
    document.getElementById('sign-out').style.display = 'none'
  }
})