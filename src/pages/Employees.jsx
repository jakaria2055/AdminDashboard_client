// src/pages/Employees.jsx
import React, { useState } from 'react';
import { 
  Table, Card, Button, Input, Select, DatePicker, 
  Space, Tag, Switch, Drawer, Form, message, 
  Row, Col, Tooltip, Popconfirm, Progress, 
  Dropdown, Menu, Badge, Modal, Empty, Avatar
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, EditOutlined, 
  DeleteOutlined, FilterOutlined, SortAscendingOutlined,
  AppstoreOutlined, TableOutlined, EyeOutlined,
  EyeInvisibleOutlined, DownloadOutlined, MoreOutlined,
  UserOutlined, CalendarOutlined, TeamOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { confirm } = Modal;

const Employees = () => {
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [showArchived, setShowArchived] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
    dateRange: []
  });
  const [form] = Form.useForm();

  // Mock data based on your API
  const mockEmployees = [
    {
      _id: '1',
      employeeID: 'EMP001',
      name: 'John Doe',
      department: 'Engineering',
      role: 'Senior Developer',
      status: 'Active',
      joiningDate: '2024-01-15',
      performanceScore: 85,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=1'
    },
    {
      _id: '2',
      employeeID: 'EMP002',
      name: 'Jane Smith',
      department: 'Marketing',
      role: 'Marketing Manager',
      status: 'Active',
      joiningDate: '2024-02-20',
      performanceScore: 92,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=2'
    },
    {
      _id: '3',
      employeeID: 'EMP003',
      name: 'Bob Johnson',
      department: 'Sales',
      role: 'Sales Executive',
      status: 'On Leave',
      joiningDate: '2023-11-10',
      performanceScore: 65,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=3'
    },
    {
      _id: '4',
      employeeID: 'EMP004',
      name: 'Alice Brown',
      department: 'HR',
      role: 'HR Manager',
      status: 'Active',
      joiningDate: '2024-03-05',
      performanceScore: 88,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=4'
    },
    {
      _id: '5',
      employeeID: 'EMP005',
      name: 'Mike Wilson',
      department: 'Engineering',
      role: 'Team Lead',
      status: 'Active',
      joiningDate: '2023-08-22',
      performanceScore: 95,
      isArchived: true,
      image: 'https://i.pravatar.cc/150?img=5'
    },
    {
      _id: '6',
      employeeID: 'EMP006',
      name: 'Sarah Davis',
      department: 'IT',
      role: 'System Admin',
      status: 'Active',
      joiningDate: '2024-01-30',
      performanceScore: 78,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=6'
    },
    {
      _id: '7',
      employeeID: 'EMP007',
      name: 'David Chen',
      department: 'Finance',
      role: 'Financial Analyst',
      status: 'Active',
      joiningDate: '2023-12-15',
      performanceScore: 82,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=7'
    },
    {
      _id: '8',
      employeeID: 'EMP008',
      name: 'Emma Wilson',
      department: 'Operations',
      role: 'Operations Manager',
      status: 'Active',
      joiningDate: '2024-02-28',
      performanceScore: 91,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=8'
    },
    {
      _id: '9',
      employeeID: 'EMP009',
      name: 'James Taylor',
      department: 'Engineering',
      role: 'DevOps Engineer',
      status: 'On Leave',
      joiningDate: '2023-10-10',
      performanceScore: 87,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=9'
    },
    {
      _id: '10',
      employeeID: 'EMP010',
      name: 'Lisa Anderson',
      department: 'Marketing',
      role: 'Content Writer',
      status: 'Active',
      joiningDate: '2024-03-15',
      performanceScore: 74,
      isArchived: false,
      image: 'https://i.pravatar.cc/150?img=10'
    },
  ];

  // Filter employees based on search and filters
  const filteredEmployees = mockEmployees.filter(employee => {
    if (showArchived && !employee.isArchived) return false;
    if (!showArchived && employee.isArchived) return false;
    
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      return (
        employee.name.toLowerCase().includes(searchLower) ||
        employee.employeeID.toLowerCase().includes(searchLower) ||
        employee.department.toLowerCase().includes(searchLower) ||
        employee.role.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.department && employee.department !== filters.department) return false;
    if (filters.status && employee.status !== filters.status) return false;
    
    return true;
  });

  // Table columns
  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeID',
      key: 'employeeID',
      sorter: (a, b) => a.employeeID.localeCompare(b.employeeID),
      width: 120,
    },
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text, record) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            src={record.image} 
            icon={<UserOutlined />}
            size="large"
            className="border-2 border-blue-100"
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500 text-sm">{record.role}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
      render: (text) => (
        <Tag 
          color={
            text === 'Engineering' ? 'blue' :
            text === 'Marketing' ? 'green' :
            text === 'Sales' ? 'red' :
            text === 'HR' ? 'purple' : 'orange'
          }
        >
          {text}
        </Tag>
      ),
      filters: [
        { text: 'Engineering', value: 'Engineering' },
        { text: 'Marketing', value: 'Marketing' },
        { text: 'Sales', value: 'Sales' },
        { text: 'HR', value: 'HR' },
        { text: 'IT', value: 'IT' },
        { text: 'Finance', value: 'Finance' },
        { text: 'Operations', value: 'Operations' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'success' : 'warning'}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'On Leave', value: 'On Leave' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Joining Date',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
      sorter: (a, b) => new Date(a.joiningDate) - new Date(b.joiningDate),
      render: (date) => (
        <div className="flex items-center text-gray-600">
          <CalendarOutlined className="mr-2" />
          {dayjs(date).format('DD MMM YYYY')}
        </div>
      ),
    },
    {
      title: 'Performance',
      dataIndex: 'performanceScore',
      key: 'performanceScore',
      sorter: (a, b) => a.performanceScore - b.performanceScore,
      render: (score) => (
        <div className="flex items-center space-x-2">
          <Progress 
            percent={score} 
            size="small" 
            style={{ width: 80 }}
            strokeColor={
              score >= 80 ? '#52c41a' : 
              score >= 60 ? '#faad14' : '#f5222d'
            }
            format={() => `${score}%`}
          />
        </div>
      ),
    },
    {
      title: 'Archived',
      dataIndex: 'isArchived',
      key: 'isArchived',
      render: (isArchived) => (
        <Badge 
          status={isArchived ? 'error' : 'success'} 
          text={isArchived ? 'Archived' : 'Active'}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item 
                key="edit" 
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              >
                Edit
              </Menu.Item>
              <Menu.Item 
                key="archive" 
                icon={record.isArchived ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={() => handleArchiveToggle(record)}
              >
                {record.isArchived ? 'Restore' : 'Archive'}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                key="delete" 
                icon={<DeleteOutlined />}
                danger
                onClick={() => handleDelete(record)}
              >
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    form.setFieldsValue({
      ...employee,
      joiningDate: dayjs(employee.joiningDate)
    });
    setDrawerVisible(true);
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleArchiveToggle = (employee) => {
    message.success(`Employee ${employee.isArchived ? 'restored' : 'archived'} successfully`);
  };

  const handleDelete = (employee) => {
    confirm({
      title: 'Delete Employee',
      content: `Are you sure you want to delete ${employee.name}? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success('Employee deleted successfully');
      },
    });
  };

  const handleSubmit = (values) => {
    const action = selectedEmployee ? 'updated' : 'created';
    message.success(`Employee ${action} successfully`);
    setDrawerVisible(false);
    form.resetFields();
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600">Manage all employees in your organization</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreate}
          >
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filter Card */}
      <Card className="mb-6 shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search by name, ID, department..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              size="large"
            />
          </Col>
          
          <Col xs={24} md={16}>
            <Space wrap>
              <Select
                placeholder="Department"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange('department', value)}
                allowClear
                suffixIcon={<FilterOutlined />}
              >
                <Option value="Engineering">Engineering</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Sales">Sales</Option>
                <Option value="HR">HR</Option>
                <Option value="IT">IT</Option>
                <Option value="Finance">Finance</Option>
                <Option value="Operations">Operations</Option>
              </Select>
              
              <Select
                placeholder="Status"
                style={{ width: 150 }}
                onChange={(value) => handleFilterChange('status', value)}
                allowClear
              >
                <Option value="Active">Active</Option>
                <Option value="On Leave">On Leave</Option>
              </Select>
              
              <RangePicker
                style={{ width: 250 }}
                onChange={(dates) => handleFilterChange('dateRange', dates)}
                placeholder={['Start Date', 'End Date']}
              />
              
              <Tooltip title="Toggle Archived View">
                <Switch
                  checkedChildren="Archived"
                  unCheckedChildren="Active"
                  checked={showArchived}
                  onChange={setShowArchived}
                />
              </Tooltip>
              
              <Tooltip title="Toggle View Mode">
                <Button.Group>
                  <Button 
                    type={viewMode === 'table' ? 'primary' : 'default'}
                    icon={<TableOutlined />}
                    onClick={() => setViewMode('table')}
                  />
                  <Button 
                    type={viewMode === 'card' ? 'primary' : 'default'}
                    icon={<AppstoreOutlined />}
                    onClick={() => setViewMode('card')}
                  />
                </Button.Group>
              </Tooltip>
              
              <Button icon={<DownloadOutlined />}>
                Export
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Summary Stats */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <TeamOutlined className="text-3xl text-blue-500 mb-2" />
            <div className="text-2xl font-bold">{filteredEmployees.length}</div>
            <div className="text-gray-500">Total Employees</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <UserOutlined className="text-3xl text-green-500 mb-2" />
            <div className="text-2xl font-bold">
              {filteredEmployees.filter(e => e.status === 'Active').length}
            </div>
            <div className="text-gray-500">Active Employees</div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="text-center">
            <EditOutlined className="text-3xl text-purple-500 mb-2" />
            <div className="text-2xl font-bold">
              {Math.round(
                filteredEmployees.reduce((sum, e) => sum + e.performanceScore, 0) / 
                (filteredEmployees.length || 1)
              )}%
            </div>
            <div className="text-gray-500">Avg Performance</div>
          </Card>
        </Col>
      </Row>

      {/* Employees View */}
      <Card>
        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={filteredEmployees}
            rowKey="_id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} employees`,
            }}
            scroll={{ x: 1300 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    searchText || filters.department || filters.status
                      ? "No employees match your search criteria"
                      : "No employees found"
                  }
                />
              )
            }}
          />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredEmployees.map(employee => (
              <Col xs={24} sm={12} md={8} lg={6} key={employee._id}>
                <Card
                  hoverable
                  className="employee-card"
                  cover={
                    <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Avatar 
                        src={employee.image} 
                        size={80} 
                        icon={<UserOutlined />}
                        className="border-4 border-white shadow-lg"
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <div className="flex justify-between items-start">
                        <span className="font-bold">{employee.name}</span>
                        <Badge 
                          status={employee.isArchived ? 'error' : 'success'} 
                          text={employee.isArchived ? 'Archived' : 'Active'}
                        />
                      </div>
                    }
                    description={
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">ID:</span>
                          <Tag color="blue">{employee.employeeID}</Tag>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Department:</span>
                          <span className="font-medium">{employee.department}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Role:</span>
                          <span>{employee.role}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Performance:</span>
                          <Progress 
                            percent={employee.performanceScore} 
                            size="small" 
                            style={{ width: 60 }}
                          />
                        </div>
                        <div className="pt-4 border-t flex justify-between">
                          <Button 
                            type="text" 
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(employee)}
                          />
                          <Button 
                            type="text" 
                            icon={employee.isArchived ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            onClick={() => handleArchiveToggle(employee)}
                          />
                          <Button 
                            type="text" 
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(employee)}
                          />
                        </div>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {/* Employee Form Drawer */}
      <Drawer
        title={selectedEmployee ? "Edit Employee" : "Add New Employee"}
        width={500}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedEmployee(null);
          form.resetFields();
        }}
        open={drawerVisible}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Employee ID"
            name="employeeID"
            rules={[{ required: true, message: 'Please enter employee ID' }]}
          >
            <Input placeholder="EMP001" />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select placeholder="Select department">
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Sales">Sales</Option>
                  <Option value="HR">HR</Option>
                  <Option value="IT">IT</Option>
                  <Option value="Finance">Finance</Option>
                  <Option value="Operations">Operations</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please enter role' }]}
              >
                <Input placeholder="Software Engineer" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select>
                  <Option value="Active">Active</Option>
                  <Option value="On Leave">On Leave</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Joining Date"
                name="joiningDate"
                rules={[{ required: true, message: 'Please select joining date' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Performance Score (1-100)"
            name="performanceScore"
            rules={[
              { required: true, message: 'Please enter performance score' },
              { type: 'number', min: 1, max: 100, message: 'Score must be between 1-100' }
            ]}
          >
            <Input type="number" min={1} max={100} />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
          >
            <Input placeholder="https://example.com/avatar.jpg" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {selectedEmployee ? 'Update Employee' : 'Create Employee'}
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Employees;