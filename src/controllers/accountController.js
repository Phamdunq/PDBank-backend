const { createAccountService, getAllAccountService,
    putUpdateAccountService, deleteAccountService,
    deleteArrayAccountService,
    getAllAccountByCustomerService,
    getAccountService
} = require('../services/accountService')
const Joi = require('joi')

module.exports = {
    postCreateAccount: async (req, res) => {
        let { customerId, accountNumber, accountType, balance } = req.body
        const schema = Joi.object({
            customerId: Joi.string(),
            accountNumber: Joi.string(),
            accountType: Joi.string(),
            balance: Joi.string(),
        })
        const { error } = schema.validate(req.body)
        if (error) {
            //return error
        } else {
            let accountData = {
                customerId,
                accountNumber,
                accountType,
                balance,
            }

            let account = await createAccountService(accountData)

            return res.status(200).json(
                {
                    EC: 0,
                    data: account
                }
            )
        }
    },
    getAllAccount: async (req, res) => {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let accountNumber = req.query.accountNumber || "";
        let accountType = req.query.accountType || "";

        let result = await getAllAccountService(limit, page, accountNumber, accountType);

        return res.status(200).json({
            EC: 0,
            data: result,
        });
    },

    putUpdateAccount: async (req, res) => {
        let { id, customerId, accountNumber, accountType, balance } = req.body
        let result = await putUpdateAccountService(id, customerId, accountNumber, accountType, balance)
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    deleteAccount: async (req, res) => {
        let id = req.body.id
        let result = await deleteAccountService(id)
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    deleteArrayAccount: async (req, res) => {
        let ids = req.body.accountsId
        const result = await deleteArrayAccountService(ids)
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    getAllAccountByCustomer: async (req, res) => {
        let result = await getAllAccountByCustomerService()
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    getAccount: async (req, res) => {
        let result = await getAccountService()
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    }

}