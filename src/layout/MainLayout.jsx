// src/components/layout/MainLayout.jsx
import React from 'react';
import { Layout } from 'antd';
import CustomHeader from "../components/Header";
import CustomFooter from '../components/Footer';

const { Content } = Layout;

const MainLayout = ({ children }) => {
  return (
    <Layout className="min-h-screen flex flex-col">
      <CustomHeader />
      <Content className="flex-1 bg-gray-50 p-0">
        <div className="p-4 md:p-6">
          {children}
        </div>
      </Content>
      <CustomFooter />
    </Layout>
  );
};

export default MainLayout;