const Ingredient = require('./ingredient.model');
const Recipe = require('../Recipe/recipe.model')

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

const getAllIngredients = async(parent, {filter, paging})=>{
    let aggregateQuery = [];
    let matchQuerry = {
        $and : [{
            status: 'active'
        }],
    }
    
    let count = await Ingredient.count()
    
    if(filter){
        if(filter.name){
            const search = new RegExp(filter.name, 'i');
            matchQuerry.$and.push({
                name : search,
            })
        }
    
        if(filter.stock >=0){ 
            if(filter.stock === 0) {
                throw new Error ('Filter stock must greater then 0')
            }else if (filter.stock === null){
                throw new Error(`Filter stock can't null`)
            }else{
                matchQuerry.$and.push({
                    stock : filter.stock,
                })
            }
        }
    }

    if(matchQuerry.$and.length){
        aggregateQuery.push({
          $match: matchQuerry
        })
    }

    if(paging){
        const {limit, page} = paging;
        aggregateQuery.push({
            $skip : page*limit
        },{
            $limit : limit
        })
    }

    if(!aggregateQuery.length){
       let result = await Ingredient.find()
        return result
    }    
    
    let result = await Ingredient.aggregate(aggregateQuery)
    // console.log(result)
    // result = result.map((el)=>{
    //     return {
    //         ...el,
    //         count : result.length
    //     }
    // })
    result =  {
        data: result,
        TotalDocument : count,
        countResult: result.length
    }
    return result
}

const getOneIngredient = async(parent,{filter})=>{
    if(!filter){
        console.log("Nothing to show");
    }else{
        const {id} = filter;
        let result = await Ingredient.findOne({
            _id : id,
            status : 'active'
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

const validateDelete = async(id)=>{
    const result = await Recipe.find({
        "ingredients.ingredient_id" : id
    });
    return result
}

const deleteIngredient = async(parent, {input},ctx)=>{
    if(!input){
        throw new Error('Input the data first')
    }else{
        const {id} = input;
        const validate = await validateDelete(id);
        if(validate == 0){
            let result = await Ingredient.findByIdAndUpdate({
                _id : id
            },{
                $set : {
                    status : "deleted"
                }
            },{
                new : true
            })
            return result
        }else{
            throw new Error('The Ingredients already use in recipes');
        }
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