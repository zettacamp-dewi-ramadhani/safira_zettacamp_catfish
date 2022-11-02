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

    type Query {
        getAllBooks : [Books],
        getAllShelf : [Shelf]
    }
`

module.exports = {typeDefs}