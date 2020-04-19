const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


var items = ["Buy Food", "Cook Food", "Eat Food"];
var workItems = [];

app.get("/", function(req, res) {
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };
  const date = new Date().toLocaleString("en-us", options);
  res.render("index", {appTitle: date, items: items});
});

app.post("/", function(req, res) {
  const item = req.body.nextItem;
  if (req.body.button === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req, res) {
  res.render("index", {appTitle: "Work List", items: workItems});
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("The server is now listening on port 3000.");
});
