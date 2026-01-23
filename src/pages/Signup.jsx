import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Button, Typography, notification } from "antd";
import { UserOutlined, MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import AdminStore from "../store/AdminStore";
import ValidationHelper from "../utility/ValidationHelper";
import { setEmail } from "../utility/utility";

const { Title, Text } = Typography;

const Signup = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { RegisterFormData, RegisterFormChange, AdminRegisterRequest } = AdminStore();
  const [loading, setLoading] = React.useState(false);

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
      // Prepare data
      const registerData = {
        email: values.email,
        password: values.password,
        name: values.name
      };

      let res = await AdminRegisterRequest(registerData);
      if (res) {
        // Save email for next signin
        setEmail(values.email);
        
        notification.success({
          message: 'Success',
          description: 'Account created!',
          placement: 'topRight',
        });
        
        navigate("/signin");
      } else {
        notification.error({
          message: 'Error',
          description: 'Registration failed.',
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
        <Title level={2} className="!mb-6">Admin Sign Up</Title>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="Your Name"
            name="name"
            rules={[{ required: true, message: 'Name required!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Your Name" size="large" />
          </Form.Item>
          
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email required!' },
              { type: 'email', message: 'Valid email required!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="admin@example.com" size="large" />
          </Form.Item>
          
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password required!' },
              { min: 6, message: 'Min 6 characters!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form.Item>
        </Form>

        <div className="mt-6">
          <Text className="text-gray-600">
            Already have an account?{" "}
            <Link to="/signin">
              <span className="text-blue-600 font-semibold">Sign In</span>
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Signup;