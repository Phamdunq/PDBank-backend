const { createTransactionService, getAllTransactionService,
    putUpdateTransactionService, deleteTransactionService,
    deleteArrayTransactionService,
} = require('../services/transactionService')
const Joi = require('joi')

module.exports = {
    postCreateTransaction: async (req, res) => {
        try {
            let { accountId, transactionType, amount, fromAccount, toAccount } = req.body;

            const schema = Joi.object({
                accountId: Joi.string().optional(),
                transactionType: Joi.string().required(),
                amount: Joi.number().min(1).required(),
                fromAccount: Joi.string().required(),
                toAccount: Joi.string().required()
            });

            const { error } = schema.validate({ accountId, transactionType, amount, fromAccount, toAccount });
            if (error) {
                return res.status(400).json({
                    EC: 1,
                    message: error.details[0].message
                });
            }

            // Chuyển amount thành số để tránh lỗi phép toán
            amount = parseFloat(amount);

            let transactionData = { accountId, transactionType, amount, fromAccount, toAccount };
            let transaction = await createTransactionService(transactionData);

            if (!transaction) {
                return res.status(500).json({
                    EC: 2,
                    message: "Transaction failed"
                });
            }

            return res.status(200).json({
                EC: 0,
                data: transaction
            });
        } catch (error) {
            return res.status(500).json({
                EC: 3,
                message: "Internal Server Error"
            });
        }
    },
    getAllTransaction: async (req, res) => {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let name = req.query.name || "";
        let result = null;

        if (limit && page) {
            result = await getAllTransactionService(limit, page, name);
            return res.status(200).json({
                EC: 0,
                data: result
            });
        } else {
            result = await getAllTransactionService();
            return res.status(200).json({
                EC: 0,
                data: result,
            });
        }
    },
    // putUpdateTransaction: async (req, res) => {
    //     let { id, accountId, transactionType, amount, fromAccount, toAccount } = req.body
    // let result = await putUpdateTransactionService(id, accountId, transactionType, amount, fromAccount, toAccount)
    //     return res.status(200).json(
    //         {
    //             EC: 0,
    //             data: result
    //         }
    //     )
    // },
    deleteTransaction: async (req, res) => {
        let id = req.body.id
        let result = await deleteTransactionService(id)
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    deleteArrayTransaction: async (req, res) => {
        let ids = req.body.transactionsId
        let result = await deleteArrayTransactionService(ids)
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },

}