import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { EmailAuthProvider, getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, ref, query, push, set, child, onValue, onChildAdded, remove, onChildRemoved, onChildChanged, orderByChild, equalTo, startAt} 
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-database.js";

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
let uid;
let name;

$(document).ready(function(){
    uid = localStorage.getItem('uid')
    let userRef = ref(db, "markets/"+uid);
    //ユーザ情報の取得
    onChildAdded(userRef, function (snapshot) {
        name = snapshot.val().name;
        $("#nav-name").text(name+" 様")
    });

    const urlParams = new URLSearchParams(window.location.search)
    let id = urlParams.get("orderid")
    console.log(id)
    let dbRef = ref(db, "orders/"+id);
    let counter = 1
    onChildAdded(dbRef, function (snapshot) {
        const data = snapshot.val()
        const key = snapshot.key
        console.log(snapshot.key + ":" + data)
        if(key == "crop"){
            //タイトルの表示
            $("#order_title").text(data+"の出荷が可能な生産者")
        }else if (key.startsWith('-')) {
            console.log(data)
            let farmerName = data.name
            let farmerUid = data.uid
            let price = data.price
            let quantity = data.quantity
            let time = data.time
            const newCard = createCard(farmerName, farmerUid, price, quantity, time, counter)
            $("#output").append(newCard);
            counter++;
        }
    });
});

function createCard(farmerName, farmerUid, price, quantity, time, counter){
    const formText = `<div class="card">
                <div class="card-header cursor-pointer">
                    <h5 class="mb-0">${farmerName} 様</h5>
                </div>
                <div class="card-body">
                    <p>出荷量 ${quantity}kg</p>
                    <p>単価 ${price}円/kg</p>
                    <p>出荷目安時刻 ${time}</p>
                    <p>合計金額 ${quantity*price}円</p>
                    <button type="submit" class="btn btn-primary">出荷を依頼する</button>
                </div>
            </div>`;
    const card = $(formText);
    return card
}