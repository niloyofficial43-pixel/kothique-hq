// KOTHIQUE HQ - Corporate Management
const firebaseConfig = {
  apiKey: "AIzaSyAIunR0_-JrATLVn4-aYndUo0_yxAuICjk",
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
const availableRoles = [
  "Co-Founder",
  "CEO",
  "Board Member",
  "Director of Finance",
  "Strategic Advisor",
  "Team Member"
];
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
    teamMessage.textContent = "Member added successfully!";
    loadTeam();
  } catch (error) {
    teamMessage.textContent = error.message;
  }
});
// EDIT MEMBER
async function editMember(member) {
  const newName = prompt("Enter member name:", member.name);
  if (newName === null) return;
  const newRole = prompt(
    "Enter new position:\n" + availableRoles.join(", "),
    member.role
  );
  if (newRole === null) return;
  const newEmail = prompt("Enter email:", member.email || "");
  if (newEmail === null) return;
  const cleanName = newName.trim();
  const cleanRole = newRole.trim();
  const cleanEmail = newEmail.trim();
  if (!cleanName || !availableRoles.includes(cleanRole)) {
    alert("Invalid name or position.");
    return;
  }
  try {
    await db.collection("team").doc(member.id).update({
      name: cleanName,
      role: cleanRole,
      email: cleanEmail
    });
    alert("Member updated successfully!");
    loadTeam();
  } catch (error) {
    alert("Update failed: " + error.message);
  }
}
// REMOVE MEMBER
async function removeMember(member) {
  const confirmed = confirm(
    "Are you sure you want to remove " + member.name + "?"
  );
  if (!confirmed) return;
  try {
    await db.collection("team").doc(member.id).delete();
    alert("Member removed successfully!");
    loadTeam();
  } catch (error) {
    alert("Remove failed: " + error.message);
  }
}
// CREATE MEMBER CARD
function createMemberCard(serial, member) {
  const card = document.createElement("div");
  card.style.padding = "15px";
  card.style.margin = "10px 0";
  card.style.background = "#26354c";
  card.style.borderRadius = "10px";
  const name = document.createElement("h3");
  name.textContent = serial + ". " + member.name;
  const role = document.createElement("p");
  role.textContent = "Designation: " + member.role;
  const email = document.createElement("p");
  email.textContent = "Email: " + (member.email || "Not provided");
  card.append(name, role, email);
  // Chairman card has no edit/remove buttons
  if (member.id) {
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.style.marginRight = "10px";
    editButton.addEventListener("click", () => editMember(member));
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.style.background = "#a83232";
    removeButton.addEventListener("click", () => removeMember(member));
    card.append(editButton, removeButton);
  }
  return card;
}
// LOAD TEAM AND SEPARATE DEPARTMENTS
async function loadTeam() {
  const leadership = document.getElementById("leadershipList");
  const board = document.getElementById("boardList");
  const executive = document.getElementById("executiveList");
  leadership.innerHTML = "Loading...";
  board.innerHTML = "";
  executive.innerHTML = "";
  try {
    const snapshot = await db.collection("team").get();
    const members = [];
    snapshot.forEach(doc => {
      members.push({
        id: doc.id,
        ...doc.data()
      });
    });
    const rank = {
      "CEO": 1,
      "Co-Founder": 2,
      "Board Member": 1,
      "Director of Finance": 2,
      "Strategic Advisor": 3,
      "Team Member": 1
    };
    members.sort((a, b) => {
      const aRank = rank[a.role] || 99;
      const bRank = rank[b.role] || 99;
      if (aRank !== bRank) return aRank - bRank;
      return (a.createdAt?.seconds || 0) -
             (b.createdAt?.seconds || 0);
    });
    // LEADERSHIP
    leadership.innerHTML = "";
    leadership.appendChild(createMemberCard(1, chairman));
    const leaders = members.filter(member =>
      ["CEO", "Co-Founder"].includes(member.role)
    );
    leaders.forEach((member, index) => {
      let designation = member.role;
      if (member.role === "CEO") {
        designation = "Co-Founder & CEO";
      }
      leadership.appendChild(
        createMemberCard(index + 2, {
          ...member,
          role: designation
        })
      );
    });
    // BOARD OF DIRECTORS
    const boardMembers = members.filter(member =>
      ["Board Member", "Director of Finance", "Strategic Advisor"]
        .includes(member.role)
    );
    board.innerHTML = "";
    if (boardMembers.length === 0) {
      board.textContent = "No board members added yet.";
    } else {
      boardMembers.forEach((member, index) => {
        let designation = member.role;
        if (member.role === "Director of Finance") {
          designation = "Board Member & Director of Finance";
        }
        if (member.role === "Strategic Advisor") {
          designation = "Board Member & Strategic Advisor";
        }
        board.appendChild(
          createMemberCard(index + 1, {
            ...member,
            role: designation
          })
        );
      });
    }
    // EXECUTIVE TEAM
    const teamMembers = members.filter(member =>
      member.role === "Team Member"
    );
    executive.innerHTML = "";
    if (teamMembers.length === 0) {
      executive.textContent = "No executive team members added yet.";
    } else {
      teamMembers.forEach((member, index) => {
        executive.appendChild(
          createMemberCard(index + 1, member)
        );
      });
    }
  } catch (error) {
    leadership.textContent = "Error: " + error.message;
  }
}
