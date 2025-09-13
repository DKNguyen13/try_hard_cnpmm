// src/components/context/CartProvider.jsx
import React, { useState, useEffect } from "react";
import { CartContext } from "./cart.context";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    // Lấy giỏ hàng từ localStorage khi load lần đầu
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Mỗi khi items thay đổi thì lưu lại vào localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      const exist = prev.find((i) => i._id === item._id);
      if (exist) {
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + 1 } // luôn +1
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }]; // mặc định 1 khi thêm mới
    });
  };

  const updateItem = (_id, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i._id === _id ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  };

  const removeItem = (_id) => {
    setItems((prev) => prev.filter((i) => i._id !== _id));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateItem, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
