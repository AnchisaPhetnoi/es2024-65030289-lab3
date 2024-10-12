const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// ใช้ Body Parser สำหรับการรับข้อมูล JSON
app.use(bodyParser.json());

// MongoDB Connection URL
const url = 'mongodb://mongodb-container:27017';
const dbName = 'mydatabase';

MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    console.log("Connected to MongoDB!");
    const db = client.db(dbName);
    const collection = db.collection('mycollection');

    // Route สำหรับดึงข้อมูล
    app.get('/api/data', async (req, res) => {
      try {
        const data = await collection.find().toArray();
        res.json(data);
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // Route สำหรับเพิ่มข้อมูล
    app.post('/api/data', async (req, res) => {
      try {
        const newItem = req.body;
        const result = await collection.insertOne(newItem);
        res.status(201).json(result.ops[0]);
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // Route สำหรับแก้ไขข้อมูล
    app.put('/api/data/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updatedItem = req.body;
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedItem }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send('Item not found');
        }
        res.json(result);
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // Route สำหรับลบข้อมูล
    app.delete('/api/data/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
          return res.status(404).send('Item not found');
        }
        res.json(result);
      } catch (err) {
        res.status(500).send(err);
      }
    });

    // Route สำหรับ root
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    // Start server
    app.listen(port, () => {
      console.log(`Express server is running on port ${port}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to MongoDB:", err);
  });

