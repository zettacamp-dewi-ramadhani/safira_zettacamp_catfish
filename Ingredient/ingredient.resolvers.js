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
        if(filter.stock>0){
            aggregateQuery[indexMatch].$match.$and.push({
                stock : filter.stock,
                status: 'active',
            })
        } else {
            throw new Error ('Filter stock must greater then 0')
        }
    }

    if(paging){
        const {limit, page} = paging;
        aggregateQuery.push({
            $match : {
                status : 'active'
            }
        },{
            $skip : page*limit
        },{
            $limit : limit
        })
    }

    let result = [];
    filter || paging ? result = await Ingredient.aggregate(aggregateQuery) : result = await Ingredient.find().toArray();
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

const deleteIngredient = async(parent, {input},ctx)=>{
        if(!input){
            throw new ApolloError('Input the data first')
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