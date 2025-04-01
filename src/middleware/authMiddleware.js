const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Đường dẫn đến model User

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ EC: 1, EM: "Bạn chưa đăng nhập!" });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({ EC: 1, EM: "Người dùng không tồn tại!" });
        }

        req.user = user; // Gán user vào request để sử dụng ở controller
        next();
    } catch (error) {
        return res.status(401).json({ EC: 1, EM: "Token không hợp lệ!" });
    }
};

module.exports = authMiddleware;


