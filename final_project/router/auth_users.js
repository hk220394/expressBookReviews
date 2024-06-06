const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // const user = await User.findOne({ username });

    // if (!user) {
    //   return res.status(401).json({ message: 'Invalid username or password' });
    // }

    // const isValid = await bcrypt.compare(password, user.password);

    // if (!isValid) {
    //   return res.status(401).json({ message: 'Invalid username or password' });
    // }

    const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });

    res.status(200).json({ token, message: 'Logged in successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", async (req, res) => {
  //Write your code here
  try {
    const { user, review } = req.body;
    let booksData = {}
    for (let key of Object.keys(books)) {
      booksData[books[key]["isbn"]] = { ...books[key], id: key }
    }
    console.log(booksData[req.params.isbn])
    if (!booksData[req.params.isbn]) {
      console.log(`Book with ISBN ${req.params.isbn} not found.`);
      return;
    }

    if (!booksData[req.params.isbn].reviews) {
      booksData[req.params.isbn].reviews = {};
    }

    if (Object.keys(booksData[req.params.isbn].reviews).includes(user)) {
      booksData[req.params.isbn].reviews[user] = review;
    } else {
      booksData[req.params.isbn].reviews[user] = review;
    }
    res.status(200).json({ message: `The Review for the book of the isbn ${req.params.isbn} has been added/updated `, updated:booksData[req.params.isbn] });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

regd_users.delete("/auth/review/:isbn/:user", async (req, res) => {
  try {
    let booksData = {};
    for (let key of Object.keys(books)) {
      booksData[books[key]["isbn"]] = { ...books[key], id: key };
    }

    const { isbn, user } = req.params;

    if (!booksData[isbn]) {
      console.log(`Book with ISBN ${isbn} not found.`);
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }

    if (!booksData[isbn].reviews || !booksData[isbn].reviews[user]) {
      return res.status(404).json({ message: `Review by user ${user} not found for the book with ISBN ${isbn}.` });
    }

    delete booksData[isbn].reviews[user];

    res.status(200).json({ message: `The review by user ${user} for the book with ISBN ${isbn} has been deleted.`, updated: booksData[isbn] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
