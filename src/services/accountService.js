const Account = require('../models/accountModel')
const aqp = require('api-query-params')

const createAccountService = async (accountData) => {
    try {
        let result = await Account.create({
            customerId: accountData.customerId,
            accountNumber: accountData.accountNumber,
            accountType: accountData.accountType,
            balance: accountData.balance
        })
        return result

    } catch (error) {
        console.log(error)
        return null
    }
}

const getAllAccountService = async (limit, page, accountNumber, accountType) => {
    try {
        let offset = (page - 1) * limit;
        let filter = {};

        if (accountNumber) {
            filter.accountNumber = { $regex: accountNumber, $options: "i" };
        }
        if (accountType) {
            filter.accountType = accountType;
        }

        let total = await Account.countDocuments(filter);
        let result = await Account.find(filter).skip(offset).limit(limit).exec();

        return { data: result, total: total };
    } catch (error) {
        console.error("Error in getAllAccountService:", error);
        return { data: [], total: 0 };
    }
};

const putUpdateAccountService = async (id, customerId, accountNumber, accountType, balance) => {
    try {
        let result = await Account.updateOne({ _id: id }, { customerId, accountNumber, accountType, balance })
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const deleteAccountService = async (id) => {
    try {
        let result = await Account.findByIdAndDelete(id)
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const deleteArrayAccountService = async (arrIds) => {
    try {
        let result = await Account.deleteMany({ _id: { $in: arrIds } })
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const getAllAccountByCustomerService = async () => {
    try {
        let result = await Account.find().populate('customerId')
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const getAccountService = () => {
    try {
        let result = Account.find()
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}


module.exports = {
    createAccountService, getAllAccountService,
    putUpdateAccountService, deleteAccountService,
    deleteArrayAccountService, getAllAccountByCustomerService,
    getAccountService
}

