import { Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function HcpPerformanceEquipo() {
  const [state, setstate] = useState([]);
  const [filtro] = useState({ fCategoria: "", fTemporada: "" });
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [categorias, setCategorias] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  useEffect(
    () => {
      getTemporadas();
      getCategorias();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getTemporadas = async () => {
    const { data } = await AxiosService.get("temporada", modal);
    if (!data) return;
    // Arma un par [value / label] con mas información
    const dataCb = data.reduce((acum, curr) => {
      acum.push({ value: curr.pTemporada, label: curr.nTemporada + " " + curr.cDescripcion });
      return acum;
    }, []);
    setTemporadas(dataCb);
  };

  const getCategorias = async () => {
    const { data } = await AxiosService.get("categoria", modal);
    if (!data) return;
    setCategorias(data);
  };

  const getData = async () => {
    console.log(filtro);
    if (filtro.fTemporada === "" || filtro.fCategoria === "") return;
    setLoading(true);
    const cUrlRequest = "reporte/performance-equipo?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    setstate(data);
    setLoading(false);
  };

  const columns = [
    { title: "Temporada", dataIndex: "nTemporada", key: "nTemporada" },
    { title: "ftemporada", dataIndex: "fTemporada", key: "fTemporada" },
    { title: "fCategoria", dataIndex: "fCategoria", key: "fCategoria" },
    { title: "Equipo", dataIndex: "cEquipo", key: "cEquipo" },
    { title: "fequipo", dataIndex: "fEquipo", key: "fEquipo" },
    { title: "Handicap_Inicial", dataIndex: "nHCP_Inicial", key: "nHCP_Inicial" },
    { title: "Handicap_Final", dataIndex: "nHCP_Final", key: "nHCP_Final" },
    { title: "Variacion_Final", dataIndex: "nVariacion_Final", key: "nVariacion_Final" },
    { title: "Handicap_Performance", dataIndex: "nHCP_Performance", key: "nHCP_Performance" },
    { title: "Variacion_Performance", dataIndex: "nHCP_Performance", key: "nHCP_Performance" },
    { title: "Handiicap_Equilibrio", dataIndex: "nHCP_Equilibrio", key: "nHCP_Equilibrio" },
    { title: "Variacion_Equilibrio", dataIndex: "nVariacion_Equilibrio", key: "nVariacion_Equilibrio" },
    { title: "Ranking", dataIndex: "nRanking", key: "nRanking" },
    { title: "Jugados", dataIndex: "nJugados", key: "nJugados" },
    { title: "Ganados", dataIndex: "nGanados", key: "nGanados" },
    { title: "Perdidos", dataIndex: "nPerdidos", key: "nPerdidos" },
    { title: "Goles_Favor", dataIndex: "nGolesFavor", key: "nGolesFavor" },
    { title: "Goles_Contra", dataIndex: "nGolesContra", key: "nGolesContra" },
    { title: "Dif_Gol", dataIndex: "nDiferenciaGol", key: "nDiferenciaGol" },
    { title: "Ganados_hcp", dataIndex: "nGanadosHCP", key: "nGanadosHCP" },
    { title: "Empatados_hcp", dataIndex: "nEmpatadosHCP", key: "nEmpatadosHCP" },
  ];

  return (
    <div>
      <h2 className="centered">HCP por Perfomance por Equipo</h2>

      <Flex justify="space-between" style={{ padding: 20 }}>
        <Space>
          Categoría
          <Select
            label="Categoría"
            options={categorias}
            defaultValue=""
            onChange={(v) => {
              filtro.fCategoria = v;
              getData();
            }}
            fieldNames={{ label: "cDescripcion", value: "pCategoria" }}
            style={{ width: "240px" }}
          ></Select>
        </Space>
        <Space>
          Temporadas
          <Select
            label="Temporadas"
            options={temporadas}
            defaultValue=""
            onChange={(v) => {
              filtro.fTemporada = v;
              getData();
            }}
            // fieldNames={{ label: "Descripcion", value: "pTemporada" }}
            style={{ width: "240px" }}
          ></Select>
        </Space>
      </Flex>

      {contextHolder}
      {loading ? (
        "Cargando ..."
      ) : (
        <Table columns={columns} dataSource={state} rowKey="id" pagination={{ pageSize: 20 }} />
      )}
    </div>
  );
}
