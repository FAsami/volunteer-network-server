const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectId;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = process.env.DB_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const taskCollection = client.db('volunteerNetwork').collection('events');
  const volunteerCollection = client
    .db('volunteerNetwork')
    .collection('volunteers');

  app.get('/tasks', (req, res) => {
    taskCollection.find({}).toArray((err, docs) => res.send(docs));
  });

  app.post('/add-task', (req, res) => {
    taskCollection
      .insertOne(req.body)
      .then((result) => res.send(result.insertedCount > 0));
  });

  app.get('/events', (req, res) => {
    volunteerCollection.find({}).toArray((err, docs) => res.send(docs));
  });

  app.get('/volunteer-events/:email', (req, res) => {
    const reqEmail = req.params.email;
    volunteerCollection
      .find({ email: reqEmail })
      .toArray((err, docs) => res.send(docs));
  });

  app.post('/register-volunteer', (req, res) => {
    volunteerCollection.insertOne(req.body).then((result) => {
      res.send(result.ops[0]);
    });
  });

  app.delete('/delete-event/:id', (req, res) => {
    volunteerCollection
      .deleteOne({ _id: objectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

const port = 5000;
app.listen(process.env.PORT || port);
