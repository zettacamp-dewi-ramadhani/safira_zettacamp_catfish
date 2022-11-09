const {db, mongoose} = require('../Controller/database');

const ingredientSchema = new mongoose.Schema({
    name : {type: String},
    stock: {type: Number},
    status : {
        type: String,
        enum : ['active', 'deleted'],
        default : 'active'
    }
});

const Ingredient = mongoose.model('ingredients', ingredientSchema);
module.exports = Ingredient;