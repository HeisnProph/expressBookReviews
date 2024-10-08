const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
// const axios = require('axios');


public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  return Promise.resolve(res.status(200).send(JSON.stringify(books, null, 4)));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return Promise.resolve(res.status(200).send(books[isbn]));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filterBooks = {};
  for (const key in books) {
    if (books[key]["author"] === author) filterBooks[key] = books[key];
  }
  if (Object.keys(filterBooks).length > 0) {
    return Promise.resolve(res.status(200).send(JSON.stringify(filterBooks)));
  } else {
    return Promise.resolve(res.status(200).json({ message: "No matched books" }));
  }
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filterBooks = {};
  for (const key in books) {
    if (books[key]["title"] === title) filterBooks[key] = books[key];
  }
  if (Object.keys(filterBooks).length > 0) {
    return Promise.resolve(res.status(200).send(JSON.stringify(filterBooks)));
  } else {
    return Promise.resolve(res.status(200).json({ message: "No matched books" }));
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const key = req.params.isbn;
  return res.status(200).send(JSON.stringify(books[key]["reviews"]));
});

module.exports.general = public_users;
