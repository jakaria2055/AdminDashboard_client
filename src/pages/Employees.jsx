import { useState, useEffect, useCallback } from 'react';
import { 
  Table, Card, Button, Input, Select, DatePicker, 
  Space, Tag, Switch, Drawer, Form, notification,
  Row, Col, Tooltip, Popconfirm, Progress, Badge, Avatar, Empty, Spin,
  Upload, Typography
} from 'antd';
import { 
  SearchOutlined, PlusOutlined, EditOutlined, 
  FilterOutlined, AppstoreOutlined, TableOutlined, EyeOutlined,
  EyeInvisibleOutlined,  UserOutlined,
  CalendarOutlined, UploadOutlined,
  CloseOutlined, SaveOutlined
} from '@ant-design/icons';
import EmployeeStore from '../store/EmployeeStore';
import dayjs from 'dayjs';

const { Option } = Select;
const { Dragger } = Upload;
const { Text } = Typography;

const Employees = () => {
  const [viewMode, setViewMode] = useState('table');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [form] = Form.useForm();
  
  const {
    employees,
    totalEmployees,
    loading,
    filters,
    currentPage,
    pageSize,
    fetchEmployees,
    searchWithDebounce,
    updateFilter,
    updatePagination,
    clearFilters,
    createEmployee,
    updateEmployee,
    archiveEmployee,
  } = EmployeeStore();

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleSearch = useCallback((value) => {
    setSearchText(value);
    searchWithDebounce(value);
  }, [searchWithDebounce]);

  const handleFilterChange = (field, value) => {
    updateFilter(field, value);
  };

  const handlePaginationChange = (page, pageSize) => {
    updatePagination(page, pageSize);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    
    const formValues = {
      employeeID: employee.employeeID,
      name: employee.name,
      department: employee.department,
      role: employee.role,
      status: employee.status,
      joiningDate: employee.joiningDate ? dayjs(employee.joiningDate) : null,
      performanceScore: Number(employee.performanceScore),
      image: employee.image
    };
    
    // console.log('Form values to set:', formValues);
    form.setFieldsValue(formValues);
    
    // Set preview image if exists
    if (employee.image) {
      setPreviewImage(employee.image);
    } else {
      setPreviewImage('');
    }
    
    setFileList([]);
    setDrawerVisible(true);
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setFileList([]);
    setPreviewImage('');
    
    // Generate new employee ID
    const nextId = employees.length > 0 ? 
      Math.max(...employees.map(e => parseInt(e.employeeID?.replace('EMP', '') || 0))) + 1 : 1;
    
    const initialValues = {
      employeeID: `EMP${String(nextId).padStart(3, '0')}`,
      name: '',
      department: '',
      role: '',
      status: 'Active',
      joiningDate: dayjs(),
      performanceScore: 50
    };
    
    // console.log('Creating new employee with values:', initialValues);
    form.setFieldsValue(initialValues);
    setDrawerVisible(true);
  };

  const handleArchiveToggle = async (employee) => {
    console.log('Archive toggle for:', employee);
    try {
      const success = await archiveEmployee(employee._id);
      if (success) {
        notification.success({
          message: employee.isArchived ? 'Employee Restored' : 'Employee Archived',
          description: `${employee.name} has been ${employee.isArchived ? 'restored' : 'archived'} successfully.`,
          placement: 'topRight'
        });
      }
    } catch (error) {
      console.error('Archive error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update employee status.',
        placement: 'topRight'
      });
    }
  };

  const handleFileUpload = (info) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    setFileList(fileList);
    
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      console.log('File selected:', file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage('');
    }
  };

  const handleRemoveFile = () => {
    setFileList([]);
    setPreviewImage('');
    if (selectedEmployee) {
      form.setFieldsValue({ image: null });
    }
  };

  const handleSubmit = async (values) => {
    // console.log('form submitted with values:', values);
    // console.log('selected employee:', selectedEmployee);
    // console.log('file list:', fileList);
    
    try {
      const formData = {
        employeeID: values.employeeID,
        name: values.name,
        department: values.department,
        role: values.role,
        status: values.status,
        joiningDate: values.joiningDate,
        performanceScore: Number(values.performanceScore),
        isArchived: selectedEmployee ? selectedEmployee.isArchived : false
      };

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.image = fileList[0].originFileObj;
      } else if (selectedEmployee?.image && previewImage && !fileList.length) {
        formData.image = selectedEmployee.image;
      }


      let success;
      if (selectedEmployee) {
        success = await updateEmployee(selectedEmployee._id, formData);
      } else {
        success = await createEmployee(formData);
      }

      if (success) {
        setDrawerVisible(false);
        setSelectedEmployee(null);
        setFileList([]);
        setPreviewImage('');
        form.resetFields();
      } else {
        console.log('operation failed');
      }
    } catch (error) {
      console.error('Form submit error:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to save employee data.',
        placement: 'topRight'
      });
    }
  };

  const uploadProps = {
    onRemove: handleRemoveFile,
    beforeUpload: () => false,
    onChange: handleFileUpload,
    fileList,
    maxCount: 1,
    accept: 'image/*'
  };

  const columns = [
    {
      title: 'EMP ID',
      dataIndex: 'employeeID',
      key: 'employeeID',
      sorter: true,
      width: 120,
    },
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      sorter: true,
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
      sorter: true,
      render: (text) => (
        <Tag 
          color={
            text === 'Engineering' ? 'blue' :
            text === 'Marketing' ? 'green' :
            text === 'Sales' ? 'red' :
            text === 'HR' ? 'purple' : 
            text === 'Transport' ? 'red' : 
            text === 'Business' ? 'yellow' : 
            text === 'Account' ? 'pink' : 
            text === 'IT' ? 'cyan' : 'orange'
          }
        >
          {text}
        </Tag>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
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
    },
    {
      title: 'Joining Date',
      dataIndex: 'joiningDate',
      key: 'joiningDate',
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
      render: (score) => (
        <Progress 
          percent={score} 
          size="small" 
          style={{ width: 80 }}
          strokeColor={
            score >= 80 ? '#52c41a' : 
            score >= 60 ? '#faad14' : '#f5222d'
          }
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          
          <Tooltip title={record.isArchived ? "Restore" : "Archive"}>
            <Popconfirm
              title={`${record.isArchived ? "Restore" : "Archive"} employee?`}
              onConfirm={() => handleArchiveToggle(record)}
            >
              <Button 
                type="text" 
                icon={record.isArchived ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Employee Management</h1>
            <p className="text-gray-600">Total: {totalEmployees} employees</p>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            size="large"
            onClick={handleCreate}
            loading={loading}
          >
            Add Employee
          </Button>
        </div>
      </div>

      <Card className="mb-6 shadow-sm">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Input
              placeholder="Search employees..."
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
                value={filters.department}
                onChange={(value) => handleFilterChange('department', value)}
                allowClear
              >
                <Option value="Engineering">Engineering</Option>
                <Option value="Marketing">Marketing</Option>
                <Option value="Sales">Sales</Option>
                <Option value="HR">HR</Option>
                <Option value="IT">IT</Option>
                <Option value="Transport">Transport</Option>
                <Option value="Business">Business</Option>
                <Option value="Account">Accounts</Option>
              </Select>

              <Select
                placeholder="Role"
                style={{ width: 150 }}
                value={filters.role}
                onChange={(value) => handleFilterChange('role', value)}
                allowClear
              >
                <Option value="Manager">Manager</Option>
                <Option value="Designer">Designer</Option>
                <Option value="Developer">Developer</Option>
                <Option value="Driver">Driver</Option>
                <Option value="Lavour">Lavour</Option>
                <Option value="Accountants">Accountants</Option>
                <Option value="AGM">AGM</Option>
                <Option value="GM">GM</Option>
                <Option value="Backend Developer">Backend Developer</Option>
                <Option value="Frontend Developer">Frontend Developer</Option>
                <Option value="Full Stack Developer">Full Stack Developer</Option>
                <Option value="Assistant Manager">Assistant Manager</Option>
                <Option value="Pion">Pion</Option>
                <Option value="Office Staff">Office Staff</Option>
              </Select>
              
              <Select
                placeholder="Status"
                style={{ width: 150 }}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
                allowClear
              >
                <Option value="Active">Active</Option>
                <Option value="On Leave">On Leave</Option>
              </Select>
              
              <Switch
                checkedChildren="Archived"
                unCheckedChildren="Active"
                checked={filters.archived}
                onChange={(checked) => handleFilterChange('archived', checked)}
              />
              

              {/* Table Option to grid or column */}
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
              
              <Button onClick={clearFilters} icon={<FilterOutlined />}>
                Clear Filters
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Card>
        {viewMode === 'table' ? (
          <Table
            columns={columns}
            dataSource={employees}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalEmployees,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} employees`,
              onChange: handlePaginationChange,
              onShowSizeChange: handlePaginationChange
            }}
            scroll={{ x: 1300 }}
            locale={{
              emptyText: (
                <Empty
                  description={
                    searchText || filters.department || filters.role || filters.status
                      ? "No employees match your search criteria"
                      : "No employees found"
                  }
                />
              )
            }}
          />
        ) : (
          <Spin spinning={loading}>
            <Row gutter={[16, 16]}>
              {employees.map(employee => (
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
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Spin>
        )}
      </Card>

      <Drawer
        title={selectedEmployee ? "Edit Employee" : "Add New Employee"}
        width={600}
        onClose={() => {
          setDrawerVisible(false);
          setSelectedEmployee(null);
          setFileList([]);
          setPreviewImage('');
          form.resetFields();
        }}
        open={drawerVisible}
        extra={
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={() => form.submit()}
            loading={loading}
          >
            {selectedEmployee ? 'Update' : 'Create'}
          </Button>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item label="Employee Photo">
            <div className="mb-4">
              {previewImage && (
                <div className="mb-4 relative">
                  <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<CloseOutlined />}
                    className="absolute -top-2 -right-2"
                    onClick={handleRemoveFile}
                  />
                </div>
              )}
              
              {!previewImage && (
                <Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag image to upload
                  </p>
                  <p className="ant-upload-hint">
                    Supports JPG, PNG up to 5MB
                  </p>
                </Dragger>
              )}
            </div>
          </Form.Item>

          <Form.Item
            label="Employee ID"
            name="employeeID"
            rules={[{ required: true, message: 'Please enter employee ID' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Department"
                name="department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select>
                  <Option value="Engineering">Engineering</Option>
                  <Option value="Marketing">Marketing</Option>
                  <Option value="Sales">Sales</Option>
                  <Option value="HR">HR</Option>
                  <Option value="IT">IT</Option>
                  <Option value="Transport">Transport</Option>
                  <Option value="Business">Business</Option>
                  <Option value="Account">Accounts</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: 'Please enter role' }]}
              >
                  <Select>
                  <Option value="GM">GM</Option>
                  <Option value="AGM">AGM</Option>
                  <Option value="Manager">Manager</Option>
                  <Option value="Assistant Manager">Assistant Manager</Option>
                  <Option value="Designer">Designer</Option>
                  <Option value="Developer">Developer</Option>
                  <Option value="Accountants">Accountants</Option>
                  <Option value="Pion">Pion</Option>
                  <Option value="Office Staff">Office Staff</Option>
                  <Option value="Backend Developer">Backend Developer</Option>
                  <Option value="Frontend Developer">Frontend Developer</Option>
                  <Option value="Full Stack Developer">Full Stack Developer</Option>
                </Select>
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
            ]}
            normalize={(value) => {
              const num = Number(value);
              if (isNaN(num)) return 70;
              if (num < 1) return 1;
              if (num > 100) return 100;
              return num;
            }}
          >
            <Input 
              type="number" 
              min={1} 
              max={100}
              placeholder="Enter score between 1-100"
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Employees;