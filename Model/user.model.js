const {db, mongoose} = require('../Controller/database');

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        require : true,
        unique : true
    },

    password : {
        type : String,
        require : true
    }
});

const User = mongoose.model('users', userSchema);

module.exports = User;