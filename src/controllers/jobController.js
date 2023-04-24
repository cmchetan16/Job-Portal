const jobModel = require("../models/jobModel")
const userModel = require("../models/userModel")

const { isValid, isValidBody, isValidEmail, isValidNumber, isValidId, isValidString } = require("../validations/validators")

const createJob = async (req, res) => {
    try {
        let data = req.body
        let adminId = req.params.adminId

        let { title, discription, skills, email, experience } = data

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Provide some data" })

        if (!adminId) return res.status(400).send({ status: false, message: "Provide adminId" })
        if (!isValidId(adminId)) return res.status(400).send({ status: false, message: "Provide valid adminId" })

        if (!title) return res.status(400).send({ status: false, message: "Provide title for the job" })
        if (!isValidString(title)) return res.status(400).send({ status: false, message: "Provide valid title for job" })

        if (!discription) return res.status(400).send({ status: false, message: "Provide discription" })
        if (!isValidString(discription)) return res.status(400).send({ status: false, message: "Provide valid discription" })

        if (!email) return res.status(400).send({ status: false, message: "Provide Email" })
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Provide valid Email" })

        if (!skills) return res.status(400).send({ status: false, message: "Please add Skills" })
        if (!isValidString(skills)) return res.status(400).send({ status: false, message: "Enter valid skills" })
        data.skills = skills.split(",")
        if (!experience) return res.status(400).send({ status: false, message: "Add experience" })
        if (!isValidNumber(experience)) return res.status(400).send({ status: false, message: "Provid valid experience" })

        let checkUnique = await jobModel.findOne({ adminId: adminId, title: title, discription: discription, skills: skills, experience: experience })

        if (checkUnique) return res.status(400).send({ status: false, message: "This job already posted on portal" })

        data.adminId = adminId

        let saveData = await jobModel.create(data)
        return res.status(201).send({ status: true, message: "Job Posted successfully", data: saveData })

    } catch (error) {
        return res.status(500).send({ status: false, message: `this is ${error.message} error` })
    }
}


/////////////Get Job//////////////

const getJobDetails = async (req, res) => {
    try {
        let adminId = req.params.adminId
        let data = req.query
        let { title, skills, experience, jobId } = data
        data.adminId = adminId
        //if(!data) return res.status(400).send({status: false, message: "please enter valid details"})

        if (skills) {
            data.skills = skills.split(",")
            if (!data.skills.map(x => !isValidString(x))) return res.status(400).send({ status: false, message: "please enter valid skills" })
            data.skills = { $in: [skills] }
        }
        //let newSkills=Array.from(skills)

        if (experience) {
            if (!isValidNumber(experience)) return res.status(400).send({ status: false, message: "please enter valid info" })
        }
        if (jobId) {
            if (!isValidId(jobId)) return res.status(400).send({ status: false, message: "please enter valid skills" })
            
                data._id=jobId
                delete data.jobId
           
        }
        if (title) {
            if (!isValidString(title)) return res.status(400).send({ status: false, message: "please enter valid title" })
    
            let regexxx = new RegExp(title);
             data.title =  { $regex: regexxx } 
            
           
        }
        data.isDeleted = false
       


        let page = Number(req.query.page) || 1
        let limit = Number(req.query.limit) || 3
      
        let findJobData = await jobModel.find(data).skip((page-1)*limit).limit(limit)

        if(findJobData.length==0)return res.status(400).send({ status: false, message: "job not found"})

        return res.status(200).send({ status: true, message: "list found successfully", data: findJobData })

    } catch (error) {
        return res.status(500).send({ status: false, message: `this is ${error.message} error` })
    }
}


//this one get

const getByAdmin = async (req, res)=>{
    try {
        let adminId= req.params.adminId
        if(!adminId)(
            res.status(400).send({status: false, message: 'Admin Id not found'})
        )
        let findingJobs= await jobModel.find({adminId: adminId}).select({_id:1}).lean()
        let ids=findingJobs.map(x=>x._id)
        
        let userJobs = await userModel.find({jobId: {$in : ids} }).lean()
        if(userJobs.length==0){
           return res.status(400).send({status:false, message:'No Applied'}) 
        }

        return res.status(200).send({status: true, message: "Job Found", data: userJobs})
    } catch (error) {
        return res.status(500).send({ status: false, message: `this is ${error.message} error` })
    }
}




////////////Update job///////////

const updateJobDetails = async (req, res) => {
    try {
        let data = req.body
        let jobId = req.params.jobId
        let { title, description, email, skills, experience } = data

        if (!isValidBody(data)) return res.status(400).send({ status: false, message: "Please enter som data" })

        if (!jobId) return res.status(400).send({ status: false, message: "Please enter JobId" })
        //if (!isValid(jobId)) return res.status(400).send({ status: false, message: "Please enter valid JobId" })

        if (title) {
            if (!isValidString(title)) {
                return res.status(400).send({ status: false, message: "Please enter valid title" })
            }
        }

        if (description) {
            if (!isValid(description)) {
                return res.status(400).send({ status: false, message: "Please enter valid description" })
            }
        }

        if (email) {
            if (isValidEmail(email)) return res.status(400).send({ status: false, message: "Please enter valid email" })
        }

        if (skills) {
            if (!isValidString(skills)) {
                return res.status(400).send({ status: false, message: "Please enter valid skills" })
            }
        }

        if (experience) {
            if (!isValidNumber(experience)) {
                return res.status(400).send({ status: false, message: "Please enter valid experience" })
            }
        }

        let checkJob = await jobModel.findOne({ _id: jobId, isDeleted: false })
        if (!checkJob) {
            return res.status(400).send({ status: false, message: "Job not found" })
        }

        let updateJobData = await jobModel.findOneAndUpdate({
            _id: checkJob._id
        },
            { $set: { ...data } },
            { new: true })

        return res.status(200).send({ status: true, message: "Job update successfully", data: updateJobData })
    } catch (error) {
        return res.status(500).send({ status: false, message: `this is ${error.message} error` })
    }
}




////////////delete api//////////////////

const deleteJobDetails = async (req, res) => {
    try {
        let jobId = req.params.jobId

        if (!jobId) return res.status(400).send({ status: false, message: "Please enter JobId" })


        if (!isValidId(jobId)) return res.status(400).send({ status: false, message: "Please enter JobId" })

        let checkJob = await jobModel.findOne({ _id: jobId, isDeleted: false })
        if (!checkJob) return res.status(400).send({ status: false, message: "Job not found" })

        await jobModel.findOneAndUpdate({ _id: jobId },
            { $set: { isDeleted: true } },
            { new: true })

        return res.status(200).send({ status: true, message: "Job deleted successfully" })
    } catch (error) {
        return res.status(500).send({ status: false, message: `this is ${error.message} error` })
    }
}

module.exports = {
    createJob, getJobDetails, updateJobDetails, deleteJobDetails,getByAdmin
}