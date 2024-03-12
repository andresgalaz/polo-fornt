import React from "react";
// import "./Sidebar.css";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";

function SidebarMenu(props) {
  return (
    <Layout>
      <Sider>
        <Menu mode="inline" width={"20%"}>
          <Menu.Item key="h100">Home</Menu.Item>
          <Menu.Item key="a100">ABM</Menu.Item>
          <Menu.Item key="i100">Informes</Menu.Item>
          <Menu.Item key="p100">Procesos</Menu.Item>
        </Menu>
      </Sider>
    </Layout>
  );
}
export default SidebarMenu;
