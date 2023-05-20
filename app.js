const express = require("express");
const app = express();
const Client = require("./models/client");
const Admin = require("./models/admin");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");
const nodemailer = require("nodemailer");
const Product = require('./models/product');

// Seeder. Remove when run for the first time
//require("./seed");

const dbURI = process.env.MONGODBURI || "mongodb://127.0.0.1:27017/agileDB";
const gmailEmail = process.env.GMAILEMAIL || "AgileMailer@gmail.com";
const gmailPassword = process.env.GMAILPASSWORD || "lppboiuuluhxguhc";

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("views"));
app.use(cookieParser("cookieSecret"));
// Authentication configuration
const sessionConfig = {
  name: "session-cookie",
  secret: "thisisasecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(
  session({
    name: "sessionHere",
    // TODO to change the secret before deployment
    secret: "sessionSecret",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    },
    store: MongoStore.create(
      {
        mongoUrl: dbURI,
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());
passport.use(new LocalStrategy(Admin.authenticate()));

app.use((req, res, next) => {
  console.log("req.session: ", req.session);
  console.log("req.user = " + req.user);
  res.locals.currentUser = req.user;
  next();
});

app.get("/", async (req, res) => {
  const products = await Product.find({});
  res.render("index", { products });
});

function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

app.get("/orders", loggedIn, async (req, res) => {
  const clients = await Client.find({});
  res.render("orders", { clients });
});

// Mailer Configs
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
  secure: true,
});

app.post("/order", async (req, res) => {
  console.log(req);
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

  const mailData = {
    from: gmailEmail, // sender address
    to: "ahmed_elmouden3@um5.ac.ma", // list of receivers
    subject: "New Order!",
    text: "A new client ordered!",
    html: `<h2>Order Details</h2><br/><b>Ordered Product:</b> ${client.orderedProduct}<br/><b>Full Name:</b> ${client.fullName}</br>
      <b>Phone Number:</b> ${client.phoneNumber}</br><b>shipping Address:</b> ${client.shippingAddress}</br><b>City:</b> ${client.city}</br>`,
  };

  //Send Email to admin
  transporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
    else console.log("info");
  });

  res.sendStatus(200);
});

// Admin Endpoints
app.get("/register", function (req, res) {
  adminEmail = "admin@admin.com";
  adminUsername = "admin";
  adminPassword = "admin";
  Admin.register(
    new Admin({ email: adminEmail, username: adminUsername }),
    adminPassword,
    function (err, user) {
      if (err) {
        res.json({
          success: false,
          message: "Your account could not be saved. Error: " + err,
        });
      } else {
        req.login(user, (er) => {
          if (er) {
            res.json({ success: false, message: er });
          } else {
            res.json({
              success: true,
              message: "Your Admin account has been saved",
            });
          }
        });
      }
    }
  );
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  function (req, res) {
    //res.json({ success: true, message: "Logged in successfully" });
    res.redirect("/orders");
  }
);

// app.post("/login", function (req, res) {
//   if (!req.body.username) {
//       res.json({ success: false, message: "Username was not given" })
//   }
//   else if (!req.body.password) {
//       res.json({ success: false, message: "Password was not given" })
//   }
//   else {
//       passport.authenticate("local", function (err, user, info) {
//           if (err) {
//               console.log("Passport Authentication Error: " + err);
//               res.json({ success: false, message: err });
//           }
//           else {
//               if (!user) {
//                   res.json({ success: false, message: "username or password incorrect" });
//               }
//               else {
//                   const token = jwt.sign({ userId: user._id, username: user.username }, "jwtSecret", { expiresIn: "24h" });
//                   console.log("Passport User Object: " + user._id + " " + user.username );
//                   res.json({ success: true, message: "Authentication successful", token: token });
//               }
//           }
//       })(req, res);
//   }
// });

// use env variable to define tcp/ip port with a default
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Express running on localhost:" + PORT);
});
