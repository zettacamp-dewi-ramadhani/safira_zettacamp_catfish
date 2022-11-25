const Transaction = require("./transaction.model");
const Ingredient = require("../Ingredient/ingredient.model");
const Recipe = require("../Recipe/recipe.model");
const moment = require("moment");
const mongoose = require("mongoose");

moment.locale("id-ID");

const reduceIngredientStock = async menu => {
  for (const recipe of menu) {
    recipeData = await Recipe.findOne({
      _id: recipe.recipe_id
    });
    for (const ingredient of recipeData.ingredients) {
      const amountData = ingredient.stock_used * recipe.amount;
      ingredientData = await Ingredient.updateOne(
        {
          _id: ingredient.ingredient_id,
          stock: {
            $gte: 0
          }
        },
        {
          $inc: {
            stock: -amountData
          }
        }
      );
    }
  }
  return true;
};

const validateStockIngredient = async (menu, amount) => {
  let recipeData = [];
  let ingredientData = [];
  let available = [];
  for (const recipe of menu) {
    recipeData = await Recipe.findOne({
      _id: recipe.recipe_id
    });
    for (const ingredient of recipeData.ingredients) {
      ingredientData = await Ingredient.findOne({
        _id: ingredient.ingredient_id,
        stock: {
          $gte: 0
        }
      });
      if (ingredientData.stock >= ingredient.stock_used * recipe.amount) {
        available.push(true);
      } else {
        available.push(false);
      }
    }
  }
  const temp = available.includes(false);
  if (temp === false) {
    await reduceIngredientStock(menu);
    return true;
  } else {
    return false;
  }
};

const getUserLoader = async (parent, args, ctx) => {
  if (parent.user_id) {
    const result = await ctx.dataUserLoader.load(parent.user_id);
    return result;
  }
};

const getMenuLoader = async (parent, args, ctx) => {
  if (parent.recipe_id) {
    const result = await ctx.dataRecipeLoader.load(parent.recipe_id);
    return result;
  }
};

const getTotalPrice = async menu => {
  let total = [];
  let totalPrice = [];
  for (recipe of menu) {
    recipeData = await Recipe.findOne({
      _id: recipe.recipe_id
    });
    total.push(recipe.amount * recipeData.price);
    totalPrice = total.reduce((a, b) => a + b);
  }
  return totalPrice;
};

const updateMenu = async (id, menu) => {
  let validateMenu = []
  for(const recipe of menu){
    validateMenu = await Transaction.find({
      _id : id,
      "menu.recipe_id" : recipe.recipe_id
    })
  }
  if(validateMenu.length != 0){
    throw new Error('This menu already in cart, you can update from cart')
  }else{
    let totalPrice = await getTotalPrice(menu);
    const addMenu = await Transaction.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $push: {
          menu: menu
        }
      },
      {
        new: true
      }
    );
    if (addMenu) {
      const updateTotal = await Transaction.findByIdAndUpdate(
        {
          _id: id
        },
        {
          $inc: {
            total: totalPrice
          }
        },
        {
          new: true
        }
      );
      return updateTotal;
    }
  }
};

const createTransaction = async (id, menu) => {
  let totalPrice = await getTotalPrice(menu);
  if (id && menu) {
    let data = new Transaction({
      user_id: id,
      menu: menu,
      total: totalPrice,
      order_status: "pending",
      status: "active"
    });
    await data.save();
    return data;
  } else {
    throw new Error("Cant create new transaction");
  }
};

const addCart = async (parent, { input }, ctx) => {
  const userId = ctx.user[0]._id;
  const data = await Transaction.findOne({
    user_id: mongoose.Types.ObjectId(userId),
    order_status: "pending",
    status: "active"
  });
  if (!input) {
    throw new Error("No data to input");
  } else {
    const { menu } = input;
    if (data == null) {
      const create = await createTransaction(userId, menu);
      return create;
    } else {
      const update = await updateMenu(data._id, menu);
      return update;
    }
  }
};

const deleteMenu = async (parent, { input }, ctx) => {
  if (!input) {
    throw new Error("No menu to dalete");
  } else {
    const userId = ctx.user[0]._id;
    const data = await Transaction.findOne({
      user_id: mongoose.Types.ObjectId(userId),
      order_status: "pending",
      status: "active"
    });
    if (data) {
      const { id } = input;
      const deleteMenu = await Transaction.findByIdAndUpdate(
        {
          _id: data._id
        },
        {
          $pull: {
            menu: {
              _id: mongoose.Types.ObjectId(id)
            }
          }
        },
        {
          new: true
        }
      );
      if (deleteMenu) {
        let totalPrice = await getTotalPrice(deleteMenu.menu);
        const updateTotal = await Transaction.findByIdAndUpdate(
          {
            _id: data._id
          },
          {
            $set: {
              total: totalPrice
            }
          },
          {
            new: true
          }
        );
        return updateTotal;
      }
    }
  }
};

