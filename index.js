const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

// เพิ่มบรรทัดนี้เพื่อจัดการกับ DeprecationWarning
mongoose.set('strictQuery', false);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB model
const Student = mongoose.model("students", new mongoose.Schema({
    studentCode: String,
    firstName: String,
    lastName: String,
    telNumber: String
}, { versionKey: false }));

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/students"; // ตรวจสอบว่า URI ถูกต้อง
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// CRUD routes
app.get("/api/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (err) {
        res.status(500).send({ message: "Error fetching students" });
    }
});

app.post("/api/students", async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.send(newStudent);
    } catch (err) {
        res.status(400).send({ message: "Error adding student" });
    }
});

app.put("/api/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedStudent);
    } catch (err) {
        res.status(400).send({ message: "Error updating student" });
    }
});

app.delete("/api/students/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.send({ message: "Student deleted" });
    } catch (err) {
        res.status(400).send({ message: "Error deleting student" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { // Bind ไปยังทุก interface
    console.log(`Server running on port ${PORT}`);
});

// กำหนดเส้นทางสำหรับ root (หน้าแรก)
app.get("/", (req, res) => {
    res.send("Welcome to the Students API");
});
