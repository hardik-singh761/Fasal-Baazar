const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/farmerDB",
  collection: "sessions",
});

app.use(
  session({
    secret: "hardiksingh",
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/farmerDB")
  .then(() => {
    console.log("Connection open!!");
  })
  .catch((err) => {
    console.log("Error!!!");
    console.log(err);
  });

// Routes
app.get("/", (req, res) => {
  console.log("req.session.farmer:", req.session.farmer);
  res.render("home", { req: req });
});

app.get("/market", (req, res) => {
  res.render("market");
});

app.get("/ai", (req, res) => {
  res.render("ai");
});

app.get("/bio", (req, res) => {
  res.render("bio");
});

app.get("/news", (req, res) => {
  res.render("news");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/camera", (req, res) => {
  res.render("camera");
});

// Farmer Schema
const farmerSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const Farmer = mongoose.model("Farmer", farmerSchema);

// POST Route for Register
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const farmer = new Farmer({ username, email, password });

  await farmer
    .save()
    .then(() => {
      console.log(req.body);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      res.render("register", { error: "Error signing up. Please try again." });
    });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const farmer = await Farmer.findOne({ email });

  if (!farmer) {
    return res.render("login", { error: "Invalid email or password" });
  }

  const isValidPassword = await bcrypt.compare(password, farmer.password);

  if (!isValidPassword) {
    return res.render("login", { error: "Invalid email or password" });
  }

  // Login successful, create a session
  req.session.farmer = farmer;
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
