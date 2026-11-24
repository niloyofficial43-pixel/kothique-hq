<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>KOTHIQUE HQ</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">
  <h1>KOTHIQUE</h1>
  <p>Every Voice Has a Story.</p>

  <div id="login">
    <h2>Welcome to KOTHIQUE HQ</h2>
    <p>Company Management System</p>
    <input type="email" id="email" placeholder="Email Address">
    <input type="password" id="password" placeholder="Password">
    <button id="loginBtn">Login</button>
    <p id="message"></p>
  </div>

  <div id="dashboard" hidden>
    <h2>Chairman Dashboard</h2>
    <p id="userEmail"></p>
    <button id="logoutBtn">Logout</button>

    <hr>

    <h2>Team Management</h2>
    <p>Add and manage KOTHIQUE team members.</p>

    <input id="memberName" placeholder="Full Name">

    <select id="memberRole">
      <option value="">Select Position</option>
      <option>Co-Founder</option>
      <option>CEO</option>
      <option>Board Member</option>
      <option>Director of Finance</option>
      <option>Strategic Advisor</option>
      <option>Team Member</option>
    </select>

    <input id="memberEmail" type="email" placeholder="Email (Optional)">

    <button id="addMemberBtn">Add Team Member</button>

    <p id="teamMessage"></p>

    <h3>Our Team</h3>
    <div id="teamList">Loading team...</div>
  </div>
</div>

<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
<script src="app.js"></script>

</body>
</html>
