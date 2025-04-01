const User = require('../models/userModel')
const aqp = require('api-query-params')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
const Customer = require('../models/customerModel');
const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel');
const saltRounds = 10

const loginUserService = async (userData) => {
    try {
        // 1. Tìm User theo số điện thoại
        let user = await User.findOne({ phoneNumber: userData.phoneNumber });

        if (!user) {
            return { EC: 1, EM: "Số điện thoại không tồn tại!" };
        }

        // 2. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(userData.password, user.password);
        if (!isMatch) {
            return { EC: 1, EM: "Mật khẩu không chính xác!" };
        }

        // 3. Lấy thông tin Customer dựa trên userId
        const customer = await Customer.findOne({ userId: user._id });

        // 4. Lấy danh sách tài khoản dựa trên customerId
        let accounts = [];
        let transactions = [];

        if (customer) {
            accounts = await Account.find({ customerId: customer._id });

            // 5. Lấy danh sách giao dịch của các tài khoản
            const accountIds = accounts.map(acc => acc._id);
            transactions = await Transaction.find({ accountId: { $in: accountIds } });
        }

        // 6. Tạo JWT token
        const token = jwt.sign(
            { userId: user.id, phoneNumber: user.phoneNumber, role: user.role },
            process.env.JWT_SECRET || "secret_key",
            { expiresIn: "7d" }
        );

        // 7. Trả về thông tin user, customer, accounts, transactions và token
        return {
            EC: 0,
            EM: "Đăng nhập thành công!",
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                password: user.password,
                email: user.email,
                role: user.role,
                status: user.status,
            },
            customer: customer
                ? {
                    id: customer._id,
                    fullName: customer.fullName,
                    email: customer.email,
                    phoneNumber: customer.phoneNumber,
                    address: customer.address,
                    gender: customer.gender,
                    identityNumber: customer.identityNumber,
                    dateOfBirth: customer.dateOfBirth,
                    profilePicture: customer.profilePicture,
                }
                : null,
            accounts: accounts.map(acc => ({
                id: acc._id,
                accountNumber: acc.accountNumber,
                accountType: acc.accountType,
                balance: acc.balance,
            })),
            transactions: transactions.map(tx => ({
                id: tx._id,
                accountId: tx.accountId,
                transactionType: tx.transactionType,
                amount: tx.amount,
                fromAccount: tx.fromAccount,
                toAccount: tx.toAccount,
                createdAt: tx.createdAt,
            })),
            token: token,
        };

    } catch (error) {
        console.error("error >>>:", error);
        return null;
    }
};

