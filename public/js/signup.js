// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { EmailAuthProvider, getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, ref, push, set, onValue, onChildAdded, remove, onChildRemoved} 
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD3aSCovpmTN7N4Tc3olFuhDsh-pcRdUkE",
    authDomain: "farmers-match.firebaseapp.com",
    databaseURL: "https://farmers-match-default-rtdb.firebaseio.com",
    projectId: "farmers-match",
    storageBucket: "farmers-match.firebasestorage.app",
    messagingSenderId: "353551545898",
    appId: "1:353551545898:web:74a7e1739018c5304d3553",
    measurementId: "G-Z8FV5JX0N4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getDatabase(app);


$('#submit').on('click', function() {
    let email = $('#email').val();
    let password = $('#password').val();
    let name = $('#name').val();
    let postcode = $('#postcode').val();
    let prefectures = $('#prefectures').val();
    let municipalities = $('#municipalities').val();
    let street = $('#street').val();
    let crop = $('#crop').val();
    let category = $('#category').val();
    console.log(email)
    console.log(password)
    createUserWithEmailAndPassword (auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      const uid = user.uid;
      console.log(uid);
      // データベース登録
      let msg = {
        uid: uid,
        email: email,
        postcode: postcode,
        prefectures: prefectures,
        municipalities: municipalities,
        street: street,
        crop: crop,
        name: name
      }
      let dbRef = ref(db, category+"/"+uid+"/info/");
      console.log(dbRef)
      set(dbRef, msg);
      // ホームへ移動
      
      setTimeout(function() {
        if(category == "markets"){
          location.href="market_home.html";
        }else{
          location.href="farmer_home.html";
        }
      }, 1000);
    return false;
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
    return false;
});

$('#signout').on('click', function(){
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log("signout");
        location.href="index.html";
    }).catch((error) => {
        // An error happened.
    });
});