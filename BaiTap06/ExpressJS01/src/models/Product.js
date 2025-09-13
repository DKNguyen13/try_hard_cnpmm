// models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: { type: String },
    cpu: { type: String },
    ram: { type: String },
    storage: { type: String },
    gpu: { type: String },
    screen: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    description: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
