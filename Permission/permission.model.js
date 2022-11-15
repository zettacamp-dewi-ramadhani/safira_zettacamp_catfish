const {db, mongoose} = require('../Controller/database');

const permissionSchema = new mongoose.Schema({
    role : {type : String},
    access :  [{
        name : {type :String},
        view : {type : Boolean}
    }]
});

const Permission = mongoose.model('permissions', permissionSchema);
module.exports = Permission