const { Schema } = require('mongoose');

const questionSchema = new Schema({
  question: {
    type: String,
    require: true
  },
  anwser: {
    type: String,
    required: true
  }
});

module.exports = questionSchema;