const { Thought, User } = require('../models');

module.exports = {
  // get all thoughts
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // get single thought
  async getSingleThought(req, res) {
    try {
        // find thought by id
      const thought = await Thought.findOne({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create new thought
  async createThought(req, res) {
    try {
        // create new thought
      const thought = await Thought.create({
        thoughtText: req.body.thoughtText,
        username: req.body.username,
        userId: req.params.userId,

      });
        // adds newly created thought id to OP
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'No user with that ID',
        })
      }

      res.json({ message: 'Created the thought 🎉', thought });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // update thought info
  async updateThought(req, res) {
    try {
        // finds thought by id and updates
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

      res.json({ message: 'Updated thought 🎉', thought });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // post new reaction
  async addReaction(req, res) {
    try {
        // finds thought by id and adds reaction
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete thought from thought and from user
  async deleteThought(req, res) {
    try {
        // find thought by id and remove it
      const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

        // finds thought by id under user and removes it
      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'No user with this ID!',
        });
      }

      res.json({ message: 'Thought successfully deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // delete reaction by reactionId
  async removeReaction(req, res) {
    try {
        // finds thought by id and removes reaction
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this ID!' });
      }

      res.json({ message: 'Reaction successfully deleted!', thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