const updateOrderStatus = async (parent, args, ctx) => {
  const userId = ctx.user[0]._id;
  const data = await Transaction.findOne({
    user_id: mongoose.Types.ObjectId(userId),
    order_status: "pending",
    status: "active"
  });

  if (data != null) {
    const amount = await validateMenu(data.menu)
    console.log(amount)
    // return amount
    // const validate = await validateStockIngredient(data.menu);
    // if (validate === true) {
    //   const result = await Transaction.findByIdAndUpdate(
    //     {
    //       _id: data._id
    //     },
    //     {
    //       $set: {
    //         order_status: "success"
    //       }
    //     },
    //     {
    //       new: true
    //     }
    //   );
    //   return result;
    // } else {
    //   const result = await Transaction.findByIdAndUpdate(
    //     {
    //       _id: data._id
    //     },
    //     {
    //       $set: {
    //         order_status: "failed"
    //       }
    //     },
    //     {
    //       new: true
    //     }
    //   );
    //   throw new Error("Your transaction is failed")
    // }
  } else {
    throw new Error("Cant update order status");
  }
};

const getAllTransactions = async (parent,{ filter, pagination, order_status },ctx) => {
  const userId = ctx.user[0]._id;
  let aggregateQuery = [];
  let matchQuerry = {
    $and: [
      {
        user_id : userId,
        status: "active"
      }
    ]
  };

  if (filter) {
    if (filter.user_lname || filter.recipe_name) {
      if (filter.user_lname) {
        const search = new RegExp(filter.user_lname, "i");
        aggregateQuery.push(
          {
            $lookup: {
              from: "users",
              localField: "user_id",
              foreignField: "_id",
              as: "user_detail"
            }
          },
          {
            $match: {
              "user_detail.last_name": search
            }
          }
        );
      }

      if (filter.recipe_name) {
        const search = new RegExp(filter.recipe_name, "i");
        aggregateQuery.push(
          {
            $lookup: {
              from: "recipes",
              localField: "menu.recipe_id",
              foreignField: "_id",
              as: "recipe_detail"
            }
          },
          {
            $match: {
              "recipe_detail.recipe_name": search
            }
          }
        );
      }
    }

    if (filter.order_status) {
      const search = new RegExp(filter.order_status, "i");
      matchQuerry.$and.push({
        order_status: search
      });
    }

    if (filter.order_date) {
      const search = new RegExp(filter.order_date, "i");
      matchQuerry.$and.push({
        order_date: search
      });
    }
  }

  if (matchQuerry.$and.length) {
    aggregateQuery.push({
      $match: matchQuerry
    });
  }

  if (pagination) {
    const { limit, page } = pagination;
    aggregateQuery.push(
      {
        $skip: page * limit
      },
      {
        $limit: limit
      }
    );
  }

  if (order_status) {
    aggregateQuery.push({
      $match: {
        order_status: order_status
      }
    });
  }

  if (!aggregateQuery.length) {
    return await Transaction.find();
  }

  let result = await Transaction.aggregate(aggregateQuery);
  result = result.map(el => {
    return {
      ...el,
      count: result.length
    };
  });
  return result;
};

const getOneTransactions = async (parent, { filter }) => {
  if (!filter) {
    throw new Error("Nothing to find");
  } else {
    const { id } = filter;
    let result = await Transaction.findOne({
      _id: id
    });
    return result;
  }
};

const deleteTransaction = async (parent, { input }) => {
  if (!input) {
    throw new Error("Nothing to delete");
  } else {
    const { id } = input;
    let result = await Transaction.findByIdAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          status: "deleted"
        }
      },
      {
        new: true
      }
    );
    return result;
  }
};

const updateAmount = async(parent, {input}, ctx)=>{
    if(!input){
        throw new Error('No data input');
    }else{
        const {id, amount, note} = input;
        const data = await Transaction.findOne({
          "menu._id": mongoose.Types.ObjectId(id),
          order_status: "pending"
        });
        if(data){
            const update = await Transaction.updateOne(
              {
                "menu._id": mongoose.Types.ObjectId(id)
              },
              {
                $set: {
                  "menu.$.amount": amount,
                  "menu.$.note" : note
                }
              }
            );
            if(update){
                const newdata = await Transaction.findOne({
                    "menu._id": mongoose.Types.ObjectId(id),
                    order_status: "pending"
                });
                const totalPrice = await getTotalPrice(newdata.menu)
                const result = await Transaction.findByIdAndUpdate({
                    _id : newdata._id
                },{
                    $set : {
                        total : totalPrice
                    }
                },{
                    new : true
                })
                return result
            }
        }else{
            throw new Error('Cant Update Amount')
        }
    }
}

const TransactionResolvers = {
  Query: {
    getAllTransactions,
    getOneTransactions
  },

  Mutation: {
    addCart,
    deleteTransaction,
    deleteMenu,
    updateOrderStatus,
    updateAmount
  },

  Transactions: {
    user_id: getUserLoader
  },

  Detail_Menu: {
    recipe_id: getMenuLoader
  }
};

module.exports = { TransactionResolvers };