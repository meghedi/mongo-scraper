var db = require("../models");
module.exports = function(app) {
app.get('/', function(req, res){
    db.Article.find({isSaved: false}).then(function(dbArticle){
       const hbData = dbArticle.map(function(data) {
        return JSON.parse(JSON.stringify(data));
      });
     res.render("index", {articles: hbData});
    }).catch(function(err){
        res.json(err);
    });
});

app.get('/savedArticles', function(req, res){

    db.Article.find({isSaved: true}).populate("notes").then(function(dbArticle){
        const hbData = dbArticle.map(function(data) {
         return JSON.parse(JSON.stringify(data));
       });
       res.render("saved", {articles: hbData})
     }).catch(function(err){
         res.json(err);
     });
});
}