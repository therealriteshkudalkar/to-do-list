const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});
const itemSchema = new mongoose.Schema({
  itemName: String
});
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  itemName: "Welcome to your To-do-list"
});

const item2 = new Item({
  itemName: "Hit the ➕ button to add an item to the list"
});

const item3 = new Item({
  itemName: "👈🏻 Hit the check box to delete an item"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {
  Item.find(function(err, items) {
    if(err) {
      console.log(err);
    } else {
      if(items.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("Successfully added the default items to the database.");
          }
        });
        res.redirect("/");
      } else {
        res.render("index", {appTitle: date.getDate(), items: items});
      }
    }
  });
});

app.post("/", function(req, res) {
  const item = req.body.nextItem;
  if (req.body.button === "Work") {
    //workItems.push(item);
    res.redirect("/work");
  } else {
    const newItem = new Item({
      itemName: item
    });
    newItem.save();
    res.redirect("/");
  }
});

app.post("/delete", function(req, res) {
  const itemId = req.body.checkbox;
  Item.deleteOne({_id: itemId}, function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
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
