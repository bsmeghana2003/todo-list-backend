var express = require('express');
const sha256 = require('sha256');

var router = express.Router();

router.post('/user/add', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var collection = req.db.collection("users");
  var dataToInsert = {
    username: username,
    password: sha256(password)
  };
  collection.insertOne(dataToInsert).then(function (data) {
    if (data) {
      res.send({
        status: "Success",
        data: "User added successfully"
      });
    } else {
      res.send({
        status: "Error",
        err: "Failed to create user"
      });
    }
  })
});


router.get('/user/login', function (req, res, next) {
  var username = req.query.username;
  var password = req.query.password;
  var collection = req.db.collection("users");
  collection.findOne({ username: username, password: sha256(password) }).then(function (data) {
    if (data) {
      res.send({
        status: "Success",
        data: "Correct credentials"
      });
    } else {
      res.send({
        status: "Error",
        err: "Wrong credentials"
      });
    }
  });

});

router.post('/user/add-list', function (req, res, next) {
  var username = req.body.username;
  var todo = req.body.todo;
  var collection = req.db.collection("todo-list");
  var dataToInsert = {
    username: username,
    todo: todo,
    unique_id: username + "_" + Math.floor(Date.now() / 1000),
    status: "Pending"
  };
  collection.insertOne(dataToInsert).then(function (data) {
    if (data) {
      res.send({
        status: "Success",
        data: "User list added successfully"
      });
    } else {
      res.send({
        status: "Error",
        err: "Failed to create list"
      });
    }
  })
});

router.get('/user/added-todos/pending', function (req, res, next) {
  var username = req.query.username;
  var collection = req.db.collection("todo-list");
  collection.find({ username: username, status: "Pending" }).toArray().then(function (data) {
    if (data) {
      res.send({
        status: "Success",
        data: data
      });
    } else {
      res.send({
        status: "Error",
        err: "Failed to fetch list"
      });
    }
  })
});

router.get('/user/added-todos/completed', function (req, res, next) {
  var username = req.query.username;
  var collection = req.db.collection("todo-list");
  collection.find({ username: username, status: "Completed" }).toArray().then(function (data) {
    if (data) {
      res.send({
        status: "Success",
        data: data
      });
    } else {
      res.send({
        status: "Error",
        err: "Failed to fetch list"
      });
    }
  })
});

router.post('/user/added-todos/complete', function (req, res, next) {
  var username = req.body.username;
  var unique_ids = req.body.unique_ids;
  var collection = req.db.collection("todo-list");
  collection.updateMany(
    { username: username, unique_id: { $in: unique_ids } },
    { $set: { status: "Completed" } }
  ).then(function (data) {
    if (data) {
      res.send({
        status: "Success",
        data: "Todo updated successfully"
      });
    } else {
      res.send({
        status: "Error",
        err: "Failed to update todo"
      });
    }
  })

});

module.exports = router;
