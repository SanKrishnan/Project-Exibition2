import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-analytics.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyClqfeUvXCggnAskJzDO2MBWGryFRt7-24",
    authDomain: "course-based-platform-a09f2.firebaseapp.com",
    projectId: "course-based-platform-a09f2",
    storageBucket: "course-based-platform-a09f2.firebasestorage.app",
    messagingSenderId: "902925363551",
    appId: "1:902925363551:web:e731d52df385ad767f2eea"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission

            const email = document.querySelector("input[name='email']").value;
            const password = document.querySelector("input[name='pass']").value;

            if (!email || !password) {
                alert("Please enter both email and password.");
                return;
            }

            try {
                await signInWithEmailAndPassword(auth, email, password);
                alert("Login successful! Redirecting to profile page...");
                
                // Redirect to home page after 2 seconds
                setTimeout(() => {
                    window.location.href = "profile.html";
                }, 2000);
            } catch (error) {
                alert("Login failed: " + error.message);
                console.error("Error: ", error.message);
            }
        });
    }
});
