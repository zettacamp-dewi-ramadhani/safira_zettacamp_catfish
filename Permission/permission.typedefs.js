const {gql} = require('apollo-server-express');

const PermissionTypeDefs = gql`
    type Permission {
        _id : ID,,
        role : String,
        access :  [Access_Detail]
    }

    type Access_Detail {
        name : String,
        view : Boolean
    }

    input DataInput {
        role : String,
        access : [Detail]
    }

    input Detail {
        name : String,
        view : Boolean
    }

    type Query {
        getAllPermission : [Permission],
    }

    type Mutation {
        createPermission(input : DataInput) : Permission,
        updatePermission : Permission,
        deletePermission : Permission
    }
`

module.exports = {PermissionTypeDefs};