const { getAllUserService, createUserService,
    putUpdateUserService, deleteUserService,
    deleteArrayUserService,
    loginUserService,
    getUserService,
    putUpdateUserPasswordService,
    registerUserService
} = require('../services/userServices')
const Joi = require('joi')

//{key: value, key1: value1}
module.exports = {
    loginUser: async (req, res) => {
        const userData = {
            phoneNumber,
            password
        } = req.body;

        const result = await loginUserService(userData);
        // Nếu có lỗi từ service, trả về lỗi
        if (result.error) {
            return res.status(401).json({ error: result.error });
        }

        // Đăng nhập thành công -> Trả về user + token
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    registerUser: async (req, res) => {
        try {
            const userData = req.body;

            // Gọi service để xử lý đăng ký
            const result = await registerUserService(userData);

            // Trả về kết quả
            return res.status(result.EC === 0 ? 201 : 400).json(result);
        } catch (error) {
            console.error("Lỗi trong quá trình đăng ký:", error);
            return res.status(500).json({ EC: 2, EM: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
        }
    },

    postCreateUser: async (req, res) => {
        let { phoneNumber, password, role, status } = req.body
        const schema = Joi.object({
            phoneNumber: Joi.string(),
            password: Joi.string(),
            role: Joi.string(),
            status: Joi.string()
        })
        const { error } = schema.validate(req.body)
        if (error) {
            //return error
        } else {
            let userData = {
                phoneNumber,
                password,
                role,
                status
            }

            let user = await createUserService(userData)

            return res.status(200).json(
                {
                    EC: 0,
                    data: user
                }
            )
        }
    },
    getAllUser: async (req, res) => {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let name = req.query.name || "";
        let result = null;

        if (limit && page) {
            result = await getAllUserService(limit, page, name);
            return res.status(200).json({
                EC: 0,
                data: result
            });
        } else {
            result = await getAllUserService()
            return res.status(200).json({
                EC: 0,
                data: result,
            });
        }
    },

    putUpdateUser: async (req, res) => {
        const { id, ...updateData } = req.body;
        const result = await putUpdateUserService(id, updateData);
        return res.status(200).json({
            EC: 0,
            data: result
        });

    },
    deleteUser: async (req, res) => {
        let id = req.body.id
        let result = await deleteUserService(id)

        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    deleteArrayUser: async (req, res) => {
        let ids = req.body.usersId
        const result = await deleteArrayUserService(ids)
        return res.status(200).json(
            {
                EC: 0,
                data: result
            }
        )
    },
    updateUserPassword: async (req, res) => {
        const { id, oldPassword, newPassword } = req.body;

        // Kiểm tra input từ request
        if (!id || !oldPassword || !newPassword) {
            return res.status(400).json({ EC: 1, EM: "Thiếu thông tin cần thiết!" });
        }

        // Gọi service để cập nhật mật khẩu
        const result = await putUpdateUserPasswordService(id, oldPassword, newPassword);
        return res.status(200).json(result);
    },


}