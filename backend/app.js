// backend/app.js

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// absolute path to frontend folder
const FRONTEND_DIR = path.join(__dirname, "..", "frontend");
console.log("Serving from:", FRONTEND_DIR);

// serve all static files from /frontend
app.use(express.static(FRONTEND_DIR));

// home -> index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "index.html"));
});

// explicit routes (extra safe)
app.get("/eventstyles.html", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "eventstyles.html"));
});

app.get("/occasion.html", (req, res) => {
  res.sendFile(path.join(FRONTEND_DIR, "occasion.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
