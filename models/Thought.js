const { Schema, model } = require('mongoose');
const dayjs = require('dayjs')
const Reaction = require('./Reaction');

// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: { 
      type: String, 
      required: true,
      // https://mongoosejs.com/docs/api/schemastring.html
      minlength: 1,
      maxlength: 280
    },
    createdAt: { 
      // https://mongoosejs.com/docs/schematypes.html#dates
      type: Date,
      default: Date.now,
      // Convert date with day.js
      get: function() {
        return dayjs(this.dateField).format('MMM DD, YYYY @ HH:mm');
      }, 
    },
    // User who created this thought
    username: { 
      type: String, 
      required: true,
    },
    // associated users id (needed in case of any updates to user)
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
      },
    reactions: [Reaction],
  },
  {
    // Allow for reactionCount virtual
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Create a virtual property `reactionCount` that gets # of reactions
thoughtSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return `Total Reactions: ${this.reactions.length}`;
  });

// Initialize Thought model
const Thought = model('thought', thoughtSchema);

module.exports = Thought;
