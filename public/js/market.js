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

//ナビゲーションバーにユーザ名を表示
$(document).ready(function(){
    uid = localStorage.getItem('uid')
    console.log(uid)
    let dbRef = ref(db, "markets/"+uid);
    onChildAdded(dbRef, function (snapshot) {
        console.log(snapshot.val().name)
      name = snapshot.val().name;
      $("#nav-name").text(name+"様")
    });
});

//オーダー一覧の表示
// let orderRef = query(ref(db, 'orders'), orderByChild("uid"), equalTo(""));
let orderRef = query(ref(db, 'orders'), orderByChild("time"));
onChildAdded(orderRef, (snapshot) => {
    const key = snapshot.key
    const data = snapshot.val()
    //自分のオーダーのみ
    if(data.uid == uid){
        const newCard = createCard(data.crop, data.nowDate)
        $("#output").append(newCard)
    }
});

$('#submit').on('click', function() {
    let crop = $('#crop').val();
    let quantity = $('#quantity').val();
    let time = $('#time').val();
    let nowDate = new Date();
    //データベース登録
    let msg = {
        uid: uid,
        crop: crop,
        quantity: quantity,
        time: time,
        nowDate: nowDate.getTime(),
        name: name
    }
    let newPostKey = push(child(ref(db), 'orders')).key;
    let dbRef = ref(db, "orders/"+newPostKey);
    set(dbRef, msg);
    alert("オーダーを登録しました。");
    //フォームの初期化
    $('#crop').val("")
    $('#quantity').val("")
    $('#time').val("")
    return false;
});

function createCard(title, time){
    const formatTime = millisecondsToFormattedDate(time)
    return $('<div class="card">')
        .append($('<h4 class="card-title">').text(title)) // タイトル
        .append($('<div class="time">').text(formatTime)); // 説明
}

function millisecondsToFormattedDate(milliseconds) {
    const date = new Date(milliseconds);

    const month = String(date.getMonth() + 1).padStart(2, '0'); // ゼロ埋め
    const day = String(date.getDate()).padStart(2, '0'); // ゼロ埋め
    const hours = String(date.getHours()).padStart(2, '0'); // ゼロ埋め
    const minutes = String(date.getMinutes()).padStart(2, '0'); // ゼロ埋め

    return `${month}月${day}日 ${hours}時${minutes}分`;
}

$('#signout').on('click', function(){
    signOut(auth).then(() => {
        // Sign-out successful.
        localStorage.removeItem('uid');
        location.href="index.html"
    }).catch((error) => {
    // An error happened.
    });
});