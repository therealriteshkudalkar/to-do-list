require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

mongoose.set('useFindAndModify', false);

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://admin-ritesh:" + process.env.DB_PASS+ "@cluster0-rrd7o.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const itemSchema = new mongoose.Schema({
  itemName: String
});
const Item = mongoose.model("Item", itemSchema);

const listSchema = new mongoose.Schema({
  listName: String,
  items: [itemSchema]
});
const List = mongoose.model("List", listSchema);

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
    if (err) {
      console.log(err);
    } else {
      if (!items) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully added the default items to the database.");
          }
        });
        res.redirect("/");
      } else {
        res.render("index", {
          appTitle: date.getDate(),
          items: items
        });
      }
    }
  });
});

app.post("/", function(req, res) {
  const listName = req.body.button;
  const item = req.body.nextItem;
  const newItem = new Item({
    itemName: item
  });

  if (listName === date.getDate()) {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      listName: _.capitalize(listName)
    }, function(err, list) {
      if (err) {
        console.log(err);
      } else {
        if(list !== null) {
          list.items.push(newItem);
          list.save();
        }
        res.redirect("/" + listName);
      }
    });
  }
});

app.post("/delete", function(req, res) {
  const itemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === date.getDate()) {
    Item.deleteOne({
      _id: itemId
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      listName: _.capitalize(listName)
    }, {
      $pull: {
        items: {
          _id: itemId
        }
      }
    }, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        /*if(list != null) {
          for(var i = 0; i < list.items.length; i++) {
            if(list.items[i]._id == itemId) {
              list.items.splice(i, 1);
              list.save();
              break;
            }
          }*/
      }
      res.redirect("/" + listName);
    });
  }
});

app.get("/:listName", function(req, res) {
  const listName = _.capitalize(req.params.listName);
  List.findOne({
    listName: listName
  }, function(err, list) {
    if (err) {
      console.log(err);
    } else {
      if (!list) {
        const newList = new List({
          listName: listName,
          items: defaultItems
        });
        newList.save();
        res.redirect("/" + req.params.listName);
      } else {
        res.render("index", {
          appTitle: list.listName,
          items: list.items
        });
      }
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});
var port = process.env.PORT;
if(port == null || port == "") {
  port=3000;
}
app.listen(port, function() {
  console.log("The server is now listening on port 3000.");
});
