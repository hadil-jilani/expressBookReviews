const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    let userwithsamename = users.filter((user) => user.username === username);
    if (userwithsamename.length >0){
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
      if (doesExist(username)){
          return res.status(404).json({message:"Customer already exists!"});
      } else {
          users.push({"username":username, "password": password});
          return res.status(200).json({message:"Customer successfully registered. You can now login."});
      }
  }
  console.log(username);
  return res.status(404).json({message: "Unable to register customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
//   const isbns = Object.keys(books).map((key)=>parseInt(key));
  let filtered_books = [];
  for (isbn in books) {
      if (books[isbn].author === author) {
        filtered_books.push({
            "isbn":isbn,
            "title": books[isbn].title,
            "reviews": books[isbn].reviews
        });
      }}
  
  res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
//   const isbns = Object.keys(books).map((key)=>parseInt(key));
  let filtered_books = [];
  for (isbn in books) {
      if (books[isbn].title === title) {
        filtered_books.push({
            "isbn":isbn,
            "title": books[isbn].title,
            "reviews": books[isbn].reviews
        });
      }}
  
  res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    // const keys = Object.keys(books).map((key)=>parseInt(key));
    let filtered_books = [];
    for (key in books) {
        if (key === isbn) {
          filtered_books.push({
              "isbn":key,
              "reviews": books[key].reviews
          });
        }}
    
    res.send(filtered_books);
  });

// TASK 10 - Get the book list available in the shop using promises
public_users.get('/books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });

// Task 11 - Get book details based on ISBN
public_users.get('/isbn-promise/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const get_book_details = new Promise((resolve, reject) => {
        resolve(res.send(books[isbn]));
    });
    get_book_details.then(() => console.log("Promise for Task 11 resolved"))
   });

// Task 12 - Get book details based on author
public_users.get('/author-promise/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;
    const get_book_by_author = new Promise((resolve, reject) => {
        let filtered_books = [];
        for (isbn in books) {
            if (books[isbn].author === author) {
              filtered_books.push({
                  "isbn":isbn,
                  "title": books[isbn].title,
                  "reviews": books[isbn].reviews
              });
            }}
            resolve(res.send(filtered_books));
    });
    get_book_by_author.then(() => console.log("Promise for Task 12 resolved"));
  });

// Task 13 - Get book details based on title
public_users.get('/title-promise/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;
  //   const isbns = Object.keys(books).map((key)=>parseInt(key));
  const get_book_details_by_title = new Promise((resolve, reject) => {
      let filtered_books = [];
      for (isbn in books) {
          if (books[isbn].title === title) {
            filtered_books.push({
                "isbn":isbn,
                "title": books[isbn].title,
                "reviews": books[isbn].reviews
            });
          }}
      
      resolve(res.send(filtered_books));
  });
  get_book_details_by_title.then(() => console.log("Promise for Task 13 resolved"))
  });
module.exports.general = public_users;
