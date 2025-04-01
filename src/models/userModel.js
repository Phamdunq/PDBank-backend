const mongoose = require('mongoose')

//shape data
const userSchema = new mongoose.Schema({
    phoneNumber: String,
    password: String,
    role: { type: String, enum: ['admin', 'user'] },
    status: { type: String, enum: ['active', 'inactive'] }
})

const User = mongoose.model('User', userSchema)

module.exports = User