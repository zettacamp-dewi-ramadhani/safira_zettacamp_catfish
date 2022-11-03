const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Books {
        id : ID,
        title : String,
        author : String,
        date_published : String,
        price : Int,
        created : String,
        updated : String
    }

    input dataBooks {
        title : String,
        author : String,
        date_published : String,
        price : Int
    }

    type Detail_Shelf {
        book_id : ID,
        added_date : String,
        stock : Int

    }

    type Shelf {
        name : String,
        book_ids : [Detail_Shelf],
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
        getAllShelf : [Shelf],
        paginationBook(input: pagination) : [Books]
    }
    input titleBook{
        id : ID,
        title: String
    }

    input deleteBooks{
        title: String
    }

    type Mutation {
        insertPurchasing(input: dataPurchasing) : Purchasing,
        insertBook(input: dataBooks) : Books,
        updateTitleBook(input : titleBook): Books,
        deleteBook(input : deleteBooks): Books
    }
`

module.exports = {typeDefs}