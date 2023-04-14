const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

//Chainable Routing

///////////////////// Request targeting all the Articles ////////////////////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find()
        .then((results) => {
            // console.log(results);
            res.send(results);
        })
        .catch((err)=>{
            console.log(err);
        });
  
    })

    .post((req, res) => {
        console.log(req.body.title);
        console.log(req.body.content);

        const newArticle = new Article({
            title : req.body.title,
            content : req.body.content
        });

        newArticle.save()
        .then((results)=>{
            console.log("Successfully added a new article!");
            res.send(results);
            // res.send("Successfully added a new article!");
        })
        .catch((err)=>{
            console.log(err);
        })
    })

    .delete((req, res) => {

        Article.deleteMany()
        .then(()=>{
            res.send("Succesfully deleted all articles!");
        })
        .catch((err)=>{
            request.send(err);
        })
   
    })

    ////////////// Request targetting a specific Article ////////////////////////////////

    // localhost:3000/articles/car

    app.route("/articles/:articletitle")

    // req.params.articletitle  = "car"
    .get((req, res) => {

        Article.findOne({title: req.params.articletitle})
        .then((result) => {
            // console.log(results);
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
            res.send('No Article matching that title was found');
        });
  
    })

    .put((req, res)=>{

        Article.replaceOne({title: req.params.articletitle},{title: req.body.title, content: req.body.content})
        .then((result) => {
                res.send("Successfully updated article");
        })
        .catch((err)=>{
            console.log(err);
            res.send('No matching article found');
        })

    })

    .patch((req, res) => {

        Article.updateOne({title: req.params.articletitle}, {$set: req.body})
        .then((results)=>{
            console.log(results);
            res.send(results);
        })
        .catch((err)=>{
            console.log(err);
            res.send(err);
        })
    })

    .delete((req, res) => {

        Article.deleteOne({title: req.params.articletitle})
        .then((results)=>{
            // res.send(results);
            res.send("Succesfully deleted the corresponding article!");
        })
        .catch((err)=>{
            request.send(err);
        })
   
    })

app.listen(3000, ()=>{
    console.log("Server started on port 3000");
});