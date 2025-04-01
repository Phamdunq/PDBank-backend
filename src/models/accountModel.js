const mongoose = require('mongoose')

const accountSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }, // Liên kết với người dùng
    accountNumber: { type: String },   // Số tài khoản
    accountType: { type: String },  // Loại tài khoản: Tiết kiệm hoặc thanh toán
    balance: { type: Number }, // Số dư
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
})

const Account = mongoose.model('Account', accountSchema)

module.exports = Account