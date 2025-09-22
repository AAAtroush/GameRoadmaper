import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, addDoc, getDoc, setDoc} 
from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";


const firebaseConfig = {
    apiKey: "AIzaSyAzzG05ZsZAtdtZc_1QCqAyNdy6a9zrn0k",
    authDomain: "gameroadmaper.firebaseapp.com",
    projectId: "gameroadmaper",
    storageBucket: "gameroadmaper.firebasestorage.app",
    messagingSenderId: "1012222496979",
    appId: "1:1012222496979:web:6fdb2c6ddd951bf3534426",
    measurementId: "G-9B1VMP7NV7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("Firebase connected");
const auth = getAuth();
let currentUser = null;
const userDisplay = document.getElementById("userDisplay");
let globalBookMarks = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
    currentUser = user;
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        const defaultUsername = user.email.split("@")[0];
        await setDoc(userRef, { username: defaultUsername, bio: "", email: user.email });
    } 
    userDisplay.textContent = userDoc.data().username;
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.style.marginLeft = "10px";
    logoutBtn.addEventListener("click", () => {
        auth.signOut().then(() => window.location.href = "login.html");
    });
    userDisplay.appendChild(logoutBtn);
    userDisplay.style.margin = "10px";



    let bookmarks = [];
    if (user){
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then(userDoc =>{
            if(userDoc.exists()){
                bookmarks = userDoc.data().bookmarks;
            }
            else{
                setDoc(userRef, {bookmarks: [], email: user.email})
            }
            globalBookMarks = bookmarks;
            loadPosts(globalBookMarks);
        })
    }
});

const searchBar = document.querySelector(".searchbar");
searchBar.addEventListener("input", (e) => {
    const queryText = e.target.value.toLowerCase();
    loadPosts(globalBookMarks, queryText);
});


function loadPosts(bookmarks, filter = "") {
    let q = collection(db, "posts");
    

    getDocs(q).then(function(bundle) {
        const main = document.getElementById("main");

        if(bookmarks.length > 0 ){
            main.innerHTML = "<h1>Your Bookmarks</h1>";
        }

        
        bundle.forEach(function(doc) {
            if(bookmarks.includes(doc.id)){
                const post = doc.data();
                if(post.title.toLowerCase().includes(filter) || post.description.toLowerCase().includes(filter)){
                    let bookmarkText = "🔖 Bookmark";
                    bookmarkText = "✅ Bookmarked";
                    const div = document.createElement("div");
                    div.className = "post";
                    div.innerHTML =
                        "<div class='meta'>" + post.author + " /" + post.game + "</div>" +
                        "<h3>" + post.title + "</h3>" +
                        "<p>" + post.description + "</p>" +
                        "<div class='votes'>" +
                        "<button class = 'downvote'>👎 " + post.downvotes + "</button>" +
                        "<button class = 'upvote'>👍 " + post.upvotes + "</button>" +
                        "<button class='bookmark'>" + bookmarkText + "</button>" +
                        "</div>";
        
                
                    const bookmarkBtn = div.querySelector(".bookmark");
        
                    bookmarkBtn.addEventListener("click", function() {
                        toggleBookmark(doc.id, bookmarkBtn);
                    });
        
                    main.appendChild(div);
                }
            }
        });
    });
}

const profileBtn = document.getElementById("profileBtn");
const homeBtn = document.getElementById("home");
const homeBtn2 = document.getElementById("homeBtn");

profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
});

homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
homeBtn2.addEventListener("click", () => {
    window.location.href = "index.html";
});


function toggleBookmark(postId, Btn){
    const userRef = doc(db, "users", currentUser.uid); 
    let bookmarks = [];
    getDoc(userRef).then(userDoc =>{
        //keda keda m3mool declare on reload
        bookmarks = userDoc.data().bookmarks;

        if(bookmarks.includes(postId)){
            const index = bookmarks.indexOf(postId);
            if(index > -1) bookmarks.splice(index, 1);
            Btn.textContent = "🔖 Bookmark";
        }
        else{
            bookmarks.push(postId);
            Btn.textContent = "✅ Bookmarked";
        }
        
        updateDoc(userRef, {bookmarks: bookmarks }).then(() => {
            globalBookMarks = bookmarks;
        });
    })
}



