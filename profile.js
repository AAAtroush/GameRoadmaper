import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
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
const auth = getAuth();

const usernameEl = document.getElementById("username");
const bioEl = document.getElementById("bio");
const editBtn = document.getElementById("editProfileBtn");
const postsContainer = document.getElementById("postsList");

const modal = document.getElementById("editProfileModal");
const closeModal = document.getElementById("closeEditProfile");
const editForm = document.getElementById("editProfileForm");
const usernameInput = document.getElementById("newUsername");
const bioInput = document.getElementById("newBio");

let currentUserId;
let userMail;

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    currentUserId = user.uid;

    const userRef = doc(db, "users", currentUserId);
    const userDoc = await getDoc(userRef);

    const data = userDoc.data();
    usernameEl.textContent = data.username || user.email.split("@")[0];
    bioEl.textContent = data.bio || "No bio yet";
    
    userMail = user.email;
    loadUserPosts(user.email);
});

const searchBar = document.querySelector(".searchbar");
searchBar.addEventListener("input", (e) => {
    const queryText = e.target.value.toLowerCase();
    loadUserPosts(userMail, queryText);
});

async function loadUserPosts(email, filter = "") {
    const q = query(collection(db, "posts"), where("author", "==", email));
    const queryDoc = await getDocs(q);

    postsContainer.innerHTML = "";

    queryDoc.forEach((docSnap) => {
        const post = docSnap.data();
        if(post.title.toLowerCase().includes(filter) || post.description.toLowerCase().includes(filter)){
            const div = document.createElement("div");
            div.className = "post";
            div.innerHTML =
                "<div class = 'meta'>" +
                    "<div>"+ post.author + "/"  + post.game + "</div>" +
                    "<h3>"+ post.title + "</h3>" +
                "</div>" +
                "<p>" + post.description + "</p>" +
                "<div class='votes'>" +
                    "<button class='upvote'>👍 "+ post.upvotes + "</button>" +
                    "<button class='downvote'>👎 " + post.downvotes + "</button>" +
                    "<button class='deletePostBtn'>🗑️ Delete</button>" +
                "</div>"
            ;
    
            const deleteBtn = div.querySelector(".deletePostBtn");
            deleteBtn.addEventListener("click", async () => {
                if (confirm("Are you sure you want to delete this post?")) {
                    await deleteDoc(doc(db, "posts", docSnap.id));
                    div.remove();
                }
            });
    
            postsContainer.appendChild(div);
        }
    });
}

const homeBtn = document.getElementById("home");
const homeBtn2 = document.getElementById("homeBtn");
const bookmarksBtn = document.getElementById("bookmarksBtn");
bookmarksBtn.addEventListener("click", () => {
    window.location.href = "bookmarks.html";
});
homeBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});
homeBtn2.addEventListener("click", () => {
    window.location.href = "index.html";
});
editBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    usernameInput.value = usernameEl.textContent;
    bioInput.value = bioEl.textContent;
});

closeModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userRef = doc(db, "users", currentUserId);

    const updatedData = {
        username: usernameInput.value.trim(),
        bio: bioInput.value.trim()
    };

    await updateDoc(userRef, updatedData);

    usernameEl.textContent = updatedData.username;
    bioEl.textContent = updatedData.bio;

    modal.style.display = "none";
});
