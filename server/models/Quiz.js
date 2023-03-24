const { Schema } = require('mongoose');
const questionSchema = require('./Question');

const quizSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    questions: [questionSchema]
  },
  {
    toJSON: {
      virtuals: true
    }
  }
);

// get questionCount when we ask for the total number of question in the quiz
quizSchema.virtual('questionCount').get(function () {
  return this.questions.length;
});

const Quiz = model('Quiz', quizSchema);

module.exports = Quiz;