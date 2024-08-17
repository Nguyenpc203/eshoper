const OrderModel = require('../models/order.model');

class OrderController {
    async listOrders(req, res) {
        const userId = req.session.userId;

        if (!userId) {
            return res.redirect('/login?message=You+need+to+login');
        }

        try {
            const orders = await OrderModel.find({ user: userId }).populate('items.product');
            return res.render('orders', { orders , user: req.user});
        } catch (error) {
            console.error('Error fetching orders:', error);
            return res.status(500).json({ success: false, message: 'Server error' });
        }
    }
    async getListOrders() {
        try {
            // Lấy danh sách đơn hàng và sắp xếp theo ngày tạo mới nhất
            const orders = await OrderModel.find().sort({ createdAt: -1 }).populate('user');
            return orders;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    }
    async updateOrderStatus(orderId, status) {
        try {
            const order = await OrderModel.findById(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            order.status = status;
            await order.save();
        } catch (error) {
            console.error('Error updating order status:', error);
            throw error;
        }
    }
}

module.exports = new OrderController();
