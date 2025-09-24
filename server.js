const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(".")); // serve html files

const USERS_FILE = "users.json";

// Load users
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

// Save users
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Sign up
app.post("/signup", (req, res) => {
  const {email, password} = req.body;
  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).send("User already exists");
  }
  users.push({email, password});
  saveUsers(users);
  res.send("Account created");
});

// Login
app.post("/login", (req, res) => {
  const {email, password} = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.send("Login successful");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
