const jwt = require("jsonwebtoken")
const signupModel = require("../models/signupModel")
const {isValidId} = require("../validations/validators")
const adminModel = require("../models/adminModel")

const authentication = async (req, res, next)=>{
    try {
        let token = req.headers["x-api-key"]

        if(!token){ return res.status(400).send({status:false, message: "Please enter token"}) }

jwt.verify(token, 'job-job-job', (error, decodetoken)=>{
    if(error){
        return res.status(400).send({status: false, message: 'token is not correct'})
    }
    req["decodetoken"]=decodetoken
    next() 
})
    } catch (error) {
        return res.status(500).send({status: false, message: `Error come from ${error}`})
    }
}




const authorisation = async (req, res, next) => {
    try {
        let value = req.params
        let  id = Object.keys(value)[0] 
        let model 
        if(id == "adminId")model= adminModel
        else if (id=="userId")model=signupModel


        if(!value){
            return res.status(400).send({status: false, message: 'please enter id'})
        }

        if(!isValidId(value[id])){
            return res.status(400).send({status: false, message: "Please enter correct id"})
        }

        let checkadminId = await model.findOne({_id: value[id]})
        if(!checkadminId){
            return res.status(400).send({status: false, message: 'user not found'})
        }

        if(checkadminId._id != req['decodetoken'].userId){
            return res.status(403).send({
                status: false,
                message: 'you are not authorised'
            })
        }

        next()

    } catch (error) {
        return res.status(500).send({status: false, message: `this is catch error ${error.message}`})
    }
}


module.exports= {authentication, authorisation}