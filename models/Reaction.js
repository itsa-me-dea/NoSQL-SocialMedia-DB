const { Schema, Types } = require('mongoose');
const dayjs = require('dayjs')

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    // User who reacted
    username: { 
        type: String, 
        required: true,
      },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function() {
        return dayjs(this.dateField).format('MMM DD, YYYY @ HH:mm');
      }, 
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

module.exports = reactionSchema;