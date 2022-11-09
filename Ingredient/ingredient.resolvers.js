const Ingredient = require('./ingredient.model');

const insertIngredient = async(parent, {input})=>{
    if(!input){
        console.log("Nothing to insert")
    }else{
        const {name, stock} = input;
        let data = new Ingredient({
            name : name,
            stock : stock
        });
        await data.save();
        return data;
    }
}

const getAllIngredients = async(parent, {filter})=>{
    const {name, stock, paging} = filter;
    if(!name && !stock){
        let result = await Ingredient.aggregate([{
            $skip : paging.page * paging.limit
        },{
            $limit : paging.limit
        }]);
        return result;
    }else if(name && !stock){
        let result = await Ingredient.aggregate([{
            $match : {
                name : name
            }
        },{
            $skip : paging.page * paging.limit
        },{
            $limit : paging.limit
        }])
        return result;
    }else if(!name && stock>0){
        let result = await Ingredient.aggregate([{
            $match : {
                stock  : {
                    $gte : stock
                }
            }
        },{
            $skip : paging.page * paging.limit
        },{
            $limit : paging.limit
        }]);
        return result;
    }else if(name && stock>0){
        let result = await Ingredient.aggregate([{
            $match : {
                name : name,
                stock  : {
                    $gte : stock
                }
            }
        },{
            $skip : paging.page * paging.limit
        },{
            $limit : paging.limit
        }]);
        return result;
    }
}
const getOneIngredient = ()=>{}
const updateIngredient = ()=>{}
const deleteIngredient = ()=>{}

const IngredientResolvers = {
    Query : {
        getAllIngredients,
        getOneIngredient
    },

    Mutation : {
        insertIngredient,
        updateIngredient,
        deleteIngredient
    }
}

module.exports =  {IngredientResolvers}