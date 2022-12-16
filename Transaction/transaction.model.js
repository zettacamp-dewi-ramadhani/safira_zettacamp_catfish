const { mongoose } = require("../Middleware/database");
const moment = require("moment");

const transactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "users"
  },
  menu: [
    {
      recipe_id: {
        type: mongoose.Schema.ObjectId,
        ref: "recipes"
      },
      amount: { type: Number },
      note: {
        type: String,
        default: "-"
      }
    }
  ],
  total: { type: Number },
  order_status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "success"
  },
  order_date: {
    type: String,
    default: moment(new Date()).locale("id-ID").format("LL")
  },
  status: {
    type: String,
    enum: ["active", "deleted"],
    default: "active"
  },
  confirm: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: new Date()
  }
});

const Transaction = mongoose.model("transactions", transactionSchema);
module.exports = Transaction;
