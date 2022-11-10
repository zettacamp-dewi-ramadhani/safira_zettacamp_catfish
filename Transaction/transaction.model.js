const {db, mongoose} = require('../Controller/database');

const transactionSchema = new mongoose.Schema({
    user_id : {
        type : mongoose.Schema.ObjectId,
        ref : 'users'
    },
    menu : [{
        recipe_id : {
            type : mongoose.Schema.ObjectId,
            ref : 'recipes'
        },
        amount : {type: Number},
        note : {
            type : String,
            default : '-'
        }
    }],
    order_status : {
        type : String,
        enum : ['success', 'failed'],
        default : 'success'
    },
    order_date : {
        type : Date,
        default : Date.now()
    },
    status : {
        type: String,
        enum : ['active', 'deleted'],
        default : 'active'
    }
});

const Transaction = mongoose.model('transactions', transactionSchema);
module.exports = Transaction;