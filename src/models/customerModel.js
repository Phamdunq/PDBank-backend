const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fullName: {
        type: String,
        required: true,
        // trim: true,
        // minlength: 3,
        // maxlength: 50 // Giới hạn độ dài tên
    },
    email: {
        type: String,
        // required: true,
        // unique: true,
        // lowercase: true, // Tự động chuyển email thành chữ thường
        // match: /^\S+@\S+\.\S+$/ // Regex kiểm tra định dạng email
    },
    phoneNumber: {
        type: String,
        // required: true,
        // unique: true,
        // match: /^[0-9]{8,11}$/ // Chỉ cho phép số điện thoại từ 8 đến 11 chữ số
    },
    address: {
        type: String,
        // required: true,
        // trim: true,
        // maxlength: 100 // Giới hạn độ dài địa chỉ
    },
    gender: {
        type: String,
        // enum: ["male", "female", "other"], // Thêm tùy chọn 'other' cho các trường hợp khác
        // required: true
    },
    identityNumber: {
        type: String,
        // required: true,
        // unique: true,
        // minlength: 9, // Giới hạn độ dài CMND/CCCD
        // maxlength: 12
    },
    dateOfBirth: {
        type: Date,
        // required: true
    },
    profilePicture: {
        type: String,
        default: null // Đặt mặc định là null nếu không có ảnh đại diện
    }

    //schema embament account
    //schema referrent transaction
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});


const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;