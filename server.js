const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/studentDB", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Mongoose Schema and Model
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  guardianName: { type: String, required: true },
  guardianPhone: { type: String, required: true },
  dob: { type: Date, required: true },
  address: { type: String, required: true },
  class: { type: String, required: true },
  subjects: { type: [String], required: true },
  totalFees: { type: Number, required: true },
  phone: { type: String, required: true },
  photo: { type: String }, // This will store the filename or path
});

const Student = mongoose.model("Student", studentSchema);

// Routes
app.get("/", (req, res) => res.send("Student API is running!"));

// Save Student Data
app.post("/api/students", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json({ message: "Student data saved successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Fetch All Students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
