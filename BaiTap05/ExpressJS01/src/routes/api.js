const express = require("express");
const {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const delay = require("../middleware/delay");
const {
  createProduct,
  getProducts,
} = require("../controllers/productController");

const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");

const routerAPI = express.Router();

// routerAPI.use(auth);

routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});

routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);

routerAPI.get("/user", getUser);
routerAPI.get("/account", delay, getAccount);

// Tạo category
routerAPI.post("/categories", createCategory);

// Lấy danh sách category
routerAPI.get("/categories", getCategories);

// Tạo product mới
routerAPI.post("/products", createProduct);

// Lấy danh sách product (có phân trang / lazy loading)
routerAPI.get("/products", getProducts);

module.exports = routerAPI;
