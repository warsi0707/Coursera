const {Router} = require("express")
const { purchaseModel, courseModel } = require("../database/db");
const { userMiddleware } = require("../middleware/userAuth")
const courseRouter = Router()

courseRouter.post("/purchase",userMiddleware, async(req, res) =>{
    const userId = req.userId;
    const courseId = req.body.courseId

    await purchaseModel.create({
        userId: userId,
        courseId: courseId
    })
    res.json({
        message: "Cource purchases"
    })
})

courseRouter.get("/preview", async(req, res) =>{
    const courses = await courseModel.find({})
    res.json({
        courses
    })
})


module.exports = {
    courseRouter : courseRouter
}