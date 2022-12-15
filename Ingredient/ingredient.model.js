const { db, mongoose } = require("../Middleware/database");
const moment = require("moment");

// create schema for database
const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  stock: { type: Number },
  status: {
    type: String,
    enum: ["active", "deleted"],
    default: "active"
  },
  created_at: {
    type: Date,
    default: Date.now()
  }
});

// create model from schema and database
const Ingredient = mongoose.model("ingredients", ingredientSchema);
module.exports = Ingredient;
