const Ingredient = require('./ingredient.model');
const Recipe = require('../Recipe/recipe.model');

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
    if(filter){
        let indexMatch = aggregateQuery.push({
            $match : {
                $and : []
            }
        }) - 1;
        
        if(filter.name){
            const search = new RegExp(filter.name, 'i');
            aggregateQuery[indexMatch].$match.$and.push({
                name : search,
                status: 'active',
            })
        }
if(filter.stock){
            const search = new RegExp(filter.stock, 'i')
            if(search === 0) {
                throw new Error ('Filter stock must greater then 0')
            }else{
                aggregateQuery[indexMatch].$match.$and.push({
                    stock : {
                    $gte : search
                },
                    status: 'active',
                })
            }
        }
    }

    if(paging){
        const {limit, page} = paging;
        aggregateQuery.push({
            $skip : page*limit
        },{
            $limit : limit
        },{
            $match : {
                status : 'active'
            }
        })
    }

    let result = [];
    filter || paging ? result = await Ingredient.aggregate(aggregateQuery) : result = await Ingredient.find().toArray()
    return result
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
            const {id, status} = input;
            const validate = await validateDelete(id);
            if(validate == 0){
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