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

const userDisplay = document.getElementById("userDisplay");
let globalBookMarks = [];

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
    }
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        const defaultUsername = user.email.split("@")[0];
        await setDoc(userRef, { username: defaultUsername, bio: "", email: user.email, bookmarks: [] });
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

        main.innerHTML = "";

        bundle.forEach(function(doc) {
            const post = doc.data();
            if(post.title.toLowerCase().includes(filter) || post.description.toLowerCase().includes(filter)){
                let bookmarkText = "🔖 Bookmark";
                if(bookmarks.includes(doc.id)){
                    bookmarkText = "✅ Bookmarked";
                }
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
    
                const upBtn = div.querySelector(".upvote");
                const downBtn = div.querySelector(".downvote");
                const bookmarkBtn = div.querySelector(".bookmark");
    
                upBtn.addEventListener("click", function() {
                    vote(doc.id, "upvotes", post.upvotes, upBtn, post);
                })
                downBtn.addEventListener("click", function() {
                    vote(doc.id, "downvotes", post.downvotes, downBtn, post);
                })
                bookmarkBtn.addEventListener("click", function() {
                    toggleBookmark(doc.id, bookmarkBtn);
                });
    
                main.appendChild(div);
            }
        });
    });
}

function vote(postId, key, curVotes, Btn, post) {
    const user = auth.currentUser;
    if (!user) return;

    const ref = doc(db, "posts", postId);

    if (!post.voters) {
        post.voters = {};
    }

    if (post.voters[user.uid]) {
        alert("You already voted for this post!");
        return;
    }

    if (key == "upvotes") {
        post.voters[user.uid] = "up";
    } else {
        post.voters[user.uid] = "down";
    }
    updateDoc(ref, {
        [key]: curVotes+1,
        voters: post.voters
    }).then(() => {
        alert("Thank you for your voting");
        post[key] = curVotes+1;
        if (key == "upvotes") {
            Btn.textContent = "👍 " + post.upvotes;
        } else {
            Btn.textContent = "👎 " + post.downvotes;
        }
    });
}


const reportBtn = document.getElementById("reportBtn");
const reportForm = document.getElementById("reportForm");
const reportModal = document.getElementById("reportDiv");
const closeModal = document.getElementById("closeReportDiv");

const profileBtn = document.getElementById("profileBtn");
const homeBtn = document.getElementById("home");
const homeBtn2 = document.getElementById("homeBtn");
const bookmarksBtn = document.getElementById("bookmarksBtn");

profileBtn.addEventListener("click", () => {
    window.location.href = "profile.html";
});

homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
homeBtn2.addEventListener("click", () => {
    window.location.href = "index.html";
});
bookmarksBtn.addEventListener("click", () => {
    window.location.href = "bookmarks.html";
});

reportBtn.addEventListener("click", () => {
    reportModal.style.display = "flex";
    reportForm.style.display = "block";
});

closeModal.addEventListener("click", () => {
    reportModal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === reportModal) {
        reportModal.style.display = "none";
    }
});


const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const gameInput = document.getElementById("gameInput");

reportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to post.");
        return;
    }

    try {
        await addDoc(collection(db, "posts"), {
            title: titleInput.value,
            description: descInput.value,
            game: gameInput.value,
            author: user.email,
            upvotes: 0,
            downvotes: 0,
            voters: {}
        });
        alert("Your report has been posted!");
        reportForm.reset();
        reportModal.style.display = "none";
        loadPosts(globalBookMarks);

    } catch (err) {
        alert("Failed to post your report.");
    }
});

function toggleBookmark(postId, Btn){
    const user = auth.currentUser;
    const userRef = doc(db, "users", user.uid);
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




