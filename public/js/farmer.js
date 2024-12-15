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
let crop;

//ナビゲーションバーにユーザ名を表示
$(document).ready(function(){
    uid = localStorage.getItem('uid')
    let dbRef = ref(db, "farmers/"+uid);
    //ユーザ情報の取得
    onChildAdded(dbRef, function (snapshot) {
        console.log(snapshot.val().name)
        name = snapshot.val().name;
        crop = snapshot.val().crop;
        $("#nav-name").text(name+" 様")
        $("#order_title").text(crop+"のオーダー一覧")
    });

    //オーダー一覧の取得
    let orderRef = query(ref(db, 'orders'));
    let counter = 1
    onChildAdded(orderRef, function (snapshot) {
        const key = snapshot.key
        const data = snapshot.val()
        //自分の登録した作物のみ
        if(data.crop == crop){
            let regist = false;
            //未応募
            const today = new Date();
            if(today.getTime() >= data.time){
                //締め切りが過ぎているオーダーを削除
                let dbRef = ref(db, "orders/"+key);
                remove(dbRef)
            }else if(data[uid] == undefined){
                const newCard = createCard(key, data.name, data.nowDate, counter);
                $("#output").append(newCard);
            }else{
                const registData = data[uid]
                console.log(registData)
                if(registData.status == "requested"){
                    const newTaskCard = createTaskCard(key, uid, data.name, data.marketUid, registData.quantity, registData.time)
                    $("#task").append(newTaskCard);
                }
            }
            counter++;
        }
    });
});

function createTaskCard(id, key, name, marketUid, quantity, time){
    const formText = `<div class="card">
                <div class="card-header cursor-pointer">
                    <h5 class="mb-0">${name} への出荷</h5>
                </div>
                <div class="card-body">
                    <form>
                        <p>出荷量 ${quantity}kg</p>
                        <p>出荷目標時刻 ${millisecondsToFormattedDate(time)}</p>
                        <input type="hidden" class="form-control" id="id" name="id" value=${id}>
                        <input type="hidden" class="form-control" id="key" name="key" value=${key}>
                        <button type="submit" class="btn btn-primary">出荷完了</button>
                    </form>
                </div>
            </div>`;
    const card = $(formText);
    return card
}

function createCard(key, title, time, counter){
    const formatTime = millisecondsToFormattedDate(time)
    const formText = `<div class="card" id="formContainer1">
            <div class="card-header cursor-pointer">
                <h5 class="mb-0">${title}</h5>
            </div>
            <div class="form-wrapper" id="formWrapper${counter}">
                <div class="card-body">
                    <form id="myForm${counter}">
                        <div class="form-group mb-4">
                            <label for="quantity" class="form-label fw-bold">数量</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="quantity" name="quantity"required>
                                <div class="input-group-append">
                                    <span class="input-group-text">kg</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb-4">
                            <label for="price" class="form-label fw-bold">単価</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="price" name="price"required>
                                <div class="input-group-append">
                                    <span class="input-group-text">円/kg</span>
                                </div>
                            </div>
                        </div>
                        <div class="form-group mb-4">
                            <label for="time" class="form-label fw-bold">出荷予定時刻</label>
                            <div class="input-group">
                                <input type="time" class="form-control" id="time" name="time" required>
                            </div>
                        </div>
                        <input type="hidden" class="form-control" id="orderid" name="orderid" value=${key}>
                        <button type="submit" class="btn btn-primary">送信</button>
                    </form>
                </div>
            </div>
        </div>`;
    const card = $(formText);
    return card
}

function millisecondsToFormattedDate(milliseconds) {
    const date = new Date(milliseconds);

    const month = String(date.getMonth() + 1).padStart(2, '0'); // ゼロ埋め
    const day = String(date.getDate()).padStart(2, '0'); // ゼロ埋め
    const hours = String(date.getHours()).padStart(2, '0'); // ゼロ埋め
    const minutes = String(date.getMinutes()).padStart(2, '0'); // ゼロ埋め

    return `${month}月${day}日 ${hours}時${minutes}分`;
}

// card-headerをクリックしたときの処理
$('#output').on('click', '.card-header', function() {
    let $formWrapper = $(this).closest('.card').find('.form-wrapper');
    // 他のフォームを閉じる
    $('.form-wrapper').not($formWrapper).removeClass('show').css('max-height', '0');
    // フォームの開閉トグル
    if ($formWrapper.hasClass('show')) {
        $formWrapper.removeClass('show').css('max-height', '0');
    } else {
        $formWrapper.addClass('show').css('max-height', '500px'); 
    }
});

$("#output").on('submit', 'form', function(event) {
    event.preventDefault();  // フォームのデフォルト送信を防止
    // 入力内容を取得
    const quantity = $(this).find('input[name="quantity"]').val();
    const price = $(this).find('input[name="price"]').val();
    const time = $(this).find('input[name="time"]').val();
    const [hours, minutes] = time.split(':').map(Number);
    const today = new Date();
    today.setHours(hours, minutes, 0, 0);
    const milliseconds = today.getTime();
    const key = $(this).find('input[name="orderid"]').val();
    const nowDate = new Date();
    //データベース登録
    let msg = {
        uid: uid,
        name: name,
        price: price,
        quantity: quantity,
        time: milliseconds,
        nowDate: nowDate.getTime(),
    }
    let dbRef = ref(db, "orders/"+key+"/"+uid);
    set(dbRef, msg);
    alert("オーダーを登録しました。");
    $(this).find('input[name="quantity"]').val("");
    $(this).find('input[name="price"]').val("");
    $(this).find('input[name="time"]').val("");
});

$("#task").on('submit', 'form', function(event) {
    event.preventDefault();  // フォームのデフォルト送信を防止
    // 入力内容を取得
    const id = $(this).find('input[name="id"]').val();
    const key = $(this).find('input[name="key"]').val();
    //データベース登録
    let msg = {
        status: "complete",
    }
    let dbRef = ref(db, "orders/"+id+"/"+key);
    update(dbRef, msg);
    alert("出荷ありがとうございました");
    window.location.reload();
});


// サインアウト
$('#signout').on('click', function(){
    signOut(auth).then(() => {
        // Sign-out successful.
        localStorage.removeItem('uid');
        location.href="index.html"
    }).catch((error) => {
    // An error happened.
    });
});