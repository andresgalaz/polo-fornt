import { Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function ResultadoPartidos() {
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
    console.log(filtro);
    setLoading(true);
    const cUrlRequest = "reporte/resultado-partidos?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    setstate(data);
    setLoading(false);
  };

  const columns = [
    { title: "Id. Temporada", dataIndex: "fTemporada", key: "fTemporada" },
    { title: "Id. Abierto", dataIndex: "fAbierto", key: "fAbierto" },
    { title: "Id. Equipo 1", dataIndex: "fEquipo1", key: "fEquipo1" },
    { title: "Equipo 1", dataIndex: "cEquipo1", key: "cEquipo1" },
    { title: "Handicap 1", dataIndex: "nHandicap1", key: "nHandicap1" },
    { title: "Goles 1", dataIndex: "nGoles1", key: "nGoles1" },
    { title: "Id. Equipo 2", dataIndex: "fEquipo2", key: "fEquipo2" },
    { title: "Equipo 2", dataIndex: "cEquipo2", key: "cEquipo2" },
    { title: "Handicap 2", dataIndex: "nHandicap2", key: "nHandicap2" },
    { title: "Goles 2", dataIndex: "nGoles2", key: "nGoles2" },
    { title: "Ganador Abierto", dataIndex: "cGanadorAbierto", key: "cGanadorAbierto" },
    { title: "Ganador Handicap Inicial", dataIndex: "nGanadorHCP_inicial", key: "nGanadorHCP_inicial" },
    { title: "Ganador Handicap Equilibrio", dataIndex: "nGanadorHCP_equilibrio", key: "nGanadorHCP_equilibrio" },
    { title: "Ganador Abierto Base", dataIndex: "nGanadorAbiertoBase", key: "nGanadorAbiertoBase" },
    { title: "Ganador Handicap Base", dataIndex: "nGanadorHCP_base", key: "nGanadorHCP_base" },
  ];

  return (
    <div>
      <h2 className="centered">Resultados de los Partidos</h2>

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
