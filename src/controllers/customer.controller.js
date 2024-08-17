//src/controllers/customer.controller.js
const CustomerModel = require('../models/user.model');
const bcrypt = require('bcrypt');

class CustomerController {
    async register(req, res) {
        try {
            const { username, password } = req.body;
    
            // Kiểm tra xem username đã tồn tại trong cơ sở dữ liệu chưa
            const existingcustomer = await CustomerModel.findOne({ username });
            if (existingcustomer) {
                return res.redirect('http://localhost:3000/login?message=Username+already+exists!');
            }
    
           // Mã hóa mật khẩu bằng bcrypt
           const saltRounds = 10;
           const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            // Tạo customer mới
            const newcustomer = new CustomerModel({
                username,
                password: hashedPassword,
            });
    
            // Lưu customer mới vào cơ sở dữ liệu
            await newcustomer.save();
    
            return res.redirect('http://localhost:3000/login?message=customer+created+successfully');
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    

    async login(req, res) {
       
            const { username, password } = req.body;
    
            // Tìm user trong cơ sở dữ liệu
            const user = await CustomerModel.findOne({ username });
            if (!user) {
                return res.redirect('http://localhost:3000/login?message=User+not+found!');
            }
            if (user.status !== 'Work') {
                
                return  res.redirect('http://localhost:3000/login?message=Account+has+been+locked');
            }
            // Kiểm tra mật khẩu
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.redirect('http://localhost:3000/login?message=Password+not+correct!');
            }
    
            // Lưu thông tin user vào session
            req.session.userId = user._id;
    
            // Đăng nhập thành công và chuyển hướng người dùng đến trang danh sách sản phẩm
            return res.redirect('http://localhost:3000?message=User+login+successfully');
       
    }
    async logout(req, res) {
        try {
            req.session.destroy(err => {
                if (err) {
                    return res.status(500).send('Logout failed');
                }
                res.redirect('http://localhost:3000?message=User+logout+successfully');
            });
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    // Lấy danh sách người dùng
    async getListUsers() {
        try {
            const users = await CustomerModel.find();
            return users;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    // Cập nhật trạng thái người dùng
    async updateUserStatus(userId, status) {
        try {
            const user = await CustomerModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }

            user.status = status;
            await user.save();
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    }
}

module.exports = new CustomerController();
