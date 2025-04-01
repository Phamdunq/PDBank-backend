const Account = require('../models/accountModel');
const Transaction = require('../models/transactionModel')
const aqp = require('api-query-params');

const getAllTransactionService = async (limit, page, name, queryString) => {
    try {
        let result = null;
        let total = 0;
        if (limit && page) {
            let offset = (page - 1) * limit;
            const { filter } = aqp(queryString);
            delete filter.page;
            // Đếm tổng số bản ghi mà không áp dụng skip và limit
            total = await Transaction.countDocuments(filter);
            result = await Transaction.find(filter).skip(offset).limit(limit).exec();
        } else {
            // Nếu không có phân trang, trả về tất cả dữ liệu và tổng số bản ghi
            result = await Transaction.find({});
            total = result.length;
        }

        return { data: result, total: total }

    } catch (error) {
        console.log("error >>>> ", error);
        return { data: null, total: 0 };
    }
}

const createTransactionService = async (transactionData) => {
    try {
        // Kiểm tra nếu amount không hợp lệ
        if (isNaN(transactionData.amount) || transactionData.amount <= 0) {
            throw new Error("Invalid transaction amount");
        }

        // Chuyển amount về kiểu số
        transactionData.amount = parseFloat(transactionData.amount);

        // Tìm tài khoản nguồn và tài khoản đích
        const accountFrom = await Account.findOne({ accountNumber: transactionData.fromAccount });
        const accountTo = await Account.findOne({ accountNumber: transactionData.toAccount });

        if (!accountFrom || !accountTo) {
            throw new Error("One or both accounts not found");
        }

        // Kiểm tra số dư
        if (accountFrom.balance < transactionData.amount) {
            throw new Error("Insufficient balance");
        }

        // Cập nhật số dư tài khoản nguồn (trừ tiền)
        const updateFrom = await Account.updateOne(
            { accountNumber: transactionData.fromAccount, balance: { $gte: transactionData.amount } }, // Đảm bảo số dư đủ
            { $inc: { balance: -transactionData.amount } }
        );

        // Nếu không cập nhật được (số dư có thể đã thay đổi), trả lỗi
        if (updateFrom.modifiedCount === 0) {
            throw new Error("Insufficient balance or concurrent update detected");
        }

        // Cập nhật số dư tài khoản đích (cộng tiền)
        await Account.updateOne(
            { accountNumber: transactionData.toAccount },
            { $inc: { balance: transactionData.amount } }
        );

        // Tạo giao dịch mới
        const transaction = await Transaction.create({
            accountId: accountFrom._id,
            transactionType: transactionData.transactionType,
            amount: transactionData.amount,
            fromAccount: transactionData.fromAccount,
            toAccount: transactionData.toAccount
        });

        return transaction;
    } catch (error) {
        console.error("Transaction error >>>>", error);
        throw new Error("Transaction failed: " + error.message);
    }
};



// const putUpdateTransactionService = async (id, accountId, transactionType, amount, fromAccount, toAccount) => {
//     try {
//         let result = await Transaction.updateOne({ _id: id }, { accountId, transactionType, amount, fromAccount, toAccount })
//         return result
//     } catch (error) {
//         console.log("error >>>>", error)
//         return null
//     }
// }

const deleteTransactionService = async (id) => {
    try {
        let result = await Transaction.findByIdAndDelete(id)
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const deleteArrayTransactionService = async (arrIds) => {
    try {
        let result = await Transaction.deleteMany({ _id: { $in: arrIds } })
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

module.exports = {
    createTransactionService, getAllTransactionService,
    deleteTransactionService,
    deleteArrayTransactionService,

}