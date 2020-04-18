const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


var items = [];

app.get("/", function(req, res) {
  const options = {
    weekday: "long",
    month: "long",
    day: "numeric"
  };
  const date = new Date().toLocaleString("en-us", options);
  res.render("index", {date: date, items: items});
});

app.post("/", function(req, res) {
  items.push(req.body.nextItem);
  res.redirect("/");
});

app.listen(3000, function() {
  console.log("The server is now listening on port 3000.");
});
