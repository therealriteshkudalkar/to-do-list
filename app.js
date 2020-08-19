require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

mongoose.set('useFindAndModify', false);

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@cluster0-rrd7o.mongodb.net/todolistDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(function(err) {
  console.log(err);
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
  itemName: "Press on 'New Item' 👇🏻 to type"
});

const item2 = new Item({
  itemName: "Hit the ➕ button to add that item to the list"
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
  }).catch(function(err) {
    console.log("The find query failed", err);
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
        if (list !== null) {
          list.items.push(newItem);
          list.save();
        }
        res.redirect("/" + listName);
      }
    });
  }
});

app.put("/", function(req, res) {
  const itemName = req.body.itemName;
  const listName = req.body.listName;
  const newItem = new Item({
    itemName: itemName
  });

  if (listName === date.getDate()) {
    newItem.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        Item.find(function(err, items) {
          if (err) {
            console.log(err);
          } else {
            res.send({
              listName: listName,
              listItems: items
            });
          }
        });
      }
    });
  } else {
    List.findOne({
      listName: _.capitalize(listName)
    }, function(err, list) {
      if (err) {
        console.log(err);
      } else {
        if (list !== null) {
          list.items.push(newItem);
          list.save();
          res.send({listName: listName, listItems: list.items});
        }
      }
    });
  }
});

app.delete("/", function(req, res) {
  const itemId = req.body.itemId;
  const listName = req.body.listName;
  if (listName === date.getDate()) {
    Item.deleteOne({
      _id: itemId
    }, function(err) {
      if (err) {
        console.log(err);
      } else {
        Item.find(function(err, items) {
          res.send({
            listName: listName,
            listItems: items
          });
        });
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
        List.findOne({
          listName: _.capitalize(listName)
        }, function(err, list) {
          if (err) {
            console.log(err);
          } else {
            res.send({
              listName: listName,
              listItems: list.items
            });
          }
        });
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
        console.log(result);
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
  }).catch(function(err) {
    console.log("The find One query failed", err);
  });
});

app.get("/about/app", function(req, res) {
  res.render("about");
});

var port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("The server is now listening on port 3000.");
});
