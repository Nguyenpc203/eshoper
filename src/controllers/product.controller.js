//src/controllers/product.controller.js
const ProductModel = require('../models/product.model');
const CategoryModel = require('../models/category.model');
const redisClient = require('../dbs/redis');
const upload = require('../config/multer');

class ProductController {
    static upload = upload; // Thêm thuộc tính upload vào class

    async getListProduct(page, limit) {
        const skip = (page - 1) * limit;
        const cacheKey = `products:${page}:${limit}`;
        
        // Kiểm tra dữ liệu trong Redis trước
        const cachedProducts = await redisClient.get(cacheKey);
        if (cachedProducts) {
            return JSON.parse(cachedProducts);
        }

        // Nếu không có trong Redis, lấy từ database
        const products = await ProductModel.find().skip(skip).limit(limit);

        // Lưu kết quả vào Redis
        await redisClient.set(cacheKey, JSON.stringify(products), 'EX', 60 * 10); // Cache trong 10 phút

        return products;
    }
    async getProduct(id) {
        const products = await ProductModel.findById(id);
        // console.log(products);
        return products;
    }
    async createProduct(req, res) {
        try {
            const product = req.body;
            if (req.files && req.files.images) {
                product.images = req.files.images.map(file => file.filename);
            }

            const newProduct = new ProductModel(product);
            await newProduct.save();
            

            return res.redirect('/admin/list-product?message=Add+product+successfully');
        } catch (error) {
            return res.status(500).json({ message: 'Error creating product', error });
        }
    }

    async updateProduct(req, res) {
        try {
            const updates = req.body;    
            if (req.files && req.files.images) {
                updates.images = req.files.images.map(file => file.filename);
            }

            const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.id, updates, { new: true });

            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Xóa cache cũ liên quan đến sản phẩm và danh sách sản phẩm
            await redisClient.del(`product:${req.params.id}`);
            const pages = await redisClient.keys('products:*');
            for (const page of pages) {
                await redisClient.del(page);
            }

            // Cập nhật cache với dữ liệu sản phẩm mới
            await redisClient.set(`product:${req.params.id}`, JSON.stringify(updatedProduct), 'EX', 60 * 10);

            return res.redirect('/admin/list-product?message=Update+product+successfully');
        } catch (error) {
            return res.status(500).json({ message: 'Error updating product', error });
        }
    }
    

    async deleteProduct(req, res) {
        try {
            const deletedProduct = await ProductModel.findByIdAndDelete(req.params._id);

            if (!deletedProduct) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            return res.redirect('http://localhost:3000/admin/list-product?message=Admin+login+successfully');
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting product', error });
        }
    }
    async getProductsByCategory(categoryName) {
        try {
            // Sử dụng tên danh mục để tìm các sản phẩm
            const products = await ProductModel.find({ category: categoryName });
            // console.log(products)
            return products;
        } catch (error) {
            throw new Error('Server error');
        }
    }
    async searchProducts(keyword) {    
            // Sử dụng keyword để tìm kiếm sản phẩm
            const products = await ProductModel.find({
                $or: [
                    { name: { $regex: keyword, $options: 'i' } },
                    { category: { $regex: keyword, $options: 'i' } },
                    { description: { $regex: keyword, $options: 'i' } },
                    { price: { $regex: keyword, $options: 'i' } }
                ]
            });
            // Trả về kết quả tìm kiếm
            return products;
    }
    async filterProducts(query) {
        try {
            // Xây dựng điều kiện lọc dựa trên các tiêu chí lọc
            let filterQuery = {};

            // Lọc theo khoảng thời gian tạo sản phẩm
            if (query.startDate && query.endDate) {
                filterQuery.created_at = { $gte: new Date(query.startDate), $lte: new Date(query.endDate) };
            } else if (query.startDate) {
                filterQuery.created_at = { $gte: new Date(query.startDate) };
            } else if (query.endDate) {
                filterQuery.created_at = { $lte: new Date(query.endDate) };
            }

            const products = await ProductModel.find(filterQuery);
            return products;
        } catch (error) {
            console.error('Error filtering products:', error);
            throw new Error('Error filtering products');
        }
    }
};

module.exports = new ProductController();
module.exports.upload = upload; 