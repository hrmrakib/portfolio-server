const express = require("express");
const cors = require("cors");
// const jwt = require("jsonwebtoken");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://hmrakib.com",
      "https://www.hmrakib.com",
      "https://hmrakibs.web.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@portfoliocluster.wjb6ygv.mongodb.net/?retryWrites=true&w=majority&appName=portfolioCluster`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    // database collections
    const database = client.db("portfolio");
    const userCollection = database.collection("users");
    const projectCollection = database.collection("projects");
    const blogCollection = database.collection("blogs");

    // all connections
    app.get("/", (req, res) => {
      res.send("I am always running 24 hours ....");
    });

    // create a new user
    app.post("/user", async (req, res) => {
      const userInfo = req.body;
      const userEmail = userInfo?.email;
      const findEmail = { email: userEmail };
      const isExist = await userCollection.findOne(findEmail);

      if (isExist) {
        return;
      }
      console.log(userInfo);
      const result = await userCollection.insertOne(userInfo);
      res.send(result);
    });

    // get all projects
    app.get("/all-projects", async (req, res) => {
      const result = await projectCollection.find().toArray();
      res.send(result);
    });

    // add a new project
    app.post("/add-project", async (req, res) => {
      const projectInfo = req.body;
      const result = await projectCollection.insertOne(projectInfo);
      res.send(result);
    });

    // get all blogs
    app.get("/blogs", async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
    });

    // get a single blog
    app.get("/blog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("server is running....");
});
