const { db, mongoose } = require("../Middleware/database");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },

  password: {
    type: String,
    require: true
  },

  first_name: { type: String },
  last_name: { type: String },
  user_type: [
    {
      name: { type: String },
      view: { type: Boolean }
    }
  ],

  status: {
    type: String,
    enum: ["active", "deleted"],
    default: "active"
  },
  wallet: { type: Number }
});

const User = mongoose.model("users", userSchema);
module.exports = User;
