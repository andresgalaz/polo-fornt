import { Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function HcpPerformanceJugador() {
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
    if (filtro.fTemporada === "" || filtro.fCategoria === "") return;
    setLoading(true);
    const cUrlRequest = "reporte/performance-jugador?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    setstate(data);
    setLoading(false);
  };

  const columns = [
    { title: "Id. Temporada", dataIndex: "fTemporada", key: "fTemporada" },
    { title: "Temporada", dataIndex: "nTemporada", key: "nTemporada" },
    { title: "Id. Categoria", dataIndex: "fCategoria", key: "fCategoria" },
    { title: "Id. Jugador", dataIndex: "fJugador", key: "fJugador" },
    { title: "Jugador", dataIndex: "cJugador", key: "cJugador" },
    { title: "Torneo Patron", dataIndex: "bPatron", key: "bPatron" },
    { title: "Id. Equipo", dataIndex: "fEquipo", key: "fEquipo" },
    { title: "Equipo", dataIndex: "cEquipo", key: "cEquipo" },
    { title: "Posición", dataIndex: "nPosicion", key: "nPosicion" },
    { title: "HCP Inicial", dataIndex: "nHCP_inicial", key: "nHCP_inicial" },
    { title: "HCP Final", dataIndex: "nHCP_final", key: "nHCP_final" },
    { title: "Var. Final", dataIndex: "nVarFinal", key: "nVarFinal" },
    { title: "HCP Performance", dataIndex: "nHCP_Performance", key: "nHCP_Performance" },
    { title: "Var. Performance", dataIndex: "nVarPerformance", key: "nVarPerformance" },
    { title: "Puntaje Total Ponderado", dataIndex: "nPuntajeTotalPond", key: "nPuntajeTotalPond" },
    { title: "Ataques Penales Goles", dataIndex: "nAtaquesPenalesGoles", key: "nAtaquesPenalesGoles" },
    { title: "Pases", dataIndex: "nPases", key: "nPases" },
    { title: "Perdidas Recuperos Throwins", dataIndex: "nPerdidaRecuperoThrowin", key: "nPerdidaRecuperoThrowin" },
    { title: "Fouls Netos", dataIndex: "nFoulsNeto", key: "nFoulsNeto" },
    { title: "Overall Efficiency", dataIndex: "nOverallEfficiency", key: "nOverallEfficiency" },
    { title: "Partidos Jugados", dataIndex: "nPartidosJugados", key: "nPartidosJugados" },
    { title: "Ranking", dataIndex: "nRanking", key: "nRanking" },
    { title: "Jugados", dataIndex: "nJugados", key: "nJugados" },
    { title: "Ganados", dataIndex: "nGanados", key: "nGanados" },
    { title: "Perdidos", dataIndex: "nPerdidos", key: "nPerdidos" },
    { title: "Ganados HCP", dataIndex: "nGanadosHCP", key: "nGanadosHCP" },
    { title: "Empatados HCP", dataIndex: "nEmpatadosHCP", key: "nEmpatadosHCP" },
  ];

  return (
    <div>
      <h2 className="centered">HCP por Perfomance por Jugador</h2>

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
