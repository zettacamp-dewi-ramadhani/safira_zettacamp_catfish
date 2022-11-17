const {db, mongoose} = require('../Controller/database')

const recipeSchema = new mongoose.Schema({
    recipe_name : {type : String},
    ingredients : [{
        _id : false,
        ingredient_id : {
            type: mongoose.Schema.ObjectId,
            ref : 'ingredients'
        },
        stock_used : {type: Number}
    }],
    price: {type: Number},
    image: {type: String},
    info_recipe: {
        type : String,
        enum : ['available', 'unvailable'],
        default : 'available'
    },
    status : {
        type: String,
        enum : ['active', 'deleted'],
        default : 'active'
    }
});

const Recipe = mongoose.model('recipes', recipeSchema);
module.exports = Recipe;