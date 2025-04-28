// Import necessary Firebase libraries
import { getAuth, updateProfile, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";

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
const db = getFirestore(app);

// DOM elements
const form = document.querySelector("form");
const nameInput = document.querySelector("input[name='name']");
const emailInput = document.querySelector("input[name='email']");
const oldPassInput = document.querySelector("input[name='old_pass']");
const newPassInput = document.querySelector("input[name='new_pass']");
const cPassInput = document.querySelector("input[name='c_pass']");
const fileInput = document.querySelector("input[type='file']");

// Handle form submission
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
        alert("You must be logged in to update your profile.");
        return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const oldPassword = oldPassInput.value.trim();
    const newPassword = newPassInput.value.trim();
    const confirmPassword = cPassInput.value.trim();
    const file = fileInput.files[0];

    // Check if the passwords match
    if (newPassword && newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    try {
        // Update Name in Firebase Authentication (if necessary)
        if (name) {
            await updateProfile(user, { displayName: name });
        }

        // Update Email in Firebase Authentication (if necessary)
        if (email) {
            await updateEmail(user, email);
        }

        // Update Password in Firebase Authentication (if necessary)
        if (newPassword) {
            await updatePassword(user, newPassword);
        }

        // Upload profile picture to Firebase Storage (if selected)
        if (file) {
            const fileRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
            await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(fileRef);
            
            // Save the profile picture URL in Firestore
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { photoURL: downloadURL });
            console.log("Profile picture uploaded: ", downloadURL);
        }

        // Optionally, update user's details in Firestore (e.g., name, email, photoURL)
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            name: name,
            email: email,
            photoURL: file ? downloadURL : user.photoURL,
        });

        alert("Profile updated successfully!");

    } catch (error) {
        console.error("Error updating profile:", error);
        alert("Error updating profile: " + error.message);
    }
});
