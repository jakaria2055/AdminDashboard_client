// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Progress, 
  Typography, Spin, Alert, Space 
} from 'antd';
import { 
  TeamOutlined, UserOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, StarOutlined, ArrowUpOutlined,
  ArrowDownOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  // Mock data matching your API structure
  const mockDashboardData = {
    summary: {
      totalEmployees: 156,
      activeEmployees: 142,
      pendingReviews: 23,
      employeeGrowth: '+12%',
      activePercentage: '91%'
    },
    performanceStats: {
      averageScore: 78,
      highPerformers: 45,
      mediumPerformers: 67,
      lowPerformers: 44,
      scoreTrend: '+8%'
    },
    recentEmployees: [
      { _id: '1', name: 'John Doe', department: 'Engineering', role: 'Developer', performanceScore: 85, status: 'Active' },
      { _id: '2', name: 'Jane Smith', department: 'Marketing', role: 'Manager', performanceScore: 92, status: 'Active' },
      { _id: '3', name: 'Bob Johnson', department: 'Sales', role: 'Executive', performanceScore: 65, status: 'Active' },
      { _id: '4', name: 'Alice Brown', department: 'HR', role: 'Recruiter', performanceScore: 88, status: 'Active' },
      { _id: '5', name: 'Mike Wilson', department: 'Engineering', role: 'Lead', performanceScore: 95, status: 'Active' },
    ],
    topPerformers: [
      { _id: '1', name: 'Sarah Johnson', department: 'Engineering', performanceScore: 98 },
      { _id: '2', name: 'David Chen', department: 'IT', performanceScore: 96 },
      { _id: '3', name: 'Emma Wilson', department: 'Sales', performanceScore: 95 },
      { _id: '4', name: 'Michael Brown', department: 'Marketing', performanceScore: 94 },
      { _id: '5', name: 'Lisa Taylor', department: 'HR', performanceScore: 92 },
    ],
    departmentStats: [
      { department: 'Engineering', count: 65, percentage: 42 },
      { department: 'Sales', count: 32, percentage: 21 },
      { department: 'Marketing', count: 28, percentage: 18 },
      { department: 'HR', count: 18, percentage: 12 },
      { department: 'Finance', count: 13, percentage: 8 },
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(mockDashboardData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  const { summary, performanceStats, recentEmployees, topPerformers, departmentStats } = dashboardData;

  // Stats cards
  const statsData = [
    { 
      title: 'Total Employees', 
      value: summary.totalEmployees, 
      icon: <TeamOutlined />, 
      color: '#1890ff',
      change: summary.employeeGrowth,
      trend: 'up'
    },
    { 
      title: 'Active Today', 
      value: summary.activeEmployees, 
      icon: <UserOutlined />, 
      color: '#52c41a',
      change: summary.activePercentage,
      trend: 'up'
    },
    { 
      title: 'Avg Performance', 
      value: `${performanceStats.averageScore}%`, 
      icon: <CheckCircleOutlined />, 
      color: '#faad14',
      change: performanceStats.scoreTrend,
      trend: 'up'
    },
    { 
      title: 'Pending Reviews', 
      value: summary.pendingReviews, 
      icon: <ClockCircleOutlined />, 
      color: '#f5222d',
      change: 'Requires attention',
      trend: 'down'
    },
  ];

  // Table columns
  const recentColumns = [
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Department', 
      dataIndex: 'department', 
      key: 'department',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    { 
      title: 'Role', 
      dataIndex: 'role', 
      key: 'role' 
    },
    { 
      title: 'Performance', 
      dataIndex: 'performanceScore', 
      key: 'performanceScore',
      render: (score) => (
        <Progress 
          percent={score} 
          size="small" 
          strokeColor={
            score >= 80 ? '#52c41a' : 
            score >= 60 ? '#faad14' : '#f5222d'
          }
        />
      )
    },
  ];

  const topPerformerColumns = [
    { 
      title: '#', 
      key: 'rank', 
      render: (_, __, index) => (
        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
          index === 0 ? 'bg-yellow-100 text-yellow-600' :
          index === 1 ? 'bg-gray-100 text-gray-600' :
          index === 2 ? 'bg-orange-100 text-orange-600' :
          'bg-blue-50 text-blue-600'
        }`}>
          {index + 1}
        </div>
      )
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Department', 
      dataIndex: 'department', 
      key: 'department' 
    },
    { 
      title: 'Score', 
      dataIndex: 'performanceScore', 
      key: 'performanceScore',
      render: (score) => (
        <Space>
          <StarOutlined className="text-yellow-500" />
          <Text strong className="text-lg">{score}</Text>
        </Space>
      )
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Title level={2}>Dashboard Overview</Title>
        <Text className="text-gray-500">Welcome back! Here's your employee analytics</Text>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} className="mb-8">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
              <Space direction="vertical" className="w-full">
                <div className="flex justify-between items-start">
                  <div>
                    <Text className="text-gray-500 text-sm">{stat.title}</Text>
                    <Title level={2} className="!my-2 !text-3xl">{stat.value}</Title>
                  </div>
                  <div 
                    className="p-3 rounded-lg" 
                    style={{ 
                      backgroundColor: `${stat.color}15`,
                      color: stat.color 
                    }}
                  >
                    {stat.icon}
                  </div>
                </div>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowUpOutlined className="text-green-500 mr-1" />
                  ) : (
                    <ArrowDownOutlined className="text-red-500 mr-1" />
                  )}
                  <Text className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Recent Employees */}
        <Col xs={24} lg={16}>
          <Card 
            title="Recent Employees" 
            extra={<a href="/employees" className="text-blue-500">View All</a>}
            className="shadow-sm h-full"
          >
            <Table 
              dataSource={recentEmployees} 
              columns={recentColumns} 
              size="middle"
              pagination={false}
              rowKey="_id"
              className="custom-table"
            />
          </Card>
        </Col>

        {/* Top Performers */}
        <Col xs={24} lg={8}>
          <Card 
            title="Top Performers" 
            className="shadow-sm h-full"
          >
            <Table 
              dataSource={topPerformers} 
              columns={topPerformerColumns} 
              size="small"
              pagination={false}
              rowKey="_id"
              className="custom-table"
            />
          </Card>
        </Col>
      </Row>

      {/* Department Distribution */}
      <Card 
        title="Department Distribution" 
        className="mt-8 shadow-sm"
        extra={<Text className="text-gray-500">Total: {summary.totalEmployees} employees</Text>}
      >
        <Row gutter={[16, 16]}>
          {departmentStats.map((dept, index) => {
            const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
            return (
              <Col xs={24} sm={12} md={8} lg={4.8} key={index}>
                <div className="text-center">
                  <div className="mb-4">
                    <Progress
                      type="circle"
                      percent={dept.percentage}
                      width={80}
                      strokeColor={colors[index % colors.length]}
                      format={() => (
                        <div className="text-center">
                          <Text strong className="text-xl">{dept.count}</Text>
                        </div>
                      )}
                    />
                  </div>
                  <Text strong className="block">{dept.department}</Text>
                  <Text className="text-gray-500 text-sm">{dept.percentage}%</Text>
                </div>
              </Col>
            );
          })}
        </Row>
      </Card>

      {/* Performance Summary */}
      <Card title="Performance Summary" className="mt-8 shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <Title level={1} className="!text-green-600 !mb-2">
                {performanceStats.highPerformers}
              </Title>
              <Text className="text-green-700 font-medium">High Performers</Text>
              <Text className="block text-green-600 text-sm mt-1">(80-100%)</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <Title level={1} className="!text-blue-600 !mb-2">
                {performanceStats.mediumPerformers}
              </Title>
              <Text className="text-blue-700 font-medium">Medium Performers</Text>
              <Text className="block text-blue-600 text-sm mt-1">(60-79%)</Text>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <Title level={1} className="!text-orange-600 !mb-2">
                {performanceStats.lowPerformers}
              </Title>
              <Text className="text-orange-700 font-medium">Low Performers</Text>
              <Text className="block text-orange-600 text-sm mt-1">(Below 60%)</Text>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Quick Stats */}
      <Card className="mt-8 shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Statistic
              title="Average Performance"
              value={performanceStats.averageScore}
              suffix="%"
              valueStyle={{ color: performanceStats.averageScore >= 70 ? '#3f8600' : '#cf1322' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Active Rate"
              value={Math.round((summary.activeEmployees / summary.totalEmployees) * 100)}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col xs={24} md={8}>
            <Statistic
              title="Growth Rate"
              value={12}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

// Need Tag component
const Tag = ({ color, children }) => (
  <span className={`px-2 py-1 rounded-full text-xs bg-${color}-100 text-${color}-600`}>
    {children}
  </span>
);

export default Dashboard;