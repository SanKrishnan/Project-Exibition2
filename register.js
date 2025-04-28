import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
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
const storage = getStorage(app);
const analytics = getAnalytics(app);

document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission

            const name = document.querySelector("input[name='name']").value;
            const email = document.querySelector("input[name='email']").value;
            const password = document.querySelector("input[name='pass']").value;
            const confirmPassword = document.querySelector("input[name='c_pass']").value;
            const file = document.querySelector("input[type='file']").files[0];

            // Validate form fields
            if (!email || !password || !confirmPassword) {
                alert("Please fill out all fields.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            if (!file) {
                alert("Please select a profile picture.");
                return;
            }

            try {
                // Create user with email and password
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                alert("Registration successful! Redirecting to login page...");
            
                // Upload Profile Picture
                const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
                await uploadBytes(storageRef, file);  // Upload file to Firebase Storage
                const downloadURL = await getDownloadURL(storageRef);  // Get the file URL
                
                console.log("Profile picture uploaded: ", downloadURL); 

                // Optionally: Save the URL in Firestore or update the user's profile picture in Firebase Auth
                // e.g., updateProfile(user, { photoURL: downloadURL });

                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1000);

            } catch (error) {
                alert("Registration failed: " + error.message);
                console.error("Error: ", error.message);
            }
        });
    }

});
