const { Router } = require("express")
const adminRouter = Router();
const { adminModel, courseModel } = require("../database/db")
const { adminMiddleware } = require("../middleware/adminAuth")
const jwt = require("jsonwebtoken")
const { ADMIN_JWT_PASSWORD } = require("../config/config")
const { z } = require("zod")
const bcrypt = require("bcrypt")

adminRouter.post("/signup", async (req, res) => {
    const { email, password, fname, lname } = req.body;
    const hashPassword = await bcrypt.hash(password, 5)
    try {
        await adminModel.create({
            email: email,
            password: hashPassword,
            fname: fname,
            lname: lname
        })
        res.json({
            message: "admin signed up "
        })
    } catch (e) {
        res.status(403).json({
            message: "Error occured, admin not signed up. "
        })
    }
})

adminRouter.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email
    })
    const passwordMatch = await bcrypt.compare(password, admin.password)
    if (admin && passwordMatch) {
        const token = jwt.sign({
            id: admin._id.toString() //this will be the decoded.id in midlw
        }, ADMIN_JWT_PASSWORD)
        res.json({
            token: token,
            message: "admin login successfully"
        })
    } else {
        res.status(403).json({
            message: "Admin not found"
        })
    }
})

adminRouter.post("/create-course", adminMiddleware, async (req, res) => {
    const adminId = req.adminId
    const { title, description, price, imageUrl } = req.body;
    try {
        const course = await courseModel.create({
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
            creatorId: adminId
        })
        res.json({
            message: "cource created successfully",
            courceId: course._id
        })
    } catch (e) {
        res.status(4040).json({
            message: "Error cource not created"
        })
    }
})

adminRouter.put("/update-course", adminMiddleware, async (req, res) => {
    const adminId = req.adminId;
    const { title, description, price, imageUrl, courseId } = req.body;

    try {
        const course = await courseModel.updateOne({
            _id: courseId, //finding the cource with there id
            creatorId: adminId // finding the admin id that created or owner of the course
        }, { //this will be updated
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl
        })
        res.json({
            message: "Cource updated",
            courseId: course._id
        })
    } catch (e) {
        res.status(404).json({
            message: "Error... Cource not updated"
        })
    }
})
adminRouter.delete("/delete-course", adminMiddleware, async (req, res) => {
    const adminId = req.adminId;
    const courseId = req.body.courseId;

    try {
        const deleteCourse = await courseModel.deleteOne({
            _id: courseId,
            creatorId: adminId
        })
        res.json({
            message: "Course deleted successfully",
            deleted_course: deleteCourse._id
        })

    } catch (e) {
        res.status(404).json({
            message: 'Errorr ... not deleted'
        })
    }
})

adminRouter.get("/all-course", adminMiddleware, async (req, res) => {
    const adminId = req.adminId;
    const courses = await courseModel.find({
        creatorId: adminId
    })
    res.json({
        message: "all cource",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}