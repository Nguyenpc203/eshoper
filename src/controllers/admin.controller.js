 //src/controller/admin.controller.js
 const UserModel = require('../models/user.model');
// const crypto = require('crypto');
const bcrypt = require('bcrypt');

class AdminController {

    async login(req, res) {
       
            const { username, password } = req.body;
    
            // Tìm user trong cơ sở dữ liệu
            const user = await UserModel.findOne({ username });
            if (!user) {
                return  res.redirect('http://localhost:3000/admin/login?message=User+not+found');
            }
    
             // Kiểm tra mật khẩu
             const isPasswordValid = await bcrypt.compare(password, user.password);
             if (!isPasswordValid) {
                 return res.redirect('http://localhost:3000/admin/login?message=Invalid+password');
             }
    
            // Kiểm tra role của user
            if (user.role !== 'admin') {
                
                return  res.redirect('http://localhost:3000/admin/login?message=User+is+not+an+admin');
            }

            if (user.status !== 'Work') {
                
                return  res.redirect('http://localhost:3000/admin/login?message=Account+has+been+locked');
            }
    
            // Lưu thông tin user vào session
            req.session.userId = user._id;
            req.session.userRole = user.role;
    
            // Đăng nhập thành công và chuyển hướng người dùng đến trang danh sách sản phẩm
            return res.redirect('http://localhost:3000/admin/list-product?message=User+login+successfully');
       
    }
    async logout(req, res) {
        try {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).send('Logout failed');
                }
                res.redirect('http://localhost:3000/admin/login?message=Admin+logout+successfully');
            });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    
}

module.exports = new AdminController();
