// KOTHIQUE HQ - Firebase Configuration

const firebaseConfig = {
  apiKey: "AIzaSyAIun0R_-JrATLVn4-aYndUo0_yxAuICjk",
  authDomain: "kothique-media2026.firebaseapp.com",
  projectId: "kothique-media2026",
  storageBucket: "kothique-media2026.firebasestorage.app",
  messagingSenderId: "392457896273",
  appId: "1:392457896273:web:ea584b3d997372abd21370"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const chairmanUID = "eY7TGc8tu8PfearxTlXWc73HBPr1";

const loginBox = document.getElementById("login");
const dashboard = document.getElementById("dashboard");
const message = document.getElementById("message");

// Login
document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "Logging in...";

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    message.textContent = error.message;
  }
});

// Authentication Check
auth.onAuthStateChanged((user) => {
  if (user && user.uid === chairmanUID) {
    loginBox.hidden = true;
    dashboard.hidden = false;
    document.getElementById("userEmail").textContent = user.email;
  } else {
    dashboard.hidden = true;
    loginBox.hidden = false;

    if (user) {
      message.textContent = "Access denied. Chairman account only.";
      auth.signOut();
    }
  }
});

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut();
});
