// src/pages/Dashboard.jsx - Fixed for Actual API Response
import React, { useEffect } from 'react';
import { 
  Card, Row, Col, Table, Progress, 
  Typography, Spin, Alert, Space, Tag, Empty 
} from 'antd';
import { 
  TeamOutlined, UserOutlined, StarOutlined, TrophyOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import EmployeeStore from '../store/EmployeeStore';
import dayjs from 'dayjs';

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
  }, [fetchDashboardData]);

  // Log the dashboard data to debug
  useEffect(() => {
    if (dashboardData) {
      console.log('Dashboard Data:', dashboardData);
      console.log('Recent Employees:', dashboardData.recentEmployees);
      console.log('Summary:', dashboardData.summary);
      console.log('Performance Stats:', dashboardData.performanceStats);
      console.log('Department Stats:', dashboardData.departmentStats);
      console.log('Top Performers:', dashboardData.topPerformers);
    }
  }, [dashboardData]);

  if (loading && !dashboardData) {
    return (
      <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <Spin size="large" tip="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Error Loading Dashboard"
          description={error}
          type="error"
          showIcon
          className="mb-4"
          action={
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          }
        />
      </div>
    );
  }

  // Safely extract data with defaults
  const summary = dashboardData?.summary || {};
  const performance = dashboardData?.performanceStats || {};
  const recentEmployees = dashboardData?.recentEmployees || [];
  const topPerformers = dashboardData?.topPerformers || [];
  const departmentStats = dashboardData?.departmentStats || [];

  // Calculate stats
  const totalEmployees = summary.totalEmployees || 0;
  const activeEmployees = summary.activeEmployees || 0;

  // Stats cards - only showing Total and Active employees
  const statsData = [
    { 
      title: 'Total Employees', 
      value: totalEmployees, 
      icon: <TeamOutlined />, 
      color: '#1890ff'
    },
    { 
      title: 'Active Employees', 
      value: activeEmployees, 
      icon: <UserOutlined />, 
      color: '#52c41a'
    }
  ];

  // Recent employees table columns
  const recentColumns = [
    { 
      title: 'Employee ID', 
      dataIndex: 'employeeID', 
      key: 'employeeID',
      width: 120,
      render: (text) => <Tag color="blue">{text}</Tag>
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
      render: (text) => (
        <Tag color={
          text === 'Engineering' ? 'blue' :
          text === 'Marketing' ? 'green' :
          text === 'Sales' ? 'red' :
          text === 'HR' ? 'purple' : 
          text === 'IT' ? 'cyan' : 'orange'
        }>
          {text}
        </Tag>
      )
    },
    { 
      title: 'Role', 
      dataIndex: 'role', 
      key: 'role',
      render: (text) => <Text className="text-gray-600">{text}</Text>
    },
    { 
      title: 'Joining Date', 
      dataIndex: 'joiningDate', 
      key: 'joiningDate',
      render: (date) => (
        <Space>
          <CalendarOutlined className="text-gray-400" />
          <Text>{dayjs(date).format('DD MMM YYYY')}</Text>
        </Space>
      )
    },
    { 
      title: 'Performance', 
      dataIndex: 'performanceScore', 
      key: 'performanceScore',
      render: (score) => (
        <Progress 
          percent={score || 0} 
          size="small" 
          style={{ width: 100 }}
          strokeColor={
            score >= 80 ? '#52c41a' : 
            score >= 60 ? '#faad14' : '#f5222d'
          }
        />
      )
    },
  ];

  // Top performers table columns
  const topPerformerColumns = [
    { 
      title: 'Rank', 
      key: 'rank', 
      width: 70,
      align: 'center',
      render: (_, __, index) => (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
          index === 0 ? 'bg-yellow-400 text-white' :
          index === 1 ? 'bg-gray-300 text-gray-700' :
          index === 2 ? 'bg-orange-300 text-white' :
          'bg-blue-100 text-blue-600'
        }`}>
          {index === 0 ? <TrophyOutlined /> : (index + 1)}
        </div>
      )
    },
    { 
      title: 'Name', 
      dataIndex: 'name', 
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong className="block">{text}</Text>
          <Text className="text-xs text-gray-500">{record.employeeID}</Text>
        </div>
      )
    },
    { 
      title: 'Department', 
      dataIndex: 'department', 
      key: 'department',
      render: (text) => (
        <Tag color={
          text === 'Engineering' ? 'blue' :
          text === 'Marketing' ? 'green' :
          text === 'Sales' ? 'red' :
          text === 'HR' ? 'purple' : 
          text === 'IT' ? 'cyan' : 'orange'
        }>
          {text}
        </Tag>
      )
    },
    { 
      title: 'Performance', 
      dataIndex: 'performanceScore', 
      key: 'performanceScore',
      align: 'center',
      width: 150,
      render: (score) => (
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
            <StarOutlined className="text-yellow-500" />
            <Text strong className="text-lg">{score}%</Text>
          </div>
          <Progress 
            percent={score || 0} 
            size="small" 
            style={{ width: 120 }}
            strokeColor={
              score >= 80 ? '#52c41a' : 
              score >= 60 ? '#faad14' : '#f5222d'
            }
            showInfo={false}
          />
        </div>
      )
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <Title level={2} className="!mb-2">Dashboard Overview</Title>
        <Text className="text-gray-500">
          Welcome back! Here's your employee management analytics
        </Text>
      </div>

      {/* Stats Cards - Only Total and Active */}
      <Row gutter={[16, 16]} className="mb-8">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={12} key={index}>
            <Card 
              className="shadow-sm hover:shadow-md transition-all duration-200 h-full"
              bordered={false}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <Text className="text-gray-500 text-sm block mb-2">
                    {stat.title}
                  </Text>
                  <Title level={2} className="!my-0 !text-4xl" style={{ color: stat.color }}>
                    {stat.value}
                  </Title>
                </div>
                <div 
                  className="p-4 rounded-lg text-3xl" 
                  style={{ 
                    backgroundColor: `${stat.color}15`,
                    color: stat.color 
                  }}
                >
                  {stat.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Main Content Grid */}
      <Row gutter={[16, 16]}>
        {/* Recent Employees */}
        <Col xs={24} xl={14}>
          <Card 
            title={
              <div className="flex items-center">
                <TeamOutlined className="mr-2" />
                <span className="font-semibold">Recent Employees</span>
              </div>
            }
            extra={
              <a 
                href="/employees"
                className="text-blue-500 hover:text-blue-600"
              >
                View All →
              </a>
            }
            className="shadow-sm h-full"
            bordered={false}
          >
            {recentEmployees && recentEmployees.length > 0 ? (
              <Table 
                dataSource={recentEmployees} 
                columns={recentColumns} 
                size="small"
                pagination={false}
                rowKey={(record) => record._id || record.employeeID}
                loading={loading}
                scroll={{ x: 900 }}
              />
            ) : (
              <Empty 
                description="No recent employees found"
                className="py-8"
              />
            )}
          </Card>
        </Col>

        {/* Top Performers */}
        <Col xs={24} xl={10}>
          <Card 
            title={
              <div className="flex items-center">
                <TrophyOutlined className="mr-2 text-yellow-500" />
                <span className="font-semibold">Top 5 Performers</span>
              </div>
            }
            className="shadow-sm h-full"
            bordered={false}
          >
            {topPerformers && topPerformers.length > 0 ? (
              <Table 
                dataSource={topPerformers.slice(0, 5)} 
                columns={topPerformerColumns} 
                size="small"
                pagination={false}
                rowKey={(record) => record._id || record.employeeID}
                loading={loading}
                scroll={{ x: 600 }}
              />
            ) : (
              <Empty 
                description="No top performers data available"
                className="py-8"
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Department Distribution */}
      {departmentStats && departmentStats.length > 0 && (
        <Card 
          title={
            <div className="flex items-center">
              <TeamOutlined className="mr-2" />
              <span className="font-semibold">Department Distribution</span>
            </div>
          }
          className="mt-6 shadow-sm"
          bordered={false}
          extra={
            <Text className="text-gray-500">
              Total: {totalEmployees} employees
            </Text>
          }
        >
          <Row gutter={[24, 24]}>
            {departmentStats.map((dept, index) => {
              const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2', '#eb2f96'];
              const count = dept.count || dept._count || 0;
              
              // Calculate percentage if not provided
              let percentage = dept.percentage || 0;
              if (percentage === 0 && totalEmployees > 0 && count > 0) {
                percentage = (count / totalEmployees) * 100;
              }
              
              return (
                <Col xs={24} sm={12} md={8} lg={4.8} key={dept.department || dept._id || index}>
                  <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="mb-4">
                      <Progress
                        type="circle"
                        percent={Math.round(percentage)}
                        width={100}
                        strokeWidth={8}
                        strokeColor={colors[index % colors.length]}
                        format={() => (
                          <div className="text-center">
                            <Text strong className="text-2xl block">
                              {count}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              employees
                            </Text>
                          </div>
                        )}
                      />
                    </div>
                    <Text strong className="block text-base mb-1">
                      {dept.department || dept._id}
                    </Text>
                    <Tag color={colors[index % colors.length]}>
                      {percentage.toFixed(1)}%
                    </Tag>
                  </div>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* Performance Summary */}
      {(performance.highPerformers !== undefined || 
        performance.mediumPerformers !== undefined || 
        performance.lowPerformers !== undefined) && (
        <Card 
          title={
            <div className="flex items-center">
              <StarOutlined className="mr-2 text-yellow-500" />
              <span className="font-semibold">Performance Summary</span>
            </div>
          }
          className="mt-6 shadow-sm"
          bordered={false}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-lg hover:shadow-lg transition-all">
                <Title level={1} className="!text-green-600 !mb-2">
                  {performance.highPerformers || 0}
                </Title>
                <Text className="text-green-700 font-medium block text-lg">
                  High Performers
                </Text>
                <Text className="block text-green-600 text-sm mt-2">
                  Score: 80-100%
                </Text>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg hover:shadow-lg transition-all">
                <Title level={1} className="!text-blue-600 !mb-2">
                  {performance.mediumPerformers || 0}
                </Title>
                <Text className="text-blue-700 font-medium block text-lg">
                  Medium Performers
                </Text>
                <Text className="block text-blue-600 text-sm mt-2">
                  Score: 60-79%
                </Text>
              </div>
            </Col>
            
            <Col xs={24} md={8}>
              <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg hover:shadow-lg transition-all">
                <Title level={1} className="!text-orange-600 !mb-2">
                  {performance.lowPerformers || 0}
                </Title>
                <Text className="text-orange-700 font-medium block text-lg">
                  Needs Improvement
                </Text>
                <Text className="block text-orange-600 text-sm mt-2">
                  Score: Below 60%
                </Text>
              </div>
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;