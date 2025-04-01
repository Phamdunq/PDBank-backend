const { uploadSingleFile } = require("../services/fileService");
const { createCustomerService, getAllCustomerService,
    putUpdateCustomerService, deleteCustomerService,
    createArrayCustomerService, deleteArrayCustomerService,

} = require('../services/customerServices')
const Joi = require('joi');
const { get } = require("mongoose");
module.exports = {
    getAllCustomers: async (req, res, next) => {
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let name = req.query.name || "";
            let result = null

            if (limit && page) {
                result = await getAllCustomerService(limit, page, name);
            } else {
                result = await getAllCustomerService();
            }

            if (!result || result.length === 0) {
                return res.status(404).json({
                    EC: 1,
                    message: "No customers found",
                });
            }

            res.status(200).json({
                EC: 0,
                data: result,
            });
        } catch (error) {
            console.log("erorr >>>>>", error)
            return null
            // next(error); // Đẩy lỗi tới middleware
        }
    },
    postCreateCustomer: async (req, res) => {
        let { userId, fullName, email, phoneNumber, address, gender, identityNumber, dateOfBirth, profilePicture } = req.body
        const schema = Joi.object({
            userId: Joi.string()
            ,
            fullName: Joi.string()
            ,
            email: Joi.string().email()
            ,
            phoneNumber: Joi.string()
            ,
            address: Joi.string()
            ,
            gender: Joi.string()
            ,
            identityNumber: Joi.string()
            ,
            dateOfBirth: Joi.string()
            ,
            profilePicture: Joi.string().allow("")
            ,
        })
        const { error } = schema.validate(req.body);
        if (error) {
            console.log("error >>>>", error)
            return null
            // return error
        } else {
            let profilePictureUrl = "";
            // profilePicture: String
            if (!req.files || Object.keys(req.files).length === 0) {
                //do nothing
            } else {
                let result = await uploadSingleFile(req.files.profilePicture);
                profilePictureUrl = result.path;
            }

            let customerData = {
                userId,
                fullName,
                email,
                phoneNumber,
                address,
                gender,
                identityNumber,
                dateOfBirth,
                profilePicture: profilePictureUrl

            }
            let customer = await createCustomerService(customerData);

            return res.status(200).json(
                {
                    EC: 0,
                    data: customer
                }
            )
        }
    },
    postCreateArrayCustomer: async (req, res) => {
        let customers = await createArrayCustomerService(req.body.customers)
        if (customers) {
            return res.status(200).json(
                {
                    EC: 0,
                    data: customers
                }
            )
        } else {
            return res.status(200).json(
                {
                    EC: -1,
                    data: customers
                }
            )
        }
    },
    putUpdateCustomers: async (req, res) => {
        let { id, fullName, email, phoneNumber, address, gender, identityNumber, dateOfBirth } = req.body
        let result = await putUpdateCustomerService(id, fullName, email, phoneNumber, address, gender, identityNumber, dateOfBirth)
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    deleteCustomer: async (req, res) => {
        let id = req.body.id
        let result = await deleteCustomerService(id)

        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    deleteArrayCustomer: async (req, res) => {
        let ids = req.body.customersId
        // console.log(">>>check ids:", ids)
        let result = await deleteArrayCustomerService(ids)
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    }
}
