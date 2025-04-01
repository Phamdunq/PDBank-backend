const express = require('express');
const routerAPI = express.Router();

const { getAllCustomers, postCreateCustomer,
    putUpdateCustomers, deleteCustomer,
    postCreateArrayCustomer, deleteArrayCustomer,
} = require('../controllers/customerController');

const { postCreateAccount, getAllAccount,
    putUpdateAccount, deleteAccount,
    deleteArrayAccount,
    getAllAccountByCustomer,
    getAccount
} = require('../controllers/accountController')

const { postCreateTransaction, getAllTransaction,
    deleteTransaction,
    deleteArrayTransaction,
} = require('../controllers/transactionController')

const { getAllUser, postCreateUser,
    putUpdateUser, deleteUser,
    deleteArrayUser,
    loginUser,
    updateUserPassword,
    registerUser,
} = require('../controllers/userController');

const { postUploadSingleFileApi, postUploadMultipleFile } = require('../controllers/uploadFileController');
const { sendOTPController, verifyOTPController } = require('../controllers/otpController');

const authMiddleware = require("../middleware/authMiddleware");

routerAPI.get('/customers', getAllCustomers)
routerAPI.post('/customers', postCreateCustomer)
routerAPI.post('/customers-many', postCreateArrayCustomer)
routerAPI.put('/customers', putUpdateCustomers)
routerAPI.delete('/customers', deleteCustomer)
routerAPI.delete('/customers-many', deleteArrayCustomer)

routerAPI.post('/file', postUploadSingleFileApi)
routerAPI.post('/files', postUploadMultipleFile)

routerAPI.post('/accounts', postCreateAccount)
routerAPI.get('/accounts/get', getAccount)
routerAPI.get('/accounts', getAllAccount)
routerAPI.get('/accounts-customers', getAllAccountByCustomer)
routerAPI.put('/accounts', putUpdateAccount)
routerAPI.delete('/accounts', deleteAccount)
routerAPI.delete('/account-many', deleteArrayAccount)

routerAPI.post('/transactions', postCreateTransaction)
routerAPI.get('/transactions', getAllTransaction)
routerAPI.delete('/transactions', deleteTransaction)
routerAPI.delete('/transaction-many', deleteArrayTransaction)

routerAPI.post('/login', loginUser)
routerAPI.post('/register', registerUser)
routerAPI.get('/users', getAllUser)
routerAPI.post('/users', postCreateUser)
routerAPI.put('/users', putUpdateUser)
routerAPI.put("/users/update-password", updateUserPassword);
routerAPI.delete('/users', deleteUser)
routerAPI.delete('/user-many', deleteArrayUser)

routerAPI.post('/send-otp', sendOTPController)
routerAPI.post('/verify-otp', verifyOTPController)

module.exports = routerAPI;
