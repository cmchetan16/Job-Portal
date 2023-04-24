const express = require("express")
const router = express.Router()
const { signUp, login } = require("../controllers/signupController")
const { createUser, getJobDetailsByUser, updateUserAppliction, userDelete } = require("../controllers/userController")
const { createJob, getJobDetails, updateJobDetails, deleteJobDetails ,getByAdmin} = require('../controllers/jobController')
const { authentication, authorisation } = require('../middleware/auth')



router.post("/signup", signUp)//done
router.post("/login", login)//done

//admin
router.post("/job/:adminId", authentication, authorisation, createJob);//done
router.get("/getApplications/:adminId", authentication, getJobDetails)//done
router.put("/updateJob/:adminId/:jobId", authentication, authorisation, updateJobDetails)//done
router.get('/getAppliedJob/:adminId',authentication, authorisation, getByAdmin)
router.delete("/deleteJob/:adminId/:jobId", authentication, authorisation, deleteJobDetails)//done


//=======user APIs=========// 
router.post("/application", authentication,createUser);//done
router.get("/findJob", authentication, getJobDetailsByUser);//done
router.put("/updateUser/:userId", authentication, authorisation, updateUserAppliction);//done
router.delete("/deleteUser/:userId", authentication, authorisation, userDelete);//done


router.all("*", (req, res) => {
    res.status(400).send({ status: false, message: "Invalid URL" })
})



module.exports = router