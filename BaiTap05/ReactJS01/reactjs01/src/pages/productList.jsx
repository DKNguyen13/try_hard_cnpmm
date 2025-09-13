import { useEffect, useState } from "react";
import { Row, Col, Card, Button, Select, Pagination, Spin } from "antd";
import axios from "axios";

const { Option } = Select;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 4;

  // Lấy danh sách category
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/v1/api/categories");
      setCategories(res.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/v1/api/products", {
        params: { page, limit, category },
      });
      setProducts(res.data.data || []);
      setTotalItems(res.data.totalItems || 0);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, category]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <h2
        style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
      >
        Sản phẩm
      </h2>

      {/* Filter Category */}
      <div style={{ marginBottom: "20px" }}>
        <Select
          value={category || "all"}
          style={{ width: 200 }}
          onChange={(value) => {
            setCategory(value === "all" ? "" : value);
            setPage(1);
          }}
        >
          <Option value="all">Tất cả</Option>
          {categories.map((c) => (
            <Option key={c._id} value={c._id}>
              {c.name}
            </Option>
          ))}
        </Select>
      </div>

      {/* Grid sản phẩm */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col xs={24} sm={12} md={8} lg={6} key={p._id}>
              <Card
                hoverable
                cover={
                  <img
                    alt={p.name}
                    src="img/product.png"
                    style={{
                      height: "180px",
                      objectFit: "contain",
                      padding: "12px",
                    }}
                  />
                }
              >
                <Card.Meta
                  title={p.name}
                  description={p.category?.name || "Khác"}
                />
                <p
                  style={{
                    marginTop: "10px",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  ${p.price}
                </p>
                <p style={{ fontSize: "12px", color: "#888" }}>
                  Còn lại: {p.quantity}
                </p>
                <Button type="primary" block>
                  Thêm vào giỏ
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: "24px" }}>
        <Pagination
          current={page}
          pageSize={limit}
          total={totalItems}
          onChange={(p) => setPage(p)}
        />
      </div>
    </div>
  );
}
