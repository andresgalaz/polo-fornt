import React, { useState } from "react";
import {
  ContainerOutlined,
  DatabaseOutlined,
  DeliveredProcedureOutlined,
  FormOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Button, theme, ConfigProvider } from "antd";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";

import HomePage from "./Components/HomePage";
import AcercaDe from "./Components/AcercaDe";

import AbiertosAbm from "./Components/ABM/AbiertosAbm";
import CategoriaAbm from "./Components/ABM/CategoriaAbm";
import EquipoAbm from "./Components/ABM/EquipoAbm";
import FormacionAbm from "./Components/ABM/FormacionAbm";
import JugadorAbm from "./Components/ABM/JugadorAbm";
import PaisAbm from "./Components/ABM/PaisAbm";
import PartidoAbm from "./Components/ABM/PartidoAbm";
import PuntajeAbm from "./Components/ABM/PuntajeAbm";
import TemporadaAbm from "./Components/ABM/TemporadaAbm";
import FormacionTemporadas from "./Components/reportes/FormacionTemporadas";
import HcpPerformanceEquipo from "./Components/reportes/HcpPerformanceEquipo";
import HcpPerformanceJugador from "./Components/reportes/HcpPerformanceJugador";
import HcpVariacionJugadores from "./Components/reportes/HcpVariacionJugadores";
import RankingEquipos from "./Components/reportes/RankingEquipos";
import RankingJugadores from "./Components/reportes/RankingJugadores";
import ResultadoPartidos from "./Components/reportes/ResultadoPartidos";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  let navigate = useNavigate();
  const selectedKey = useLocation().pathname;

  const highlight = () => {
    if (selectedKey.substring(0, 1) === "/") return selectedKey.substring(1);
  };

  return (
    <ConfigProvider
      theme={{
        // algorithm: theme.defaultAlgorithm,
        // type: "dark",
        token: {
          size: "large",
          borderRadius: 2,
        },
      }}
    >
      <Layout>
        <Layout>
          <Header style={{ color: colorBgContainer, textAlign: "center" }}>
            <h2 style={{ margin: 0 }}>Polo Handicap</h2>
          </Header>
        </Layout>
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed} width={290} style={{ minHeight: "100vh" }}>
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
                  icon: <DatabaseOutlined />,
                  label: "ABM",
                  children: [
                    {
                      key: "pais-abm",
                      icon: <FormOutlined />,
                      label: "Paises",
                      onClick: () => {
                        navigate("/pais-abm");
                      },
                    },
                    {
                      key: "temporada-abm",
                      icon: <FormOutlined />,
                      label: "Temporadas",
                      onClick: () => {
                        navigate("/temporada-abm");
                      },
                    },
                    {
                      key: "categoria-abm",
                      icon: <FormOutlined />,
                      label: "Categorias",
                      onClick: () => {
                        navigate("/categoria-abm");
                      },
                    },
                    {
                      key: "abiertos-abm",
                      icon: <FormOutlined />,
                      label: "Abiertos",
                      onClick: () => {
                        navigate("/abiertos-abm");
                      },
                    },
                    {
                      key: "puntaje-abm",
                      icon: <FormOutlined />,
                      label: "Puntaje",
                      onClick: () => {
                        navigate("/puntaje-abm");
                      },
                    },
                    {
                      key: "equipo-abm",
                      icon: <FormOutlined />,
                      label: "Equipos",
                      onClick: () => {
                        navigate("/equipo-abm");
                      },
                    },
                    {
                      key: "jugador-abm",
                      icon: <FormOutlined />,
                      label: "Jugadores",
                      onClick: () => {
                        navigate("/jugador-abm");
                      },
                    },
                    {
                      key: "formacion-abm",
                      icon: <FormOutlined />,
                      label: "Formaciones",
                      onClick: () => {
                        navigate("/formacion-abm");
                      },
                    },
                    {
                      key: "partidos-abm",
                      icon: <FormOutlined />,
                      label: "Partidos",
                      onClick: () => {
                        navigate("/partidos-abm");
                      },
                    },
                  ],
                },
                { key: "PROCEDOS", icon: <SettingOutlined />, label: "Procesos" },
                {
                  key: "REPORTE-MENU",
                  icon: <ContainerOutlined />,
                  label: "Reportes",
                  children: [
                    {
                      key: "ranking-equipos",
                      icon: <DeliveredProcedureOutlined />,
                      label: "Ranking Equipos y Resultados",
                      onClick: () => {
                        navigate("/ranking-equipos");
                      },
                    },
                    {
                      key: "ranking-jugadores",
                      icon: <DeliveredProcedureOutlined />,
                      label: "Ranking Jugadores",
                      onClick: () => {
                        navigate("/ranking-jugadores");
                      },
                    },
                    {
                      key: "hcp-equipo",
                      icon: <DeliveredProcedureOutlined />,
                      label: "HCP Performance Equipo",
                      onClick: () => {
                        navigate("/hcp-equipo");
                      },
                    },
                    {
                      key: "hcp-performance-jugador",
                      icon: <DeliveredProcedureOutlined />,
                      label: "HCP Performance Jugador",
                      onClick: () => {
                        navigate("/hcp-performance-jugador");
                      },
                    },
                    {
                      key: "hcp-variacion-jugador",
                      icon: <DeliveredProcedureOutlined />,
                      label: "HCP Variacion Jugador",
                      onClick: () => {
                        navigate("/hcp-variacion-jugador");
                      },
                    },
                    {
                      key: "formacion-temporadas",
                      icon: <DeliveredProcedureOutlined />,
                      label: "Formación Temporadas",
                      onClick: () => {
                        navigate("/formacion-temporadas");
                      },
                    },
                    {
                      key: "resultado-partidos",
                      icon: <DeliveredProcedureOutlined />,
                      label: "Resultado Partidos",
                      onClick: () => {
                        navigate("/resultado-partidos");
                      },
                    },
                  ],
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
              <Route exact path="/" element={<HomePage />} />
              <Route path="/abiertos-abm" element={<AbiertosAbm />} />
              <Route path="/acerca-de" element={<AcercaDe />} />
              <Route path="/categoria-abm" element={<CategoriaAbm />} />
              <Route path="/equipo-abm" element={<EquipoAbm />} />
              <Route path="/formacion-abm" element={<FormacionAbm />} />
              <Route path="/formacion-temporadas" element={<FormacionTemporadas />} />
              <Route path="/hcp-equipo" element={<HcpPerformanceEquipo />} />
              <Route path="/hcp-performance-jugador" element={<HcpPerformanceJugador />} />
              <Route path="/hcp-variacion-jugador" element={<HcpVariacionJugadores />} />
              <Route path="/jugador-abm" element={<JugadorAbm />} />
              <Route path="/pais-abm" element={<PaisAbm />} />
              <Route path="/partidos-abm" element={<PartidoAbm />} />
              <Route path="/puntaje-abm" element={<PuntajeAbm />} />
              <Route path="/resultado-partidos" element={<ResultadoPartidos />} />
              <Route path="/ranking-equipos" element={<RankingEquipos />} />
              <Route path="/ranking-jugadores" element={<RankingJugadores />} />
              <Route path="/temporada-abm" element={<TemporadaAbm />} />
            </Routes>
          </Content>{" "}
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
