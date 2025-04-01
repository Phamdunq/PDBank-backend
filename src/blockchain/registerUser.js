/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Wallets } = require('fabric-network'); // Thư viện để quản lý ví trong Fabric
const FabricCAServices = require('fabric-ca-client'); // Thư viện để tương tác với CA
const fs = require('fs'); // Thư viện để làm việc với hệ thống file
const path = require('path'); // Thư viện để xử lý đường dẫn file

async function registerUser(userId) {
    try {
        // Tải cấu hình mạng từ file
        const ccpPath = "/home/dunq/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Tạo một CA client mới để tương tác với CA
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Tạo một ví mới trên hệ thống file để quản lý danh tính
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Kiểm tra xem danh tính admin đã tồn tại chưa
        const adminIdentity = await wallet.get('admin');
        if (!adminIdentity) {
            console.log('Danh tính cho người dùng admin "admin" không tồn tại trong ví');
            console.log('Vui lòng chạy ứng dụng enrollAdmin.js trước');
            return;
        }

        // Tạo một đối tượng người dùng để xác thực với CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, 'admin');

        // Đăng ký người dùng, đăng nhập người dùng và nhập danh tính mới vào ví
        const secret = await ca.register({
            affiliation: 'org1.department1', // Phân quyền cho người dùng
            enrollmentID: userId, // ID của người dùng
            role: 'client' // Vai trò của người dùng
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret // Mật khẩu đã được cấp cho người dùng
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP', // ID của tổ chức
            type: 'X.509', // Loại chứng chỉ
        };
        await wallet.put(userId, x509Identity); // Lưu danh tính vào ví
        console.log(`Đã đăng ký và nhập người dùng "${userId}" vào ví thành công`);

    } catch (error) {
        console.error(`Đăng ký người dùng "${userId}" thất bại: ${error}`);
        process.exit(1); // Thoát nếu có lỗi
    }
}

module.exports = {
    registerUser // Xuất hàm registerUser
};
