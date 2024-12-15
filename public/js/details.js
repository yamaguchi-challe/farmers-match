import { initializeApp } from "https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js";
import { EmailAuthProvider, getAuth, signOut, onAuthStateChanged, createUserWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js";
import { getDatabase, ref, query, push, set, update, child, onValue, onChildAdded, remove, onChildRemoved, onChildChanged, orderByChild, equalTo, startAt} 
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
let id;

$(document).ready(function(){
    uid = localStorage.getItem('uid')
    let userRef = ref(db, "markets/"+uid);
    //ユーザ情報の取得
    onChildAdded(userRef, function (snapshot) {
        name = snapshot.val().name;
        $("#nav-name").text(name+" 様")
    });

    const urlParams = new URLSearchParams(window.location.search)
    id = urlParams.get("orderid")
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
        }else if (data == "[object Object]") {
            console.log(data)
            let farmerName = data.name
            let farmerUid = data.uid
            let price = data.price
            let quantity = data.quantity
            let time = data.time
            let status = data.status
            if(status == "requested"){
                let newCard = createRequestedCard(id, key, farmerName, farmerUid, price, quantity, time, counter)
                $("#output").append(newCard);
            } else {
                let newCard = createCard(id, key, farmerName, farmerUid, price, quantity, time, counter)
                $("#output").append(newCard);
            }
            counter++;
        }
    });
});

function createCard(id, key, farmerName, farmerUid, price, quantity, time, counter){
    const formText = `<div class="card">
                <div class="card-header cursor-pointer">
                    <h5 class="mb-0">${farmerName} 様</h5>
                </div>
                <div class="card-body">
                    <form>
                        <p>出荷量 ${quantity}kg</p>
                        <p>単価 ${price}円/kg</p>
                        <p>出荷目安時刻 ${millisecondsToFormattedDate(time)}</p>
                        <p>合計金額 ${quantity*price}円</p>
                        <input type="hidden" class="form-control" id="id" name="id" value=${id}>
                        <input type="hidden" class="form-control" id="key" name="key" value=${key}>
                        <input type="hidden" class="form-control" id="farmerUid" name="farmerUid" value=${farmerUid}>
                        <button type="submit" class="btn btn-primary">出荷を依頼する</button>
                    </form>
                </div>
            </div>`;
    const card = $(formText);
    return card
}

function createRequestedCard(id, key, farmerName, farmerUid, price, quantity, time, counter){
    const formText = `<div class="card">
                <div class="card-header cursor-pointer">
                    <h5 class="mb-0">${farmerName} 様</h5>
                </div>
                <div class="card-body">
                    <form>
                        <p>出荷量 ${quantity}kg</p>
                        <p>単価 ${price}円/kg</p>
                        <p>出荷目安時刻 ${time}</p>
                        <p>合計金額 ${quantity*price}円</p>
                        <input type="hidden" class="form-control" id="id" name="id" value=${id}>
                        <input type="hidden" class="form-control" id="key" name="key" value=${key}>
                        <input type="hidden" class="form-control" id="farmerUid" name="farmerUid" value=${farmerUid}>
                        <button type="submit" class="btn btn-secondary" disabled>依頼済み</button>
                    </form>
                </div>
            </div>`;
    const card = $(formText);
    return card
}

$("#output").on('submit', 'form', function(event) {
    event.preventDefault();  // フォームのデフォルト送信を防止
    // 入力内容を取得
    const id = $(this).find('input[name="id"]').val();
    const farmerUid = $(this).find('input[name="farmerUid"]').val();
    const key = $(this).find('input[name="key"]').val();
    //データベース登録
    let msg = {
        status: "requested",
    }
    let dbRef = ref(db, "orders/"+id+"/"+key);
    update(dbRef, msg);
    console.log($(this).find('button')[0].disabled)
    $(this).find('button')[0].disabled = true;
    $(this).find('button')[0].classList.remove('btn-primary');
    $(this).find('button')[0].classList.add('btn-secondary');
    $(this).find('button')[0].textContent = "依頼済み"
    alert("出荷を依頼しました");
});

$("#end").on("click", function(){
    let dbRef = ref(db, "orders/"+id);
    remove(dbRef);
    window.history.back();
})

function millisecondsToFormattedDate(milliseconds) {
    const date = new Date(milliseconds);

    const month = String(date.getMonth() + 1).padStart(2, '0'); // ゼロ埋め
    const day = String(date.getDate()).padStart(2, '0'); // ゼロ埋め
    const hours = String(date.getHours()).padStart(2, '0'); // ゼロ埋め
    const minutes = String(date.getMinutes()).padStart(2, '0'); // ゼロ埋め

    return `${month}月${day}日 ${hours}時${minutes}分`;
}