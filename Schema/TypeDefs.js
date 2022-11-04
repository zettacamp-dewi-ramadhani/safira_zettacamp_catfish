const {gql} = require('apollo-server-express');

const typeDefs = gql
`
    type User {
        id : ID,
        username : String,
        password : String
    }

    input dataBooks {
        title : String,
        author : String,
        date_published : String,
        price : Int
    }

    type Books {
        _id : ID,
        title : String,
        author : String,
        date_published : String,
        price : Int,
        created : String,
        updated : String
    }
    
    type Detail_Shelf {
        book_id : Books,
        added_date : String,
        stock : Int

    }

    type Datetime {
        date : String,
        time : String
    }

    type Shelf {
        _id : ID,
        name : String,
        book_ids : [Detail_Shelf],
        datetime : [Datetime],
        created : String,
        updated : String
    }

    type Credit {
        month : Int,
        price : Int
    }

    input dataCredit {
        month : Int,
        price : Int
    }

    type Purchasing {
        title : String,
        price : Int,
        discount : Int,
        credit_available : Boolean,
        credit : [Credit]
    }

    input dataPurchasing {
        title : String,
        price : Int,
        discount : Int,
        credit : [dataCredit]
    }
    
    input pagination{
        page : Int,
        limit : Int
    }

    type Query {
        getAllBooks : [Books],
        getAllShelf(input: pagination) : [Shelf],
        paginationBook(input: pagination) : [Books]
    }
    input titleBook{
        _id : ID,
        title: String
    }

    input deleteBooks{
        _id: ID
    }

    type Mutation {
        insertPurchasing(input: dataPurchasing) : Purchasing,
        insertBook(input: dataBooks) : Books,
        updateTitleBook(input : titleBook): Books,
        deleteBook(input : deleteBooks): Books
    }
`

module.exports = {typeDefs}