const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001; // เปลี่ยนพอร์ตให้ตรงกับการตั้งค่าของ Nginx

// เชื่อมต่อกับ MongoDB
mongoose.connect('mongodb://mongodb-container:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ใช้ body-parser เพื่อแปลงข้อมูล JSON
app.use(bodyParser.json());

// โมเดลสำหรับข้อมูล
const DataSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number
});
const Data = mongoose.model('Data', DataSchema);

// Create (เพิ่มข้อมูล)
app.post('/api/data', async (req, res) => {
    const { name, email, age } = req.body;

    // ตรวจสอบค่าที่ส่งมาว่ามีการระบุ
    if (!name || !email || !age) {
        return res.status(400).json({ message: 'Name, email, and age are required.' });
    }

    try {
        const newData = new Data(req.body);
        await newData.save();
        res.status(201).json(newData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Read (อ่านข้อมูล)
app.get('/api/data', async (req, res) => {
    try {
        const allData = await Data.find();
        res.json(allData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving data');
    }
});

// Update (อัปเดตข้อมูล)
app.put('/api/data/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedData = await Data.findByIdAndUpdate(id, req.body, { new: true });
        res.json(updatedData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating data');
    }
});

// Delete (ลบข้อมูล)
app.delete('/api/data/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await Data.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting data');
    }
});

// เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

