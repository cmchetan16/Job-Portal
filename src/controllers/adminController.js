// const adminModel = require('../models/adminModel')
// const jwt = require('jsonwebtoken')
// const bcrypt = require("bcrypt")
// const {isValid, isValidString, isValidPassword, isValidEmail, isValidMobile}= require('../validations/validators')

// const adminSignUp = async (req, res)=>{
//     try {
//         let data = req.body
//         if(isValid(data)) return res.status(400).send({status: false, message: "please enter valid data"})
    
//         let {name, email, password, phone} = data
    
//         if(!name) return res.status(400).send({status: false, message: "please enter valid name"})
//         if(!isValidString(name)) return res.status(400).send({status: false, message: "please enter valid name"})
    
//         if(!password) return res.status(400).send({status: false, message: "please enter valid password"})
//         if(!isValidPassword(password)) return res.status(400).send({status: false, message: "please enter valid password"})
    
//         if(!email) return res.status(400).send({status: false, message: "please enter valid email"})
//         if(!isValidEmail) return res.status(400).send({status: false, message: "please enter valid email"})
    
//         let checkEmail = await adminModel.findOne({email: email})
//         if(checkEmail) return res.status(400).send({status: false, message: "this email is already registered please enter new Eail"})
    
//         if(!phone) return res.status(400).send({status: false, message: "please enter valid Phone"})
//         if(!isValidMobile(phone)) return res.status(400).send({status: false, message: "please enter valid Phone"})
    
//         let checkPhone = await adminModel.findOne({phone: phone})
//         if(checkPhone) return res.status(400).send({status: false, message: "this Phone is already registered please enter new Phone"})
    
//     let salt = await bcrypt.genSalt(10)
//     data.password = await bcrypt.hash(data.password, salt)
    
//     let createAdmin = await adminModel.create(data)
//     return res.status(201).send({status: true, message: "Congrats! you are created your account successfully", data: createAdmin})
//     } catch (error) {
//         return res.status(500).send({status: false, message:`this is ${error.message} error`})
//     }
//     }

//     //////////////////////////////

// // const loginAdmin = async(req, res)=>{
// //     try {
// //         let data = req.body

// //         if(isValid(data)){
// //             return res.status(400).send({status: false, message: "Provide data"}) }
// //             let {email, password}= data

// //             if(!email) return res.status(400).send({status: false, message: "Provide Email Id"})
// //             if(!isValidEmail(email)) return res.status(400).send({status: false, message: "Email not valid"})

// //             let checkEmail = await adminModel.findOne({email: email}).lean()

// //             if(!checkEmail) return res.status(400).send({status: false, message: "Email not found"})

// //             if(!password) return res.status(400).send({status: false, message: "Provide Password for login"})
// //             if(!isValidPassword(password)) return res.status(400).send({status: false, message: "Provide valid password"})

// //             let checkPassword = await bcrypt.compare(password, checkEmail.password)
// //             if(!checkPassword) return res.status(400).send({status: false, message: "Password not valid"})

// //             let token = jwt.sign({
// //                 userId: checkEmail._id}, "job-job-job", {expiresIn: "24h"})

// //                 return res.status(201).send({status: true, message: "User loged in successfully", data:{adminId: checkEmail._id, token: token}})

// //     } catch (error) {
// //         return res.status(500).send({status: false, message:`this is ${error.message} error`})
// //     }
// // }
// module.exports = {adminSignUp}