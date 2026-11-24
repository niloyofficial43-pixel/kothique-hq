// KOTHIQUE HQ - Management System

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

const chairman = {
  name: "Md Shahriar Emon Niloy",
  role: "Founder, Chairman & Patron",
  email: "niloyofficial43@gmail.com"
};

const roleOrder = {
  "CEO": 1,
  "Co-Founder": 2,
  "Board Member": 3,
  "Director of Finance": 4,
  "Strategic Advisor": 5,
  "Team Member": 6
};

function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "Logging in...";

  auth.signInWithEmailAndPassword(email, password)
    .catch(error => message.textContent = error.message);
}

document.getElementById("loginBtn").addEventListener("click", login);

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

document.getElementById("logoutBtn").addEventListener("click", () => {
  auth.signOut();
});

// ADD MEMBER
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
      name,
      role,
      email,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    document.getElementById("memberName").value = "";
    document.getElementById("memberRole").value = "";
    document.getElementById("memberEmail").value = "";

    teamMessage.textContent = "Team member added successfully!";
    loadTeam();

  } catch (error) {
    teamMessage.textContent = error.message;
  }
});

// LOAD AND SORT TEAM
async function loadTeam() {
  const teamList = document.getElementById("teamList");
  teamList.innerHTML = "Loading team...";

  try {
    const snapshot = await db.collection("team").get();

    const members = [];

    snapshot.forEach(doc => {
      members.push({
        id: doc.id,
        ...doc.data()
      });
    });

    members.sort((a, b) => {
      const rankA = roleOrder[a.role] ?? 99;
      const rankB = roleOrder[b.role] ?? 99;

      if (rankA !== rankB) return rankA - rankB;

      return (a.createdAt?.seconds || 0) -
             (b.createdAt?.seconds || 0);
    });

    teamList.innerHTML = "";

    const heading = document.createElement("h3");
    heading.textContent = "Leadership & Management";
    teamList.appendChild(heading);

    addMemberCard(teamList, 1, chairman.name,
      chairman.role, chairman.email);

    members.forEach((member, index) => {
      const designation = member.name === "A.K.M. Reazul Kuddus"
        ? "Co-Founder & CEO"
        : member.role;

      addMemberCard(
        teamList,
        index + 2,
        member.name,
        designation,
        member.email
      );
    });

    if (members.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No additional members added yet.";
      teamList.appendChild(empty);
    }

  } catch (error) {
    teamList.textContent = "Error: " + error.message;
  }
}

// MEMBER CARD
function addMemberCard(container, serial, name, role, email) {
  const card = document.createElement("div");

  card.style.padding = "15px";
  card.style.margin = "10px 0";
  card.style.background = "#26354c";
  card.style.borderRadius = "10px";

  const title = document.createElement("h3");
  title.textContent = serial + ". " + name;

  const position = document.createElement("p");
  position.textContent = "Designation: " + role;

  const contact = document.createElement("p");
  contact.textContent = "Email: " + (email || "Not provided");

  card.append(title, position, contact);
  container.appendChild(card);
}
