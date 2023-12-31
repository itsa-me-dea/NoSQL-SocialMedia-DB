const { Schema, model } = require('mongoose');
// used to validate if unique =  true, else presents error
var uniqueValidator = require('mongoose-unique-validator');

// Schema to create User model
const userSchema = new Schema(
  {
    username: { 
      type: String, 
      unique: true,
      required: true,
      // https://mongoosejs.com/docs/api/schemastring.html#SchemaString.prototype.trim()
      trim: true, 
    },
    email: { 
      type: String, 
      unique: true,
      required: true,
      // match validator for email regex
      // https://mongoosejs.com/docs/api/schemastring.html#SchemaString.prototype.match()
      match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, "Please enter a valid email."]
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // Allow for friendCount virtual
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `friendCount` that gets user's # of friends
userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return `Total Friends: ${this.friends.length}`;
  });

// validator to ensure unique username
userSchema.plugin(uniqueValidator);

// Initialize User model
const User = model('user', userSchema);

module.exports = User;
