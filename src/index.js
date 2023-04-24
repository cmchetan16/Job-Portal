const { json } = require("express")
const express = require ("express")
const route = require("./routes/route")
const { default: mongoose } = require("mongoose")
const app = express()
const PORT = 3000
const multer = require('multer')
app.use(express.json())
app.use(multer().any())
mongoose.connect("mongodb+srv://halfblood12168:48586566@cluster0.ypq34sh.mongodb.net/test",{useNewUrlParser: true})

.then(()=>{
    console.log("Mongoose is connected")
})
.catch((error)=>{
    console.log(error)
})

app.use("/", route)
app.listen(PORT, ()=> console.log(`this ${PORT} is running`))