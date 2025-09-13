// src/pages/CartPage.jsx
import React from "react";
import {
  Table,
  Button,
  InputNumber,
  Typography,
  Popconfirm,
  Empty,
} from "antd";
import { useCart } from "../context/useCart";

const { Title } = Typography;

const CartTable = () => {
  const { items, updateItem, removeItem, clearCart } = useCart();

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url) => (
        <img
          src={url}
          alt="product"
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toLocaleString()}`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => updateItem(record._id, value)}
        />
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) =>
        `$${(record.price * record.quantity).toLocaleString()} `,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Xóa sản phẩm này?"
          onConfirm={() => removeItem(record._id)}
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Giỏ hàng của bạn</Title>
      {items.length === 0 ? (
        <Empty description="Giỏ hàng trống" />
      ) : (
        <>
          <Table
            dataSource={items.map((item) => ({ ...item, key: item._id }))}
            columns={columns}
            pagination={false}
          />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button danger onClick={clearCart}>
              Xóa giỏ hàng
            </Button>
            <Title level={4}>Tổng cộng: ${total.toLocaleString()} </Title>
            <Button type="primary" size="large">
              Thanh toán
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default CartTable;
