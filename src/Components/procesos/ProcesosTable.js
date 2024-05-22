import { Alert, Button, Flex, Modal, Select, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function ProcesosTable() {
  const [categorias, setCategorias] = useState([]);
  const [filtro] = useState({ fCategoria: "", fTemporada: "" });
  const [modal, contextHolder] = Modal.useModal();
  const [procesando, setProcesando] = useState(false);
  const [stateDesvio, setStateDesvio] = useState([]);
  const [statePromedio, setStatePromedio] = useState([]);
  const [temporadas, setTemporadas] = useState([]);

  useEffect(
    () => {
      getTemporadas();
      getCategorias();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const calcularPerformance = async () => {
    if (filtro.fCategoria === "" || filtro.fTemporada === "") {
      modal.warning({
        title: "Procesos",
        content: <>Debe indicar Categoría y Temporada</>,
      });
      return;
    }
    const cUrlRequest = "proceso/calcular-performance?" + new URLSearchParams(filtro).toString();
    setProcesando(true);
    await AxiosService.put(
      cUrlRequest,
      null,
      modal,
      () => {
        getDesviacion();
        getPromedio();
      },
      true
    );
    setProcesando(false);
  };

  const colsDesvio = [
    { title: "Categoria", dataIndex: "cCategoria", key: "cCategoria" },
    { title: "Puntos", dataIndex: "nPuntos", key: "nPuntos" },
  ];

  const colsPromedio = [
    { title: "Id.Equipo", dataIndex: "fEquipo", key: "fEquipo" },
    { title: "Equipo", dataIndex: "cEquipo", key: "cEquipo" },
    { title: "Jugados", dataIndex: "nJugados", key: "nJugados" },
    { title: "Puntos", dataIndex: "nPuntos", key: "nPuntos" },
  ];

  const getDesviacion = async () => {
    if (filtro.fTemporada === "") return;
    const cUrlRequest = "proceso/desviacion?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest);
    setStateDesvio(data);
  };

  const getPromedio = async () => {
    if (filtro.fCategoria === "" || filtro.fTemporada === "") return;
    const cUrlRequest = "proceso/promedio?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest);
    setStatePromedio(data);
  };

  const getTemporadas = async () => {
    const { data } = await AxiosService.get("temporada", modal);
    if (!data) return;
    // Arma un par [value / label] con mas información
    const dataCb = data.reduce((acum, curr) => {
      acum.push({ value: curr.pTemporada, label: curr.nTemporada + " " + curr.cDescripcion });
      return acum;
    }, []);
    // dataCb.unshift({ value: "", label: "Todas" });
    setTemporadas(dataCb);
  };

  const getCategorias = async () => {
    const { data } = await AxiosService.get("categoria", modal);
    if (!data) return;
    // data.unshift({ pCategoria: "", cDescripcion: "Todas" });
    setCategorias(data);
  };

  const iterarEscenarios = async () => {
    if (filtro.fCategoria === "" || filtro.fTemporada === "") {
      modal.warning({
        title: "Procesos",
        content: <>Debe indicar Categoría y Temporada</>,
      });
      return;
    }
    const cUrlRequest = "proceso/iterar-escenarios?" + new URLSearchParams(filtro).toString();
    setProcesando(true);
    await AxiosService.put(
      cUrlRequest,
      null,
      modal,
      () => {
        getDesviacion();
        getPromedio();
      },
      true
    );
    setProcesando(false);
  };

  return (
    <div>
      <h2>Procesos</h2>
      <Flex justify="space-between" style={{ padding: 20 }}>
        <Space>
          Categoría
          <Select
            label="Categoría"
            options={categorias}
            onChange={(v) => {
              filtro.fCategoria = v;
              getDesviacion();
              getPromedio();
            }}
            fieldNames={{ label: "cDescripcion", value: "pCategoria" }}
            style={{ width: "220px" }}
            disabled={procesando}
          ></Select>
        </Space>
        <Space>
          Temporadas
          <Select
            label="Temporada"
            options={temporadas}
            onChange={(v) => {
              filtro.fTemporada = v;
              getDesviacion();
              getPromedio();
            }}
            style={{ width: "300px" }}
            disabled={procesando}
          ></Select>
        </Space>
        <Space>
          <Button type="primary" onClick={iterarEscenarios} disabled={procesando}>
            Iterar Escenarios
          </Button>
        </Space>
        <Space>
          <Button type="primary" onClick={calcularPerformance} disabled={procesando}>
            Calcular Performance
          </Button>
        </Space>
      </Flex>
      {contextHolder}
      {procesando ? (
        <Spin tip="Procesando ... este puede tomar un par de minutos" size="large" style={{ paddingTop: 300 }}>
          <Alert></Alert>
        </Spin>
      ) : (
        <div>
          <Table
            columns={colsDesvio}
            dataSource={stateDesvio}
            // className="time-table-row-select"
            rowKey="fCategoria"
            // rowClassName={"custom-row"}
          />
          <Table
            columns={colsPromedio}
            dataSource={statePromedio}
            // className="time-table-row-select"
            rowKey="fEquipo"
            // rowClassName={"custom-row"}
          />
        </div>
      )}
    </div>
  );
}
