const Product = require("../models/Product");
const Category = require("../models/Category");

// Tạo product mới
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      brand,
      cpu,
      ram,
      storage,
      gpu,
      screen,
      price,
      quantity,
      description,
      imageUrl,
    } = req.body;

    // Kiểm tra category có tồn tại
    const categoryExist = await Category.findById(category);
    if (!categoryExist) {
      return res.status(400).json({ message: "Category not found" });
    }

    const product = await Product.create({
      name,
      category,
      brand,
      cpu,
      ram,
      storage,
      gpu,
      screen,
      price,
      quantity,
      description,
      imageUrl,
    });

    return res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Lấy sản phẩm với phân trang / lazy loading
const getProducts = async (req, res) => {
  try {
    let { page = 1, limit = 5, category } = req.query;

    // Ép kiểu sang số (tránh lỗi khi query string là string)
    page = Number(page);
    limit = Number(limit);

    const query = category ? { category } : {};

    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const products = await Product.find(query)
      .populate("category")
      .skip((page - 1) * limit)
      .limit(limit);

    return res.status(200).json({
      data: products,
      totalPages,
      currentPage: page,
      totalItems,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createProduct, getProducts };
