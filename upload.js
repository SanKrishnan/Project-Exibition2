import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// ✅ Correct Firebase project (course-based-platform-a09f2)
const firebaseConfig = {
  apiKey: "AIzaSyClqfeUvXCggnAskJzDO2MBWGryFRt7-24",
  authDomain: "course-based-platform-a09f2.firebaseapp.com",
  projectId: "course-based-platform-a09f2",
  storageBucket: "course-based-platform-a09f2.firebasestorage.app",  // ✅ FIXED!
  messagingSenderId: "902925363551",
  appId: "1:902925363551:web:e731d52df385ad767f2eea"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const uploadForm = document.querySelector("form");
const fileInput = document.getElementById("note-file");
const titleInput = document.getElementById("note-title");
const descriptionInput = document.getElementById("description");
const uploadButton = document.getElementById("uploadButton");

let currentUser = null;

// ✅ Listen to user auth status
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("✅ Logged in as:", user.email);
  } else {
    currentUser = null;
    console.log("❌ Not logged in.");
  }
});

// 🔼 Upload file to Firebase Storage
const uploadFile = async (file, userId) => {
  try {
    const fileRef = ref(storage, `notes/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const fileURL = await getDownloadURL(fileRef);
    return fileURL;
  } catch (error) {
    console.error("❌ Upload error:", error);
    alert("Error uploading file!");
  }
};

// 💾 Save metadata to Firestore
const saveNoteMetadata = async (title, description, fileURL, userId) => {
  try {
    const noteRef = collection(db, "notes");
    await addDoc(noteRef, {
      title,
      description,
      fileURL,
      userId,
      timestamp: new Date(),
    });
    alert("✅ Note uploaded successfully!");
  } catch (error) {
    console.error("❌ Firestore error:", error);
    alert("Error saving note metadata!");
  }
};

// 📤 Handle form submission
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) {
    alert("⚠️ You must be logged in to upload.");
    return;
  }

  const file = fileInput.files[0];
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!file) {
    alert("Please choose a file to upload.");
    return;
  }

  const fileURL = await uploadFile(file, currentUser.uid);

  if (fileURL) {
    await saveNoteMetadata(title, description, fileURL, currentUser.uid);
    uploadForm.reset();
  }
});
