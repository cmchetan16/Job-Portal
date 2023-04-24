const signupModel = require("../models/signupModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { isValid, isValidBody, isValidEmail, isValidMobile, isValidString, isValidPassword } = require("../validations/validators")
const adminModel = require("../models/adminModel")
const userModel = require("../models/userModel")

const signUp = async (req, res) => {
    try {
        let data = req.body
        if (isValid(data)) return res.status(400).send({ status: false, message: "please enter valid data" })

        let { name, email, password, phone, role } = data

        if (!name) return res.status(400).send({ status: false, message: "please enter valid name" })
        if (!isValidString(name)) return res.status(400).send({ status: false, message: "please enter valid name" })

        if (!password) return res.status(400).send({ status: false, message: "please enter valid password" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "please enter valid password" })

        if (!email) return res.status(400).send({ status: false, message: "please enter valid email" })
        if (!isValidEmail) return res.status(400).send({ status: false, message: "please enter valid email" })
        
        if (!role) return res.status(400).send({ status: false, message: "Provide role" })
        
       let  model
        if (role == "admin") {
            model = adminModel

        } else if (role == "user") {
            model = signupModel
        }
        let checkEmail = await model.findOne({ email: email })
        if (checkEmail) return res.status(400).send({ status: false, message: "this email is already registered please enter new Eail" })

        if (!phone) return res.status(400).send({ status: false, message: "please enter valid Phone" })
        if (!isValidMobile(phone)) return res.status(400).send({ status: false, message: "please enter valid Phone" })

        let checkPhone = await model.findOne({ phone: phone })
        if (checkPhone) return res.status(400).send({ status: false, message: "this Phone is already registered please enter new Phone" })

        let salt = await bcrypt.genSalt(10)
        data.password = await bcrypt.hash(data.password, salt)

        let createUser = await model.create(data)
        
        return res.status(201).send({ status: true, message: "Congrats! you are created your account successfully", data: createUser })
    } catch (error) {
        return res.status(500).send({ status: false, message: `this is ${error.message} error` })
    }
}

//////Login/////////////

const login = async (req, res) => {
    try {
        let data = req.body

        if (!isValidBody(data)) {
            return res.status(400).send({ status: false, message: "Provide data" })
        }
        let { email, password, role } = data

        if (!email) return res.status(400).send({ status: false, message: "Provide Email Id" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Email not valid" })
        if (!role) return res.status(400).send({ status: false, message: "provide role" })
       
        let model
        if (role == "admin"){
        model = adminModel

        }else if(role == "user"){
        model = signupModel
        }

        let checkEmail = await model.findOne({ email: email }).lean()
        if (!checkEmail) return res.status(400).send({ status: false, message: "Email not found" })

        if (!password) return res.status(400).send({ status: false, message: "Provide Password for login" })
        if (!isValidPassword(password)) return res.status(400).send({ status: false, message: "Provide valid password" })


        let checkPassword = await bcrypt.compare(password, checkEmail.password)
        if (!checkPassword) return res.status(400).send({ status: false, message: "Password not valid" })

        let token = jwt.sign({
            userId: checkEmail._id
        }, "job-job-job", { expiresIn: "24h" })

        return res.status(201).send({ status: true, message: "User loged in successfully", data: { userId: checkEmail._id, token: token } })

    } catch (error) {
        return res.status(500).send({ status: false, message: `this is ${error.message} error` })
    }
}
module.exports = {signUp, login }