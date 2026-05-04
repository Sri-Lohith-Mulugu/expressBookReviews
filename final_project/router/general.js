const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register customer."});
});

// Task 10: Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
  try {
    // Simulating an external call to the local server as per requirement
    const response = await axios.get("http://localhost:5000/books");
    res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books", error: error.message});
  }
});

// Task 11: Get book details based on ISBN using Promises with Axios
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/books/${isbn}`)
    .then(response => {
      res.status(200).send(JSON.stringify(response.data, null, 4));
    })
    .catch(error => {
      res.status(404).json({message: "Book not found", error: error.message});
    });
 });
  
// Task 12: Get book details based on author using async-await with Axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get("http://localhost:5000/books");
    const booksByAuthor = Object.values(response.data).filter(book => book.author === author);
    
    if (booksByAuthor.length > 0) {
      res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      res.status(404).json({message: "No books found for this author"});
    }
  } catch (error) {
    res.status(500).json({message: "Error retrieving books by author"});
  }
});

// Task 13: Get all books based on title using async-await with Axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
    const response = await axios.get("http://localhost:5000/books");
    const booksByTitle = Object.values(response.data).filter(book => book.title === title);
    
    if (booksByTitle.length > 0) {
      res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
      res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    res.status(500).json({message: "Error retrieving books by title"});
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({message: "No reviews found for this ISBN"});
  }
});

// Internal endpoint to serve data for Axios calls
public_users.get('/books', (req, res) => {
  res.send(JSON.stringify(books));
});

public_users.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(JSON.stringify(books[isbn]));
  } else {
    res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
