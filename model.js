var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var professor = new Schema({
  Professor_ID: String,
  review: String,
  Difficulty: Number,
  Quality: Number,
  Polarity: Number,
  numOfSentences: Number
 

  
});
module.exports = mongoose.model("professors", professor);
