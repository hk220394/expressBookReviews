const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bcrypt = require('bcryptjs');


public_users.post("/register", async (req, res) => {
  //Write your code here
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // const existingUser = await User.findOne({ username });

    // if (existingUser) {
    //   return res.status(400).json({ message: 'Username already exists' });
    // }

    const hashedPassword = await bcrypt.hash(password, 10);
    // const user = new User({ username, password: hashedPassword });

    // await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  //Write your code here
  let result = await booksFilter("isbn", req.params.isbn)
  return res.status(300).json(result);
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  //Write your code here
  let result = await booksFilter("author", req.params.author)
  return res.status(300).json(result);
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  //Write your code here
  let result = await booksFilter("title", req.params.title)
  return res.status(300).json(result);

});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  //Write your code here
  const reviews = []
  for (const key in books) {
    if (String(books[key].isbn) === String(req.params.isbn)) {
      console.log(books[key].isbn === req.params.isbn)
      reviews.push(books[key].reviews);
    }
  }
  return res.status(300).json(reviews);
});

const booksFilter = async (keyItem, matchItem) => {
  console.log(matchItem, keyItem)
  const filteredBooks = [];
  for (const key in books) {
    if (books[key][keyItem] === matchItem) {
      filteredBooks.push({ id: key, ...books[key] });
    }
  }
  return filteredBooks
}

module.exports.general = public_users;
