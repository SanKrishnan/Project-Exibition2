import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// ✅ Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyClqfeUvXCggnAskJzDO2MBWGryFRt7-24",
  authDomain: "course-based-platform-a09f2.firebaseapp.com",
  projectId: "course-based-platform-a09f2",
  storageBucket: "course-based-platform-a09f2.appspot.com",
  messagingSenderId: "902925363551",
  appId: "1:902925363551:web:e731d52df385ad767f2eea"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// DOM elements
const uploadedNotesList = document.getElementById("uploadedNotesList");
const availableNotesList = document.getElementById("availableNotesList");
const searchInput = document.getElementById("search-input");
const searchClearButton = document.getElementById("search-clear-button");

let currentUser = null;

// Auth check
onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    console.log("✅ Logged in as:", user.email);
    loadUserNotes(user.uid);
  } else {
    currentUser = null;
    console.log("❌ Not logged in.");
    loadAvailableNotes();
  }
});

// Load user's uploaded notes
const loadUserNotes = async (userId) => {
  try {
    const notesQuery = query(collection(db, "notes"), where("userId", "==", userId), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(notesQuery);
    uploadedNotesList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const note = doc.data();
      const noteCard = document.createElement("div");
      noteCard.classList.add("note-card");

      noteCard.innerHTML = `
        <h3 class="note-title">${note.title}</h3>
        <p class="note-description">${note.description}</p>
        <button class="view-button" onclick="window.open('${note.fileURL}', '_blank')">View File</button>
        <hr class="note-divider">
      `;

      uploadedNotesList.appendChild(noteCard);
    });
  } catch (error) {
    console.error("❌ Error fetching user's notes:", error);
  }
};

// Load all available notes
const loadAvailableNotes = async () => {
  try {
    const notesQuery = query(collection(db, "notes"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(notesQuery);
    availableNotesList.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const note = doc.data();
      const noteCard = document.createElement("div");
      noteCard.classList.add("note-card");

      noteCard.innerHTML = `
        <h3 class="note-title">${note.title}</h3>
        <p class="note-description">${note.description}</p>
        <button class="view-button" onclick="window.open('${note.fileURL}', '_blank')">View File</button>
        <hr class="note-divider">
      `;

      availableNotesList.appendChild(noteCard);
    });
  } catch (error) {
    console.error("❌ Error fetching available notes:", error);
  }
};

// Search functionality
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  filterNotes(searchTerm);
});

searchClearButton.addEventListener("click", () => {
  searchInput.value = "";
  filterNotes("");
});

const filterNotes = (searchTerm) => {
  const allNotes = [...uploadedNotesList.children, ...availableNotesList.children];

  allNotes.forEach((noteItem) => {
    const title = noteItem.querySelector(".note-title").innerText.toLowerCase();
    const description = noteItem.querySelector(".note-description").innerText.toLowerCase();

    if (title.includes(searchTerm) || description.includes(searchTerm)) {
      noteItem.style.display = "block";
    } else {
      noteItem.style.display = "none";
    }
  });
};
