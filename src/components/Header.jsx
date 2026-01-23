import { Layout, Typography, Avatar, Badge, Dropdown, Space, Button } from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  LoginOutlined,
  IdcardOutlined,
  TeamOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import AdminStore from "../store/AdminStore";

const { Header: AntHeader } = Layout;
const { Title, Text } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const { isAdmin, UserLogoutRequest } = AdminStore();
  const adminStatus = isAdmin();
  const userName = adminStatus ? "Admin User" : "Guest";

  const handleLogout = async () => {
    await UserLogoutRequest();
    sessionStorage.clear();
    localStorage.clear();
    navigate("/");
  };

  // Menu items for logged-in admin ONLY
  const adminMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "dashboard",
      icon: <TeamOutlined />,
      label: (
        <Link to="/dashboard" className="text-inherit hover:text-inherit">
          Dashboard
        </Link>
      ),
    },
    {
      key: "employees",
      icon: <IdcardOutlined />,
      label: (
        <Link to="/employees" className="text-inherit hover:text-inherit">
          Employees Table
        </Link>
      ),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: (
        <Link to="/settings" className="text-inherit hover:text-inherit">
          Settings
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  const notificationItems = [
    {
      key: "1",
      label: "New employee added: John Doe",
    },
    {
      key: "2",
      label: "Performance review scheduled",
    },
    {
      key: "3",
      label: "System maintenance tomorrow",
    },
  ];

  return (
    <AntHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg sticky top-0 z-50 px-6 h-16 flex items-center">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        {/* Left: Logo and Title */}
        <div className="flex items-center space-x-3">
          <div 
            className="p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors" 
            onClick={() => navigate("/")}
          >
            <DashboardOutlined className="text-white text-2xl" />
          </div>
          <div 
            className="flex flex-col cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Title level={3} className="!text-white !m-0 !font-bold">
              Admin Dashboard
            </Title>
            <Text className="text-gray-300 text-xs font-light">
              Employee Management Portal
            </Text>
          </div>
        </div>

        {/* Right: Notifications and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications (only for admin) */}
          {adminStatus && (
            <>
              <Dropdown
                menu={{ items: notificationItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <div className="relative cursor-pointer">
                  <Badge
                    count={3}
                    size="small"
                    className="bg-red-500 border-white border"
                    style={{ top: -5, right: -5 }}
                  >
                    <div className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200">
                      <BellOutlined className="text-white text-xl" />
                    </div>
                  </Badge>
                </div>
              </Dropdown>

              {/* Divider */}
              <div className="h-8 w-px bg-white/30"></div>
            </>
          )}

          {/* User Profile Dropdown (ONLY for admin) */}
          {adminStatus ? (
            <Dropdown
              menu={{ items: adminMenuItems }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200">
                <Avatar
                  size="default"
                  icon={<UserOutlined />}
                  className="bg-gradient-to-br from-blue-400 to-indigo-500 shadow-md border-2 border-white/50"
                />
                <div className="flex flex-col items-start">
                  <span className="text-white font-semibold text-sm">
                    {userName}
                  </span>
                  <span className="text-blue-100 text-xs">
                    Administrator
                  </span>
                </div>
              </div>
            </Dropdown>
          ) : (
            // Simple login button for guests
            <Button
              type="primary"
              icon={<LoginOutlined />}
              size="middle"
              onClick={() => navigate("/signin")}
            >
              Admin Login
            </Button>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header;