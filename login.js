import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

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
const auth = getAuth();
const msg = document.getElementById("msg");

document.getElementById("loginBtn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            window.location.href = "index.html";
        })
        .catch(err => {
            if (err.code == "auth/user-not-found" || err.code == "auth/wrong-password" || err.code == "auth/invalid-credential") {
                msg.textContent = "Your email or password doesn't match.";
            }
            else if(err.code == "auth/invalid-email"){
                msg.textContent = "Please use a valid email."
            } else {
                msg.textContent = err.message;
            }
        });
});

document.getElementById("signupBtn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            window.location.href = "index.html";
        })
        .catch(err => {
            if (err.code == "auth/email-already-in-use") {
                msg.textContent = "This email is already in use.";
            }
            else if (err.code == "auth/weak-password") {
                msg.textContent = "Please use a stronger password.";
            }
            else if(err.code == "auth/invalid-email"){
                msg.textContent = "Please use a valid email."
            } else {
                msg.textContent = err.message;
            }
        });
});
