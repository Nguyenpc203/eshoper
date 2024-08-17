// src/controllers/cart.controller.js
const CartModel = require('../models/cart.model');
const ProductModel = require('../models/product.model');
const OrderModel = require('../models/order.model');

class CartController {
    
    async addToCart(req, res) {
        const quantity = 1;
        const productId = req.params.productId;
        const userId = req.session.userId;
    
        // Kiểm tra xem người dùng có đăng nhập hay không
        if (!userId) {
            return res.redirect('http://localhost:3000/login?message=You+need+to+login');
        }
    
        try {
            let cart = await CartModel.findOne({ user: userId });
            if (!cart) {
                cart = new CartModel({ user: userId, items: [] });
            }
    
            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            const existingItem = cart.items.find(item => item.product.toString() === productId);
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ 
                    product: productId, 
                    name: product.name,
                    price: product.price,
                    thumbnail: product.images[0],
                    quantity 
                });
            }
    
            await cart.save();
            return res.redirect('http://localhost:3000/cart?message=Added+product+successfully');
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    

    async removeFromCart(req, res) {
        const userId = req.session.userId;
        const productId = req.params.productId;
    
        if (!userId) {
            return res.redirect('/login?message=You+need+to+login');
        }
    
        try {
            let cart = await CartModel.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
    
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex === -1) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }
    
            cart.items.splice(itemIndex, 1);
            await cart.save();
    
            return res.redirect('/cart?message=Delete+successfully');
        } catch (error) {
            console.error('Error removing item from cart:', error);
            return res.status(500).json({ message: 'Server error', error });
        }
    }
    

    async viewCart(userId) {
        try {
            // Tìm giỏ hàng của người dùng
            const cart = await CartModel.findOne({ user: userId }).populate('items.product');
            if (!cart) {
                return { items: [], totalPrice: 0 };
            }
    
            // Tính tổng tiền của tất cả sản phẩm trong giỏ hàng
            const totalPrice = cart.items.reduce((sum, item) => {
                return sum + item.price * item.quantity;
            }, 0);
    
            return { ...cart.toObject(), totalPrice };
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }

    async updateQuantity(req, res) {
        const userId = req.session.userId;
        const { productId, change } = req.body;
    
        if (!userId) {
            return res.status(401).json({ success: false, message: 'You need to login' });
        }
    
        try {
            let cart = await CartModel.findOne({ user: userId });
            if (!cart) {
                return res.status(404).json({ success: false, message: 'Cart not found' });
            }
    
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex === -1) {
                return res.status(404).json({ success: false, message: 'Product not found in cart' });
            }
    
            cart.items[itemIndex].quantity += parseInt(change);
            if (cart.items[itemIndex].quantity <= 0) {
                cart.items.splice(itemIndex, 1); // Remove item if quantity is less than or equal to 0
            }
    
            await cart.save();
            return res.json({ success: true });
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    }
    async checkout(req, res) {
    const userId = req.session.userId;
    const {
        email, firstName, middleName, lastName, address1, address2,
        zipCode, country, state, phone, message
    } = req.body;

    if (!userId) {
        return res.redirect('/login?message=You+need+to+login');
    }

    try {
        let cart = await CartModel.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Xử lý thông tin thanh toán và giao hàng ở đây
        const orderDetails = {
            user: userId,
            email,
           
            firstName,
            middleName,
            lastName,
            address1,
            address2,
            zipCode,
            country,
            state,
            phone,
            message,
            items: cart.items,
            totalPrice: cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
        };

        // Lưu thông tin đơn hàng vào cơ sở dữ liệu
        // Giả sử bạn có một mô hình OrderModel để lưu trữ thông tin đơn hàng
        const order = new OrderModel(orderDetails);
        await order.save();

        // Xóa giỏ hàng sau khi thanh toán
        // Xóa giỏ hàng sau khi thanh toán thành công
        await CartModel.deleteOne({ user: userId });

        return res.redirect('/cart?message=Checkout+successful');
    } catch (error) {
        console.error('Error during checkout:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
    }
}

module.exports = new CartController();
