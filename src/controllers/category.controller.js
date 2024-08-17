const CategoryModel = require('../models/category.model');

class CategoryController {
    async getListCategory(req, res) {
        const categories = await CategoryModel.find();
        // return res.json(categories);
        // console.log(categories);
        return categories;
    }
    // async getProduct(req, res) {
    //     const product = await CategoryModel.findById(req.params._id);
    //     return res.json(product);
    // }
    async getCategory(id) {
        const categories = await CategoryModel.findById(id);
        // console.log(categories);
        return categories;
    }
    async createCategory(req, res) {
        const category = req.body;
     
        const newcategory = new CategoryModel(category);
        await newcategory.save();
     
        return res.redirect('http://localhost:3000/admin/list-category?message=Add+Category+successfully');
     }
     async updateCategory(req, res) {
       
        const updates = req.body;

        const updatedcategory = await CategoryModel.findByIdAndUpdate(req.params.id, updates);
        return res.redirect('http://localhost:3000/admin/list-category?message=Update+Category+successfully'); 
    }

    async deleteCategory(req, res) {
        try {
            const deletedCategory = await CategoryModel.findByIdAndDelete(req.params.id);
    
            if (!deletedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }
    
            return res.redirect('http://localhost:3000/admin/list-category?message=Admin+login+successfully');
        } catch (error) {
            return res.status(500).json({ message: 'Error deleting category', error });
        }
    }
    
    
};

module.exports = new CategoryController();