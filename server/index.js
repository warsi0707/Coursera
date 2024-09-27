require('dotenv').config()
const express = require("express")
const app = express()
const cors = require("cors")

const {adminRouter} = require("./routes/admin")
const {userRouter} = require("./routes/user")
const {courseRouter} = require("./routes/cource")
const { default: mongoose } = require("mongoose")

app.use(cors())
app.use(express.json())


app.use("/api/admin", adminRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)

app.get("/",(req, res) =>{
    res.json({
        messge: "Welcome home"
    })
})
async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000)
    console.log("listening on port 3000")

 }
 main()


