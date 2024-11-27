const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, "students.json"); // Path to store data

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ensure the data file exists
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([])); // Initialize with an empty array
}

// Routes
app.get("/", (req, res) => res.send("Student API is running!"));

// Save Student Data
app.post("/api/students", (req, res) => {
    try {
        // Read existing data
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));

        // Add new student data
        const newStudent = {
            id: Date.now(), // Unique ID
            ...req.body,
        };
        data.push(newStudent);

        // Write updated data back to file
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        res.status(201).json({ message: "Student data saved successfully!", student: newStudent });
    } catch (err) {
        console.error("Error saving student data:", err);
        res.status(500).json({ error: "Failed to save student data" });
    }
});

// Fetch All Students
app.get("/api/students", (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
        res.json(data);
    } catch (err) {
        console.error("Error reading student data:", err);
        res.status(500).json({ error: "Failed to fetch student data" });
    }
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
