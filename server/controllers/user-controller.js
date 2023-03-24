const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  // get user using id
  async getUser({ params }, res) {
    const foundUser = await User.findOne({ _id: req.params.id })
      // getting all quizzes of the user
      .populate({
        path: 'quizzes',
        select: '-__v'
      })
      // getting all save quizzes of the user
      .populate({
        path: 'savedquiz',
        select: '-__v'
      });
    
    if (!foundUser) {
      return res.status(404).json({ message: 'No user found with this id.' });
    }

    res.json(foundUser);
  },

  // create User
  async createUser({ body }, res) {
    const user = await User.create(body);
    if (!user) {
      return res.status(400).json({ message: 'Error in creating User' });
    }

    const token = signToken(user);
    res.json({ token, user });
  },

  // login
  async login({ body }, res) {
    const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });

    if (!user) {
      return res.status(404).json({ message: 'No user found with this username or email.' });
    }

    // checking to see if the password is correct
    const correctPassword = await user.isCorrectPassword(body.password);

    if (!correctPassword) {
      return res.status(400).json({ message: 'Password is wrong' });
    }

    const token = signToken(user);
    res.json({ token, user });
  },

  // save a quiz to a user's "savedquiz" 
  async saveQuiz({ user, params }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $addToSet: { savedquiz: params.quizId } },
        { new: true, runValidators: true }
      );
      return res.json(updatedUser);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  },

  // remove saveQuiz
  async removeSaveQuiz({ user, params }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $pull: { savedquiz: params.quizId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't find User with this id!" });
    }
    return res.json(updatedUser);
  }
}