const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async function(req, res) {
    try {
      // Simulating asynchronous operation with async/await
      const response = await new Promise((resolve) => resolve(JSON.stringify(books, null, 4)));
      return res.send(response);
    } catch (error) {
      // Handle possible errors that might occur within the asynchronous operation
      return res.status(500).send('An error occurred');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
    const isbn = req.params.isbn;
  
    // Simulate fetching book data as if it's an asynchronous operation
    new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject('Book not found');
      }
    })
    .then(book => {
      res.send(book);
    })
    .catch(error => {
      res.status(404).send(error);
    });
});
  

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        // Simulating an asynchronous fetch operation
        const filteredAuthors = await new Promise((resolve, reject) => {
            const results = Object.values(books).filter((book) => 
                book.author.toLowerCase().includes(author.toLowerCase())
            );

            if (results.length > 0) {
                resolve(results);
            } else {
                reject('No book found under that author');
            }
        });

        // If the promise resolves, send the results
        return res.send(filteredAuthors);
    } catch (error) {
        // If the promise rejects, send a 404 error
        return res.status(404).send(error);
    }
});


// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;

    // Create a promise to handle the filter operation
    new Promise((resolve, reject) => {
        const results = Object.values(books).filter(book => 
            book.title.toLowerCase().includes(title.toLowerCase())
        );

        if (results.length > 0) {
            resolve(results);
        } else {
            reject('No book found under that title');
        }
    })
    .then(filteredTitles => {
        // If the promise resolves, send the filtered titles
        res.send(filteredTitles);
    })
    .catch(error => {
        // If the promise rejects, send a 404 error
        res.status(404).send(error);
    });
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if(isbn < 4) {
    return res.send('Best seller');
  }
  if(isbn >= 4 || isbn < 8) {
    return res.send('Very Recommended')
  } 
  if(isbn >= 8) {
    return res.send('Recommended')
  }
  else {
    res.status(404).send('Book not found');
  }
});

module.exports.general = public_users;
