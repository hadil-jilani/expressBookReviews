const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let userwithsamename = users.filter((user) => user.username === username);
    if (userwithsamename.length >0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let validuser = users.filter((user) => user.username===username && user.password===password);
    if (validuser.length>0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;
  var username = req.session.authorization.username;
  let reviews = books[isbn].reviews
    reviews[username]=review;
    books[isbn].reviews=reviews;
    console.log(books[isbn].reviews);
  res.send(`The review for the book with ISBN ${isbn} has been add/updated.`);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    let reviews = books[isbn].reviews
    console.log(reviews);
    console.log(username);
    delete reviews[username];
    res.send(`Reviews for the book with the ISBN ${isbn} posted by user ${username} have been deleted.`);
}
);
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
