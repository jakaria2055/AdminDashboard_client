// src/pages/Signin.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, notification } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AdminStore from "../store/AdminStore";
import ValidationHelper from "../utility/ValidationHelper";
import { getEmail, clearEmail } from "../utility/utility";

const { Title, Text } = Typography;

const Signin = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { AdminFormData, AdminFormChange, LoginRequest } = AdminStore();
  const [loading, setLoading] = React.useState(false);

  // Get saved email when page loads
  useEffect(() => {
    const savedEmail = getEmail();
    if (savedEmail) {
      AdminFormChange("email", savedEmail);
      form.setFieldsValue({ email: savedEmail });
    }
  }, [form, AdminFormChange]);

  const onFinish = async (values) => {
    // Email validation
    if (!ValidationHelper.IsEmail(values.email)) {
      notification.error({
        message: 'Error',
        description: 'Valid email required!',
        placement: 'topRight',
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare data for login
      const loginData = {
        email: values.email,
        password: values.password
      };

      let res = await LoginRequest(loginData);
      if (res) {
        // Clear saved email on successful login
        clearEmail();
        
        notification.success({
          message: 'Success',
          description: 'Login successful!',
          placement: 'topRight',
        });
        
        navigate("/dashboard");
      } else {
        notification.error({
          message: 'Error',
          description: 'Login failed. Check credentials.',
          placement: 'topRight',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Something went wrong.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-12 px-4">
      <Card className="text-center shadow-lg">
        <Title level={2} className="!mb-6">Admin Sign In</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email required!' },
              { type: 'email', message: 'Valid email required!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="admin@example.com" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password required!' },
              { min: 6, message: 'Min 6 characters!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Password" 
              size="large" 
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={loading}
              className="h-12"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>
          
          <div>
            <Text className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup">
                <span className="text-blue-600 font-semibold">Sign Up</span>
              </Link>
            </Text>
          </div>
          
          <Text className="text-sm text-gray-500 block">
            Demo: admin@example.com / password123
          </Text>
      </Card>
    </div>
  );
};

export default Signin;