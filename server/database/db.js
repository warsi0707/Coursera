const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;


const adminSchema = new Schema({
    email: {type: String, unique: true},
    password: String,
    fname: String,
    lname: String
})

const userSchema = new Schema({
    email: {type: String, required: true, unique: true},
    password: String,
    fname: String,
    lname: String
})

const courseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId
})

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
  
})

const adminModel = mongoose.model("Admin", adminSchema)
const userModel = mongoose.model("User", userSchema)
const courseModel = mongoose.model("Course", courseSchema)
const purchaseModel = mongoose.model("Purchase", purchaseSchema)

module.exports = {
    adminModel,
    userModel,
    courseModel,
    purchaseModel
}