const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vrk8jch.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   },
});

async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      client.connect();

      const instructorCollection = client.db("skillUpDB").collection("instructor");
      const classesCollection = client.db("skillUpDB").collection("classes");

      // Instructors
      app.get("/instructors", async (req, res) => {
         const result = await instructorCollection.find().toArray();
         res.send(result);
      });

      // Classes
      app.get("/classes", async (req, res) => {
         const result = await classesCollection.find().toArray();
         res.send(result);
      })

      // Featured Classes find
      app.get("/featured_classes", async (req, res) => {
         const cursor =  classesCollection.find().skip(2)
         const result = await cursor.toArray();
         res.send(result);
      });

      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log(
         "Pinged your deployment. You successfully connected to MongoDB!"
      );
   } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
   }
}
run().catch(console.dir);

app.get('/', (req, res) => {
   res.send('Skill Up is running...')
})

app.listen(port, () => {
   console.log(`Skill Up is running on port ${port}`);
})
