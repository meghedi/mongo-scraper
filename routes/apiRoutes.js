var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");

module.exports = function (app) {
  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://thenextweb.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children("a").text();
        result.link = $(this).children("a").attr("href");

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            console.log(dbArticle);
          })
          .catch(function (err) {
            console.log(err);
          });
      });

      res.send("true");
      // Send a message to the client
      // res.send("Scrape Complete");
    });
  });

  app.put("/api/updateArticle/:id", function (req, res) {
    db.Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { isSaved: true } },
      { new: true }
    ).then(function (dbArticle) {
      console.log(dbArticle);
      res.json("updated");
    });
  });

  app.delete("/api/deleteall", function (req, res) {
    db.Article.remove().then(function () {
      db.Note.remove();
      res.json("deleted");
    });
  });

  app.post("/api/createNote", function (req, res) {
    db.Note.create(req.body)
      .then(function (dbNote) {
        res.json(dbNote);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.get("/api/articles/:id", function (req, res) {
    db.Note.find({
      article: req.params.id,
    }).then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.delete("/api/deleteNote/:id", function (req, res) {
    db.Note.remove({
      _id: req.params.id,
    }).then(function () {
      res.json("note deleted");
    });
  });

  app.put('/api/deleteFromSaved/:id', function(req, res){
      db.Article.findOneAndUpdate(
        { _id: req.params.id },
        { $set: { isSaved: false } },
        { new: true }
      ).then(function (dbAricle) {
        return db.Note.deleteMany({article: dbAricle._id});
      }).then(function(){
        console.log('notes assocaited deleted');
        window.location.reload();
      })
      .catch(function(err) {
        res.json(err);
      });
  });

};
