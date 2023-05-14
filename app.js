const express = require("express");
const app = express();
const Client = require("./models/client");
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected");
});

// i know, i know, db password leaked!
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://ahmedelmouden:n7UtzoLrIxOLpAe3@agilemongocluster.wusfibn.mongodb.net/?retryWrites=true&w=majority";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);



app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/orders", async (req, res) => {
    const clients = await Client.find({});
    res.render("orders", {clients});
})

app.post("/order", async (req, res) => {
  console.log(req.body);
  const {
    color: orderedProduct,
    first_name: fullName,
    city,
    phone: phoneNumber,
    address: shippingAddress,
  } = req.body;
  const client = {
    fullName,
    city,
    phoneNumber,
    shippingAddress,
    orderedProduct,
  };
    
  const newClient = new Client(client);
  await newClient.save();


  res.render("thankyou", client);
});


// use env variable to define tcp/ip port with a default
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Express running on localhost:" + PORT);
});
