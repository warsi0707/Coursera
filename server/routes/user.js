const { Router } = require("express")
const userRouter = Router()
const { userModel, purchaseModel,courseModel } = require("../database/db")
const jwt = require("jsonwebtoken")
const { USER_JWT_PASSWORD } = require("../config/config")
const {z} = require("zod")
const { userMiddleware } = require("../middleware/userAuth")
const bcrypt = require("bcrypt")


userRouter.post("/signup", async (req, res) => {
    const { email, password, fname, lname } = req.body;
    const hashPassword =await bcrypt.hash(password, 5)
    try {
        await userModel.create({
            email: email,
            password: hashPassword,
            fname: fname,
            lname: lname
        })
        res.json({
            message: "User sign up successfully"
        })
    } catch (e) {
        res.status(404).json({
            message: "Error occured, user not sign up"
        })
    }
})


userRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    //hash the password
    const user = await userModel.findOne({
        email: email
    })
    const passwordMatch =await bcrypt.compare(password, user.password)
    if (user && passwordMatch) {
        const token = jwt.sign({ //crete jwt for the user
            id: user._id.toString()
        }, USER_JWT_PASSWORD)
        res.json({
            token: token,
            id: user._id,
            message: "login successfully"
        })
    } else {
        res.status(404).json({
            message: "Incorrect credentials"
        })
    }
})

userRouter.get("/purchases",userMiddleware, async(req, res) => {
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId: userId
    })
    const courseData = await courseModel.find({
        _id: {$in : purchases.map(x => x.courseId)}
    })
    res.json({
        purchases,
        courseData
    })

})


module.exports = {
    userRouter: userRouter
}

