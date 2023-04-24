const userModel = require("../models/userModel")
const jobModel = require("../models/jobModel")
const{isValid, isValidFile, isValidEmail, isValidString, isValidId, isValidBody,isValidNumber}=require("../validations/validators")
const { isValidObjectId } = require("mongoose")
//const { findById, findOne } = require("../models/userModel")
const aws = require('../aws/awsConfig')
const { findById } = require("../models/signupModel")

const createUser = async (req,res)=>{
try {
    let data = req.body

    if(!isValidBody(data)){ return res.status(400).send({status: false,message:"Please add valid information"})} 

let{name, email, jobId}= data

if(!name) return res.status(400).send({status: false, message: "please enter valid name"})
if(!email) return res.status(400).send({status: false, message: "please enter valid email"})
// if(!jobId) return res.status(400).send({status: false, message: "please enter valid Job-ID"})

if(!isValidString(name)) return res.status(400).send({status: false, message: "please enter valid name"})
if(!isValidEmail(email)) return res.status(400).send({status: false, message: "please enter valid email"})



let checkApplication = await userModel.findOne({
    jobId: jobId,
    email: email
}) 

if(checkApplication) return res.status(400).send({status: false, message: "You are registerted to this job"})
else{
    if(!jobId) return res.status(400).send({status: false, message: "please enter JobId"})
}

//if(!isValidObjectId(jobId)) return res.status(400).send({status: false, message: "please enter valid JobId"})
let checkJob=await jobModel.findById(jobId).select({_id:1})
if(!checkJob)return res.status(400).send({status: false, message: "job not found"})
let files = req.files 
if(!files[0]){
    return res.status(400).send({status: false, message: "please provid the resume file"})
} else{
    if(!isValidFile(files[0].originalname)){
        return res.status(400).send({status: false, message:'files format must in jpg/pdf only'})
    }
}

let resume = await aws.uploadFile(files[0])
data.resume=resume

// let files2= req.files
if(!files[1]){
    return res.status(400).send({status: false, message: 'files required'})
} else{
    if(!isValidFile(files[1].originalname)){
        return res.status(400).send({status: false, message:'files format shold be jpg only'})
    }  
}

let coverLetter = await aws.uploadFile(files[1])
console.log(coverLetter)
data.coverletter=coverLetter


let newApplication = await userModel.create(data)
    return res.status(201).send({status: true, message: "application send...", data: newApplication})
}
 catch (error) {
    return res.status(500).send({status: false, message: `this is ${error} error`})    
}
}

///////////////get///////////////

const getJobDetailsByUser = async (req, res)=>{
    try {
        let data = req.query
        let {skills, experience, jobId, title} = data  

        //if(!data) return res.status(400).send({status: false, message: "please enter valid details"})

        if(skills) {
            data.skills= skills.split(",")
            if(!data.skills.map(x=>!isValidString(x))) return res.status(400).send({status: false, message: "please enter valid skills"})
            data.skills={$in:[skills]}
        }
        //let newSkills=Array.from(skills)
        
        if(experience){ 
        if(!isValidNumber(experience))return res.status(400).send({status: false, message: "please enter valid info"})
        
        }
        if(jobId) {
        if(!isValidId(jobId)) return res.status(400).send({status: false, message: "please enter valid skills"}) 
        data._id=jobId
        delete data.jobId
    }
        if (title) {
            if (!isValidString(title)) return res.status(400).send({ status: false, message: "please enter valid title" })
    
            let regexxx = new RegExp(title);
             data.title =  { $regex: regexxx } 
            
           
        }
        let page = Number(req.query.page)||1
        let limit = Number(req.query.limit)||3
        
        data.isDeleted=false
        let findJobData= await jobModel.find(data).skip((page-1)*limit).limit(limit)
        if(findJobData.length==0)return res.status(400).send({ status: false, message: "job not found"})
        return res.status(200).send({status: true, message: "Job fetch successfully", data: findJobData})
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

///////////////////update/////////////////////

const updateUserAppliction = async (req, res)=>{
    try {
        
        let userId = req.params.userId
        let data = req.body

        if(!isValidBody(data)) return res.status(400).send({status: false, message: "please enter some data"})

        if(!userId) return res.status(400).send({status: false, message: "please enter UserId"})

        if(!isValidObjectId(userId)) return res.status(400).send({status: false, message: "please enter valid userId"})
        let files = req.files
         
        if(files){ 
            //need to add fildname 3am


            let contentType = (n)=>files[n]["fieldname"]
            let type= (n)=>files[n]["mimetype"].split("/")


           await loop(files.length)
            async function loop(n){
                for(let i=0; i<n;i++){ 
                    if(contentType(i)=="coverletter"){
               
                        if(!isValidFile(files[i].originalname)&&type(i)=="pdf"){
                            return res.status(400).send({status: false, message:'files format shold be jpg only'})
                        } 
                        data.coverletter=await coverLetterFunction(files[i])
                        
                    }
                    if(contentType(i)=="resume"){
                       
                        if(!isValidFile(files[i].originalname)&&type(i)=="image"){
                            return res.status(400).send({status: false, message:'files format shold be pdf only'})
                        } 
                        data.resume=await resumeFunction(files[i])
                        
                    } 
                }
                return 0
            }
      

           async function coverLetterFunction(v){

                let data = await aws.uploadFile(v)
                return data
            }
            async function resumeFunction(v){

                let data = await aws.uploadFile(v) 
                return data
            }

     }
        
        
    
let checkUser = await userModel.findOne({userId: userId}, {isDeleted: false})

if(!checkUser) return res.status(404).send({status: false, message: "This user not found"})

let updateUser = await userModel.findOneAndUpdate({userId: userId},{$set:{...data}}, {new: true})
return res.status(200).send({status: true, message: "User info updated", data: updateUser})


}catch (error) {
    
        return res.status(500).send({status: false, message: error.message})
    }
}




//////////////////Delete user////////////

const userDelete = async (req, res)=>{
    try {
        let userId = req.params.userId

        if(!userId) return res.status(400).send({status: false, message: "Please enter userId"})
        if(!isValidObjectId(userId)) return res.status(400).send({status: false, message: "Please enter valid userId"})

        let checkUser = await userModel.findOne({userId: userId, isDeleted: false})

        if(!checkUser) return res.status(400).send({status: false, message: "User already deleted"})

        await userModel.findOneAndUpdate({userId: userId},{$set: {isDeleted: true}},{new: true})

        return res.status(200).send({status: true, message: "User delete successfully"})
    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports={createUser,getJobDetailsByUser,updateUserAppliction,userDelete}