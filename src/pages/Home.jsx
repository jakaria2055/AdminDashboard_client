import { Card, Button, Typography, Row, Col, Alert } from "antd";
import {
  DashboardOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto pt-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <DashboardOutlined className="text-3xl text-blue-600" />
        </div>

        <Title className="!text-3xl md:!text-4xl !mb-3">Admin Dashboard</Title>

        <Text className="text-gray-500 text-lg mb-8 block">
          Employee Management System
        </Text>

        <Alert
          message="Authentication Required"
          description="Sign in to access the admin panel features."
          type="warning"
          showIcon
          className="mb-8"
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-3">
          <Link to={"/signin"}>
            <Button
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              className="h-12"
            >
              Sign In
            </Button>
          </Link>

          <Link to={"/signup"}>
            <Button size="large" icon={<UserAddOutlined />} className="h-12">
              Create Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Info */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} md={12}>
          <Card className="h-full">
            <Title level={4} className="!mb-4">
              For Administrators
            </Title>
            <Text className="text-gray-600">
              Manage employee records, track performance, and generate reports
              all in one place.
            </Text>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card className="h-full">
            <Title level={4} className="!mb-4">
              Features
            </Title>
            <div className="space-y-2">
              <Text className="block">→ Employee CRUD operations</Text>
              <Text className="block">→ Advanced search & filters</Text>
              <Text className="block">→ Performance analytics</Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bottom CTA */}
      <div className="text-center">
        <Text className="text-gray-500 block mb-4">
          Need help? Contact support@admin-dashboard.com
        </Text>
      </div>
    </div>
  );
};

export default Home;
