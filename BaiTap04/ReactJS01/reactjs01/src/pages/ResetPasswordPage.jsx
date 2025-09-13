import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Divider, Form, Input, notification, Row } from "antd";
import axios from "../util/axios.customize";

const ResetPasswordPage = () => {
  const { token } = useParams(); // lấy token từ URL
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { newPassword } = values;

    try {
      const res = await axios.post("/v1/api/reset-password", {
        token,
        newPassword,
      });

      // ✅ res đã là response.data do interceptor
      if (res?.EC === 0) {
        notification.success({
          message: "RESET PASSWORD",
          description: res.message,
        });
        navigate("/login"); // bây giờ sẽ chạy
      } else {
        notification.error({
          message: "RESET PASSWORD",
          description: res?.EM || "Có lỗi xảy ra",
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: "RESET PASSWORD",
        description: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
  };

  return (
    <Row justify={"center"} style={{ marginTop: "30px" }}>
      <Col xs={24} md={16} lg={8}>
        <fieldset
          style={{
            padding: "15px",
            margin: "5px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        >
          <legend>Đặt lại mật khẩu</legend>
          <Form
            name="reset-password"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu mới!",
                },
                {
                  min: 6,
                  message: "Mật khẩu tối thiểu 6 ký tự!",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Đặt lại mật khẩu
              </Button>
            </Form.Item>
          </Form>
          <Divider />
          <div style={{ textAlign: "center" }}>
            <Button type="link" onClick={() => navigate("/login")}>
              Quay lại đăng nhập
            </Button>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default ResetPasswordPage;