const registerUserService = async (userData) => {
    try {
        // Kiểm tra xem số điện thoại đã tồn tại chưa
        const existingUser = await User.findOne({ phoneNumber: userData.phoneNumber });
        if (existingUser) {
            return { EC: 1, EM: "Số điện thoại đã được sử dụng!" };
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        // Tạo User mới
        const newUser = await User.create({
            phoneNumber: userData.phoneNumber,
            password: hashedPassword,
            role: userData.role || "user", // Mặc định là khách hàng
            status: "active",
        });

        let newCustomer = null;
        let newAccount = null;

        if (userData.fullName) {
            // Tạo Customer
            newCustomer = await Customer.create({
                userId: newUser._id,
                fullName: userData.fullName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                address: userData.address,
                gender: userData.gender,
                identityNumber: userData.identityNumber,
                dateOfBirth: userData.dateOfBirth,
                profilePicture: userData.profilePicture
            });

            // Tạo Account cho Customer mới
            newAccount = await Account.create({
                customerId: newCustomer._id,
                accountNumber: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // Random 10 số
                accountType: "thanh toán", // Mặc định là tài khoản thanh toán
                balance: 0, // Mặc định số dư ban đầu là 0
            });
        }

        // Tạo JWT token
        const token = jwt.sign(
            { userId: newUser.id, phoneNumber: newUser.phoneNumber, role: newUser.role },
            process.env.JWT_SECRET || "secret_key",
            { expiresIn: "7d" }
        );

        // Trả về kết quả
        return {
            data: {
                EC: 0,
                user: {
                    id: newUser._id,
                    phoneNumber: newUser.phoneNumber,
                    email: newUser.email,
                    role: newUser.role,
                    status: newUser.status,
                },
                customer: newCustomer ? {
                    id: newCustomer._id,
                    fullName: newCustomer.fullName,
                    email: newCustomer.email,
                    phoneNumber: newCustomer.phoneNumber,
                    address: newCustomer.address,
                    gender: newCustomer.gender,
                    identityNumber: newCustomer.identityNumber,
                    dateOfBirth: newCustomer.dateOfBirth,
                    profilePicture: newCustomer.profilePicture,
                } : null,
                account: newAccount ? {
                    id: newAccount._id,
                    accountNumber: newAccount.accountNumber,
                    accountType: newAccount.accountType,
                    balance: newAccount.balance
                } : null,
                token: token,
            },
        };
    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        return { EC: 2, EM: "Đã xảy ra lỗi, vui lòng thử lại sau!" };
    }
};


const getAllUserService = async (limit, page, name, queryString) => {
    try {
        let result = null;
        let total = 0;
        if (limit && page) {
            let offset = (page - 1) * limit;
            const { filter } = aqp(queryString);
            delete filter.page;
            // Đếm tổng số bản ghi mà không áp dụng skip và limit
            total = await User.countDocuments(filter);
            result = await User.find(filter).skip(offset).limit(limit).exec();
        } else {
            // Nếu không có phân trang, trả về tất cả dữ liệu và tổng số bản ghi
            result = await User.find({});
            total = result.length;
        }

        return { data: result, total: total }

    } catch (error) {
        console.log("error >>>> ", error);
        return { data: null, total: 0 };
    }
}

const createUserService = async (userData) => {

    try {
        // Mã hóa mật khẩu
        const hashPassword = await bcrypt.hash(userData.password, saltRounds)


        let result = await User.create({
            phoneNumber: userData.phoneNumber,
            password: hashPassword,
            role: userData.role,
            status: userData.status || "active"
        })
        return result

    } catch (error) {
        console.log(error)
        return null
    }
}

const putUpdateUserService = async (id, updateData) => {
    try {
        // Kiểm tra user có tồn tại không
        const user = await User.findById(id);
        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Nếu có thay đổi mật khẩu, mã hóa lại mật khẩu trước khi lưu
        if (updateData.password && updateData.password.trim() !== "") {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(updateData.password, saltRounds);
            updateData.password = hashedPassword;
        }

        // Thực hiện cập nhật
        let result = await User.updateOne({ _id: id }, updateData);
        return {
            success: true,
            message: "User updated successfully",
            data: result
        };
    } catch (error) {
        console.error("error >>>>", error);
        return null
    }
}

const deleteUserService = async (id) => {
    try {
        let result = await User.findByIdAndDelete(id)
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const deleteArrayUserService = async (arrIds) => {
    try {
        let result = await User.deleteMany({ _id: { $in: arrIds } })
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const putUpdateUserPasswordService = async (id, oldPassword, newPassword) => {
    try {
        // Kiểm tra xem user có tồn tại không
        const user = await User.findById(id);
        if (!user) {
            return { EC: 1, EM: "Người dùng không tồn tại!" };
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return { EC: 1, EM: "Mật khẩu cũ không đúng!" };
        }

        // Kiểm tra nếu mật khẩu mới giống mật khẩu cũ
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return { EC: 1, EM: "Mật khẩu mới không được trùng với mật khẩu cũ!" };
        }

        // // Kiểm tra độ mạnh của mật khẩu mới
        // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        // if (!passwordRegex.test(newPassword)) {
        //     return { EC: 1, EM: "Mật khẩu mới không đáp ứng yêu cầu!" };
        // }

        // Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        // Cập nhật mật khẩu mới vào database
        user.password = hashPassword;
        await user.save();

        return { EC: 0, EM: "Cập nhật mật khẩu thành công!" };

    } catch (error) {
        console.error("Lỗi khi cập nhật mật khẩu:", error);
        return { EC: 1, EM: "Có lỗi xảy ra, vui lòng thử lại sau!" };
    }
};


module.exports = {
    loginUserService, getAllUserService,
    createUserService, putUpdateUserService,
    deleteUserService, deleteArrayUserService,
    putUpdateUserPasswordService, registerUserService


}