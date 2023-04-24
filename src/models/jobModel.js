const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId

const jobSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true, 
        unique: true
    },
    discription: {
        type: String, 
        required: true
    }, 
    skills:{
        type: Array
    },
    experience:{
        type: Number,
        default: 0 - 1
    }, 
    adminId: {
        type: ObjectId,
        ref: "admin", 
        required: true
    },
    isDeleted:{
        type: Boolean,
        default: false
    }
}, {timestamps: true}
)

module.exports = mongoose.model("job", jobSchema)