const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },  // Liên kết với tài khoản
    transactionType: { type: String }, // Loại giao dịch
    amount: { type: Number },        // Số tiền giao dịch
    fromAccount: { type: String },  // Số tài khoản gửi (nếu là chuyển khoản)
    toAccount: { type: String },    // Số tài khoản nhận (nếu là chuyển khoản)
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;