const {db, mongoose} = require('../Controller/database');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        require : true,
        unique : true
    },

    password : {
        type : String,
        require : true
    },

    first_name : {type: String},
    last_name : {type: String},
    user_type : [{
        type_id : {
            type: mongoose.Schema.ObjectId,
            ref : 'permissions'
        }
    }],
    status : {
        type: String,
        enum : ['active', 'deleted'],
        default : 'active'
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User