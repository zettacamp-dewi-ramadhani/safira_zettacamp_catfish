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

const getOneIngredient = async(parent,{filter})=>{
    if(!filter){
        console.log("Nothing to show");
    }else{
        const {id} = filter;
        let result = await Ingredient.findOne({
            _id : id
        });
        return result;
    }
}

const updateIngredient = async(parent, {input})=>{
    if(!input){
        console.log("Nothing to update")
    }else{
        const {id, newStock} = input;
        let data = await Ingredient.findByIdAndUpdate({
            _id : id
        },{
            $set : {
                stock : newStock
            }
        },{
            new : true
        });
        return data;
    }
}

const deleteIngredient = async(parent, {input},ctx)=>{
    try{
        if(!input){
            throw new Error('input the data first')
        }else{
            const {id, status} = input;
            let result = await Ingredient.findByIdAndUpdate({
                _id : id
            },{
                $set : {
                    status : status
                }
            },{
                new : true
            })
            return result
        }
    }catch(err){
        throw new Error('Error delete : ${err.message}');
    }
}

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