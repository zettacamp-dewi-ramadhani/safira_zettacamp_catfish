const {gql} = require('apollo-server-express');

const typeDefs = gql`
    type Books {
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

    type Query {
        getAllBooks : [Books],
        getAllShelf : [Shelf]
    }
    type tes{
        message: String
    }
    type Mutation {
        insertPurchasing(input: dataPurchasing) : Purchasing,
        insertBook(input: dataBooks) : tes
    }
`

module.exports = {typeDefs}