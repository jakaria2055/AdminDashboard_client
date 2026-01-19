// src/pages/Dashboard.jsx - Fixed Version
import React, { useEffect } from 'react';
import { 
  Card, Row, Col, Statistic, Table, Progress, 
  Typography, Spin, Alert, Space, Tag 
} from 'antd';
import { 
  TeamOutlined, UserOutlined, CheckCircleOutlined, 
  ClockCircleOutlined, StarOutlined, ArrowUpOutlined,
  ArrowDownOutlined 
} from '@ant-design/icons';
import EmployeeStore from '../store/EmployeeStore';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { 
    dashboardData, 
    loading, 
    error, 
    fetchDashboardData 
  } = EmployeeStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]); // Added dependency

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error Loading Dashboard"
        description={error}
        type="error"
        showIcon
        className="mb-4"
        action={
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        }
      />
    );
  }

  // Safely extract data with defaults
  const summary = dashboardData?.summary || {};
  const performance = dashboardData?.performanceStats || {};
  const recentEmployees = dashboardData?.recentEmployees || [];
  const topPerformers = dashboardData?.topPerformers || [];
  const departmentStats = dashboardData?.departmentStats || [];

  // Stats cards
  const statsData = [
    { 
      title: 'Total Employees', 
      value: summary.totalEmployees || 0, 
      icon: <TeamOutlined />, 
      color: '#1890ff',
      change: summary.employeeGrowth || '+0%',
      trend: 'up'
    },
    { 
      title: 'Active Today', 
      value: summary.activeEmployees || 0, 
      icon: <UserOutlined />, 
      color: '#52c41a',
      change: summary.activePercentage || '0%',
      trend: 'up'
    },
    { 
      title: 'Avg Performance', 
      value: performance.averageScore ? `${Math.round(performance.averageScore)}%` : '0%', 
      icon: <CheckCircleOutlined />, 
      color: '#faad14',
      change: performance.scoreTrend || '+0%',
      trend: 'up'
    },
    { 
      title: 'Pending Reviews', 
      value: summary.pendingReviews || 0, 
      icon: <ClockCircleOutlined />, 
      color: '#f5222d',
      change: 'Requires attention',
      trend: 'down'
    },
  ];

  // Table columns for recent employees
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
          percent={score || 0} 
          size="small" 
          strokeColor={
            score >= 80 ? '#52c41a' : 
            score >= 60 ? '#faad14' : '#f5222d'
          }
        />
      )
    },
  ];

  // Table columns for top performers
  const topPerformerColumns = [
    { 
      title: '#', 
      key: 'rank', 
      width: 50,
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
      key: 'department',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    { 
      title: 'Score', 
      dataIndex: 'performanceScore', 
      key: 'performanceScore',
      align: 'right',
      render: (score) => (
        <Space>
          <StarOutlined className="text-yellow-500" />
          <Text strong className="text-lg">{score || 0}</Text>
        </Space>
      )
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <Title level={2} className="!mb-2">Dashboard Overview</Title>
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
                    className="p-3 rounded-lg text-2xl" 
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
            title={<span className="font-semibold">Recent Employees</span>}
            extra={<a href="/employees" className="text-blue-500 hover:text-blue-600">View All</a>}
            className="shadow-sm h-full"
          >
            {recentEmployees.length > 0 ? (
              <Table 
                dataSource={recentEmployees} 
                columns={recentColumns} 
                size="middle"
                pagination={false}
                rowKey="_id"
                loading={loading}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent employees found
              </div>
            )}
          </Card>
        </Col>

        {/* Top Performers */}
        <Col xs={24} lg={8}>
          <Card 
            title={<span className="font-semibold">Top Performers</span>}
            className="shadow-sm h-full"
          >
            {topPerformers.length > 0 ? (
              <Table 
                dataSource={topPerformers} 
                columns={topPerformerColumns} 
                size="small"
                pagination={false}
                rowKey="_id"
                loading={loading}
                showHeader={false}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                No top performers data
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Department Distribution */}
      {departmentStats.length > 0 && (
        <Card 
          title={<span className="font-semibold">Department Distribution</span>}
          className="mt-6 shadow-sm"
          extra={<Text className="text-gray-500">Total: {summary.totalEmployees || 0} employees</Text>}
        >
          <Row gutter={[16, 16]}>
            {departmentStats.map((dept, index) => {
              const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
              const percentage = dept.percentage || 0;
              const count = dept.count || 0;
              
              return (
                <Col xs={24} sm={12} md={8} lg={4.8} key={index}>
                  <div className="text-center p-4">
                    <div className="mb-4">
                      <Progress
                        type="circle"
                        percent={Math.round(percentage)}
                        width={100}
                        strokeColor={colors[index % colors.length]}
                        format={() => (
                          <div className="text-center">
                            <Text strong className="text-2xl block">{count}</Text>
                            <Text className="text-xs text-gray-500">employees</Text>
                          </div>
                        )}
                      />
                    </div>
                    <Text strong className="block text-base">{dept.department}</Text>
                    <Text className="text-gray-500 text-sm">{percentage.toFixed(1)}%</Text>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* Performance Summary */}
      {(performance.highPerformers || performance.mediumPerformers || performance.lowPerformers) && (
        <Card 
          title={<span className="font-semibold">Performance Summary</span>}
          className="mt-6 shadow-sm"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="text-center p-6 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                <Title level={1} className="!text-green-600 !mb-2">
                  {performance.highPerformers || 0}
                </Title>
                <Text className="text-green-700 font-medium block">High Performers</Text>
                <Text className="block text-green-600 text-sm mt-1">(80-100%)</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center p-6 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
                <Title level={1} className="!text-blue-600 !mb-2">
                  {performance.mediumPerformers || 0}
                </Title>
                <Text className="text-blue-700 font-medium block">Medium Performers</Text>
                <Text className="block text-blue-600 text-sm mt-1">(60-79%)</Text>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="text-center p-6 bg-orange-50 rounded-lg hover:shadow-md transition-shadow">
                <Title level={1} className="!text-orange-600 !mb-2">
                  {performance.lowPerformers || 0}
                </Title>
                <Text className="text-orange-700 font-medium block">Low Performers</Text>
                <Text className="block text-orange-600 text-sm mt-1">(Below 60%)</Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;