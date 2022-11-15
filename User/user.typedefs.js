const {gql} = require('apollo-server-express');

const UserTypeDefs = gql`
    type Users {
        _id : ID,
        email : String,
        first_name : String,
        last_name : String,
        user_type : UserType_Detail,
        status : Status
    }

    type UserType_Detail {
        type_id : Permission
    }

    enum Status {
        active,
        deleted
    }

    type AuthLoad {
        token : String,
        user : Users
    }

    input UserLogin{
        email : String,
        password : String
    }

    input UserSignup {
        email : String,
        password : String,
        first_name : String,
        last_name : String,
        user_type : ID
    }

    input Paging {
        page : Int,
        limit : Int
    }

    input UserFilter{
        email : String,
        first_name : String,
        last_name : String,
        paging : Paging
    }

    input OneUserFilter{
        id : ID,
        email : String
    }

    input UserUpdate {
        newEmail : String,
        newPassword : String,
        newFirst_name : String,
        newLast_name : String
    }

    input UserDelete{
        id : ID,
        status : Status
    }

    type Query{
        getAllUsers(filter: UserFilter ) : [Users],
        getOneUser(filter : OneUserFilter) : Users
    }

    type Mutation {
        signUp(input: UserSignup) : Users,
        login(input: UserLogin) : AuthLoad,
        updateUser(input : UserUpdate) : Users,
        deleteUser(input: UserDelete) : Users
    }
`

module.exports = {UserTypeDefs}