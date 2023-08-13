const { User, Thought } = require('../models');

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID!' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // update user info
  async updateUser(req, res) {
    try {
      const user = await user.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID!' });
      }

      res.json(user);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // post new friend
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { friends: req.body.friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'No user with that ID!',
        })
      }

      res.json('Added friend 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // delete a user and associated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID!' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated thoughts deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete friend by friendId
  async removeFriend(req, res) {
    try {
      // not sure if this'll work, check here first for debugging
      const friend = await User.findOne({ _id: req.params.friendId });

      if (!friend) {
        return res.status(404).json({ message: 'No friend with this ID!' });
      }
      // to here

      const user = await User.findOneAndUpdate(
        { friends: req.body.friendId },
        { $pull: { friends: req.body.friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'No user with that ID!',
        });
      }

      res.json({ message: 'Friend successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
