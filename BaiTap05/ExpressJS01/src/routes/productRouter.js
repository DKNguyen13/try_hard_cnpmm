const express = require("express");
const { getProducts } = require("../controllers/productController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", getProducts);

module.exports = router;
