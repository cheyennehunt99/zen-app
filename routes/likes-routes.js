const db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {
  //GET ALL Likes items for a user
  app.get("/likes", isAuthenticated, (req, res) => {
    db.Likes.findAll({
      where: {
        userId: req.user.id
      },
      include: db.Quote
    })
      .then(data => {
        //Set data to key for passing to handlebars
        const hbsObject = { likes: data };
        //Render data in handlebars
        res.status(200).render("likes", hbsObject);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  //GET one Likes item for a user, by id
  app.get("/api/like/:id", (req, res) => {
    db.Likes.findOne({
      where: {
        id: req.params.id,
        userId: req.body.userId
      },
      include: Quote
    })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  //POST Likes item for a user and a quote
  app.post("/api/likes", (req, res) => {
    db.Likes.create({
      userId: req.body.userId,
      quoteId: req.body.quoteId,
      reflection: req.body.reflection,
      hidden: false
    })
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

  //UPDATE Likes item hide or unhide by id
  app.put("/api/likes/:id", (req, res) => {
    db.Likes.update(
      {
        hidden: req.body.hidden
      },
      {
        where: {
          userId: req.body.userId,
          id: req.params.id
        }
      }
    )
      .then(data => {
        res.status(200).json(data);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });
};
