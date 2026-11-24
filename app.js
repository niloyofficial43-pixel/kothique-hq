// KOTHIQUE HQ
// Firebase Configuration

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

// LOGIN
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

// AUTHENTICATION
auth.onAuthStateChanged(user => {
  if (user && user.uid === chairmanUID) {
    loginBox.hidden = true;
    dashboard.hidden = false;

    document.getElementById("userEmail").textContent = user.email;

    loadTeam();
  } else {
    dashboard.hidden = true;
    loginBox.hidden = false;

    if (user) {
      message.textContent = "Chairman access only.";
      auth.signOut();
    }
  }
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut();
});

// ADD TEAM MEMBER
document.getElementById("addMemberBtn").addEventListener("click", async () => {

  const name = document.getElementById("memberName").value.trim();
  const role = document.getElementById("memberRole").value;
  const email = document.getElementById("memberEmail").value.trim();

  const teamMessage = document.getElementById("teamMessage");

  if (!name || !role) {
    teamMessage.textContent = "Name and position are required.";
    return;
  }

  try {
    await db.collection("team").add({
      name: name,
      role: role,
      email: email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById("memberName").value = "";
    document.getElementById("memberRole").value = "";
    document.getElementById("memberEmail").value = "";

    teamMessage.textContent = "Team member added successfully!";

    loadTeam();

  } catch (error) {
    teamMessage.textContent = "Error: " + error.message;
  }
});

// LOAD TEAM
async function loadTeam() {

  const teamList = document.getElementById("teamList");

  teamList.textContent = "Loading team...";

  try {

    const snapshot = await db.collection("team")
      .orderBy("createdAt", "desc")
      .get();

    teamList.innerHTML = "";

    if (snapshot.empty) {
      teamList.textContent = "No team members added yet.";
      return;
    }

    snapshot.forEach(doc => {

      const member = doc.data();

      const card = document.createElement("div");
      card.style.padding = "15px";
      card.style.margin = "10px 0";
      card.style.background = "#26354c";
      card.style.borderRadius = "10px";

      const name = document.createElement("h3");
      name.textContent = member.name;

      const role = document.createElement("p");
      role.textContent = "Position: " + member.role;

      const email = document.createElement("p");
      email.textContent = "Email: " + (member.email || "Not provided");

      card.append(name, role, email);

      teamList.appendChild(card);

    });

  } catch (error) {
    teamList.textContent = "Could not load team: " + error.message;
  }
}
