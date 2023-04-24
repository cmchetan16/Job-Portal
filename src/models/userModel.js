const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
//this is an job applying schema for the user
const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true, 
       
    },
    resume: {
        type: String, 
        required: true
    }, 
    coverletter:{
        type: String,
        required: true
    }, 
    jobId: {
        type: ObjectId,
        ref: "job", 
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
}, {timestamps: true}
)

module.exports = mongoose.model("User", userSchema)