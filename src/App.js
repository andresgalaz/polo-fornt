import React, { useState } from "react";
import {
  CaretRightOutlined,
  DeliveredProcedureOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme } from "antd";
import PaisTable from "./Components/PaisTable";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import TemporadaTable from "./Components/TemporadaTable";

const { Header, Sider, Content } = Layout;

const Page1 = () => {
  return <h4> Page 1</h4>;
};

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let navigate = useNavigate();
  const selectedKey = useLocation().pathname;
  const highlight = () => {
    if (selectedKey === "/") {
      return ["1"];
    } else if (selectedKey === "/pais-abm") {
      return ["2"];
    } else if (selectedKey === "/temporada-abm") {
      return ["3"];
    }
  };

  return (
    <Layout>
      <Layout>
        <Header style={{ color: colorBgContainer, textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>Polo Handicap</h2>
        </Header>
      </Layout>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <div className="demo-logo-vertical" />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              color: "white",
            }}
          ></Button>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={highlight()}
            defaultSelectedKeys={["ABM-MENU"]}
            items={[
              {
                key: "ABM-MENU",
                icon: <CaretRightOutlined />,
                label: "ABM",
                children: [
                  {
                    key: "PAIS_MENU",
                    icon: <FormOutlined />,
                    label: "Paises",
                    onClick: () => {
                      navigate("/pais-abm");
                    },
                  },
                  {
                    key: "TEMPORADA_MENU",
                    icon: <FormOutlined />,
                    label: "Temporadas",
                    onClick: () => {
                      navigate("/temporada-abm");
                    },
                  },
                ],
              },
              {
                key: "REPORTE-MENU",
                icon: <CaretRightOutlined />,
                label: "Reportes",
                children: [{ key: "EN_CONSTRUCCION", icon: <DeliveredProcedureOutlined />, label: "En construccion" }],
              },
            ]}
          />
        </Sider>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Routes>
            <Route exact path="/" element={<Page1 />} />
            <Route path="/pais-abm" element={<PaisTable />} />
            <Route path="/temporada-abm" element={<TemporadaTable />} />
          </Routes>
        </Content>{" "}
      </Layout>
    </Layout>
  );
};

export default App;
