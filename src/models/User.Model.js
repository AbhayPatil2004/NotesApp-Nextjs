import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        userName : {
            type : String ,
            required : true ,
            unirque : true
        },
        email : {
            type : String ,
            required : true ,
            unirque : true
        },
        password :{
            type : String ,
            required : true ,
        }
    },
    {
        timestamps : true 
    }
)

const User = mongoose.models.User || mongoose.model( "User" , userSchema )

export default User