const Customer = require('../models/customerModel')
const app = require('api-query-params')

const getAllCustomerService = async (limit, page, name, queryString) => {
    try {
        let result = null
        let total = 0
        if (limit && page) {
            let offset = (page - 1) * limit
            const { filter } = app(queryString)
            delete filter.page
            // Đếm tổng số bản ghi mà không áp dụng skip và limit
            total = await Customer.countDocuments(filter);
            result = await Customer.find(filter).skip(offset).limit(limit).exec()
        } else {
            result = await Customer.find({})
            total = result.length;
        }

        return { data: result, total: total }

    } catch (error) {
        console.log("error >>>>", error)
        return { data: null, total: 0 };
    }
}

const getCustomerByIdService = async (id) => {
    try {
        let result = await Customer.findById(id)
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const getCustomerService = async () => {
    try {
        let result = await Customer.find()
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const createCustomerService = async (customerData) => {
    try {
        let result = await Customer.create({
            userId: customerData.userId,
            fullName: customerData.fullName,
            email: customerData.email,
            phoneNumber: customerData.phoneNumber,
            address: customerData.address,
            gender: customerData.gender,
            identityNumber: customerData.identityNumber,
            dateOfBirth: customerData.dateOfBirth,
            profilePicture: customerData.profilePicture
        })

        return result

    } catch (error) {
        console.log(error)
        return null
    }
}


const createArrayCustomerService = async (arr) => {
    try {
        let result = await Customer.insertMany(arr)
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const putUpdateCustomerService = async (id, fullName, email, phoneNumber, address, gender, identityNumber, dateOfBirth) => {
    try {
        let result = await Customer.updateOne({ _id: id }, { fullName, email, phoneNumber, address, gender, identityNumber, dateOfBirth });
        return result;

    } catch (error) {
        console.log("error >>>> ", error);
        return null;
    }
}

const deleteCustomerService = async (id) => {
    try {
        let result = await Customer.findByIdAndDelete(id)
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}

const deleteArrayCustomerService = async (arrIds) => {
    try {
        let result = await Customer.deleteMany({ _id: { $in: arrIds } })
        return result
    } catch (error) {
        console.log("error >>>>", error)
        return null
    }
}


module.exports = {
    getAllCustomerService, createCustomerService,
    putUpdateCustomerService, deleteCustomerService,
    createArrayCustomerService, deleteArrayCustomerService,
    getCustomerByIdService, getCustomerService
}