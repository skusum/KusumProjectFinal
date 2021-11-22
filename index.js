const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var mongoose = require("mongoose");
const resModel = require("./model");
const path = require("path");
const sentiment = require('sentiment');
const { kMaxLength } = require("buffer");
const Sentimentobj = new sentiment();
const port = process.env.PORT || 8000;
///MOngog DB Connection
var mongoDB =
  // "mongodb+srv://Requin:Requin@cluster0.0vcok.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
  "mongodb+srv://kusum:habbod12@cluster0.igjkc.mongodb.net/sample_professors?retryWrites=true&w=majority";

mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connection succesful"))
  .catch((err) => console.error(err));

// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
//  Add Resturant
app.post("/add", (req, res) => {
  const { Professor_ID, Difficulty, Quality, review} = req.body;
  //const address = { building, street, zipcode };
  console.log(req.body);
  var docx = Sentimentobj.analyze(req.body.review);
  const Polarity = docx.score;
  const prof = new resModel({ Professor_ID, Difficulty, Quality, review, Polarity });
  try {
    prof.save().then((data) => {
      res.send(data);
      
    });
  } catch (error) {
    res.status(500).send(error);
  }
});


app.post("/search", (req, res) => {
  resModel
    .find({ Professor_ID: req.body.professor_id })
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => console.error(error));
});

app.post("/overall", (req, res) => {
  resModel
    .find({ Professor_ID: req.body.professor_id })
    .then((data) => {
      
      let qualSum =0;
      let diffSum = 0;
      let polSum = 0;
      let itemsFound =0;
      const len = data.length;
      let item = null;
      var dict ={};
      for (let i=0; i <len; i++){
        item = data[i];
        
          qualSum = item["Quality"]+qualSum;
          diffSum = item["Difficulty"]+diffSum;
          polSum = item["Polarity"]+polSum;
          itemsFound = itemsFound+1;
        
      }
      const aveQual = qualSum/itemsFound;
      const aveDiff = diffSum/itemsFound;
      const avePol = polSum/itemsFound;
      
      dict["Professor_ID"] = req.body.professor_id;
      dict["Total number of Reviews"] = itemsFound;
      dict["Overall Quality"] = aveQual;
      dict["Overall Difficulty"] = aveDiff;
      dict["Overall Polarity"] = avePol;
      //console.log(dict);
      //res.json(len);
      res.json(dict);
    })
    .catch((error) => console.error(error));
});

app.listen(port, () => {
  console.log('listening to the port at ${port}')
});
