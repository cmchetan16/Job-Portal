const mongoose = require("mongoose")

const adminSignupSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    role:{
        type:String,
        required:true,
        enum:["admin"]
    }
}, {timestamps: true}
)

module.exports = mongoose.model("Admin", adminSignupSchema)