// src/components/Footer.jsx
import React from 'react';
import { Layout, Typography, Divider } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className="bg-white border-t border-gray-200 py-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-3">
          {/* Copyright */}
          <Text className="text-gray-600 text-sm mb-2 md:mb-0">
            © {currentYear} Admin Dashboard. All rights reserved.
          </Text>
          
          {/* Links */}
          <div className="flex space-x-4">
            <Link 
              href="#" 
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="#" 
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              Terms
            </Link>
            <Link 
              href="#" 
              className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              Help
            </Link>
          </div>
        </div>

        {/* Divider */}
        <Divider className="!my-3" />

        {/* Bottom Section */}
        <div className="text-center">
          <Text className="text-gray-400 text-xs">
            Employee Management System • v1.0.0
          </Text>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;