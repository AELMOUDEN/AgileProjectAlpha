const express = require("express");
const app = express();
const Client = require("./models/client");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/clientDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected");
});

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
