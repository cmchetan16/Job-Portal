const mongoose = require("mongoose")

const isValidMobile=(value)=>{
return /^[6-9]\d{9}$/.test(value)
}

const isValid = (value)=>{
if(typeof (value) == undefined || value == null ){
    return false
}
}

const isValidString = (value)=>{
if(typeof value == "string" && value.trim().length==0){
    return false
}
return true
}

const isValidBody = (value)=>{
    return Object.keys(value).length>0
}

const isValidPassword = (value)=>{
return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(value)
}

const isValidId = (value)=>{
    return mongoose.Types.ObjectId(value)
}

const isValidEmail = (value)=>{
if(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(value)){
    return true
}
}

const isValidNumber = (value)=>{
 if(!/^[1-9]{1}/.test(value)) return false
 if(value>100 || value<0) return false
 return true   
}

const isValidFile=(img)=>{
    const regex = /(\/*\.(?:png|gif|webp|jpeg|jpg|pdf))/.test(img)
    return regex
}

module.exports={isValid, isValidBody, isValidEmail, isValidId, isValidMobile, isValidNumber, isValidPassword, isValidString, isValidFile}



function has(arr){
    let hasP= false
    let hasG=false
    arr.forEach(num => {
        hasP=num>0
        hasG=num<0
    });
    return [hasP, hasG]
}
console.log(has([0,1,2]))