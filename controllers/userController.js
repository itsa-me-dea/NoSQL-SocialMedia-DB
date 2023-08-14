const { User, Thought } = require('../models');

module.exports = {
  // get all users
  async getUsers(req, res) {
    try {
      // finds all users
      const users = await User.find();
      // presents all users as json
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get a single user
  async getSingleUser(req, res) {
    try {
      // finds single user by id
      const user = await User.findOne({ _id: req.params.userId })
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID!' });
      }

      // presents single user as json
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
      // sends out error body doesnt satisfy criteria 
      res.status(500).json(err);
    }
  },
  // update user info
  async updateUser(req, res) {
    try {
      // find user by id and update
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID!' });
      }
      
      // update username on thoughts associated with user
      await Thought.updateMany({ userId: req.params.userId }, { username: user.username });
      // sends out message and presents updated user info
      res.json({ message: 'Updated user info 🎉', user });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // post new friend
  async addFriend(req, res) {
    try {
      // finds user by id and adds friend to friend list
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'No user with that ID!',
        })
      }

      // sends message if successful else presents error
      res.json('Added friend 🎉');
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // delete a user and associated thoughts
  async deleteUser(req, res) {
    try {
      // finds user by id and deletes
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID!' });
      }

      // deletes user from friends list
      await User.updateMany(
        { friends: user._id },
        { $pull: { friends: user._id } }
      );

      // deletes any thoughts associate with user
      await Thought.deleteMany({ username: user.username });
      // sends message if successful else presents error
      res.json({ message: 'User and associated thoughts deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete friend by friendId
  async removeFriend(req, res) {
    try {
      // ADDRESS LATER
      const friend = await User.findOne({ _id: req.params.friendId });

      if (!friend) {
        return res.status(404).json({ message: 'No friend with this ID!' });
      }

      // finds user by id and removes friend
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'No user with that ID!',
        });
      }

      // sends message if successful else presents error
      res.json('Friend successfully deleted!');
    } catch (err) {
      res.status(500).json({ message: 'No friend with this ID', err });
    }
  },
};
