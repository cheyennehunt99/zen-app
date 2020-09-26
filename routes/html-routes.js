// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

//Require models to access db
const db = require("../models");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  app.get("/", (req, res) => {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/main");
    }
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/main", isAuthenticated, (req, res) => {
    db.Quote.findOne({
      attributes: ["quote_body", "quote_author", "image_url", "id"],
      order: [["id", "DESC"]]
    }).then(data => {
      res.render("index", {
        quote: data.dataValues.quote_body,
        author: data.dataValues.quote_author,
        url: data.dataValues.image_url,
        id: data.dataValues.id
      });
    });
  });

  app.get("/checklist", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/checklist.html"));
  });

  app.use((req, res, next) => {
    res.status(404).send("Sorry can't find that!");
    next();
  });
};
