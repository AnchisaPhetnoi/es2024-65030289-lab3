const fs = require('fs');
const mongoose = require('mongoose');

// เชื่อมต่อกับ MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB');

  // ฟังก์ชันแทรกข้อมูลตัวอย่าง
  const insertDummyData = async () => {
    try {
      const data = fs.readFileSync('./dummyData.json', 'utf8');
      const users = JSON.parse(data);
      
      await User.insertMany(users);
      console.log('Dummy data inserted');
    } catch (error) {
      console.error('Error inserting dummy data', error);
    } finally {
      mongoose.connection.close(); // ปิดการเชื่อมต่อหลังจากเสร็จสิ้น
    }
  };

  // เรียกใช้ฟังก์ชันแทรกข้อมูล
  await insertDummyData();
}).catch((err) => {
  console.error('Failed to connect to MongoDB', err);
});

