import { Button, Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";
import { CSVLink } from "react-csv";
import ExportHlp from "../../Helpers/ExportHlp";

export default function FormacionTemporadas() {
  const [originalData, setOriginalData] = useState([]); // Datos originales sin filtrar
  const [state, setstate] = useState([]);
  const [filtro] = useState({ fCategoria: "", fTemporada: "", fEquipo: "", fJugador: "" });
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [categorias, setCategorias] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [jugadores, setJugadores] = useState([]);


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

  const getEquipos = async (data) => {
    // Agregar filtro de temporada si es necesario
    const equiposData = [...new Set(data.map(item => ({ pEquipo: item.cEquipo, cNombre: item.cEquipo })))].sort((a, b) => a.cNombre.localeCompare(b.cNombre));
    if (!equiposData) return;
    // Arma un par [value / label] con mas información
    const dataCb = equiposData.reduce((acum, curr) => {
      if (!acum.find(item => item.value === curr.cNombre)) {
        acum.push({ value: curr.cNombre, label: curr.cNombre });
      }
      return acum;
    }, []);
    setEquipos(dataCb);
  }

  const getJugadores = async (data) => {
    // Agregar filtro de temporada si es necesario
    const jugadoresData = [...new Set(data.map(item => ({ pJugador: item.cJugador, cNombre: item.cJugador })))].sort((a, b) => a.cNombre.localeCompare(b.cNombre));
    if (!jugadoresData) return;
    // Arma un par [value / label] con mas información
    const dataCb = jugadoresData.reduce((acum, curr) => {
      acum.push({ value: curr.cNombre, label: curr.cNombre });
      return acum;
    }, []);
    setJugadores(dataCb);
  }

  const getData = async () => {
    if (filtro.fTemporada === "" || filtro.fCategoria === "") return;
    setLoading(true);
    const params = {
      fCategoria: filtro.fCategoria,
      fTemporada: filtro.fTemporada
    };
    const cUrlRequest = "reporte/formacion-temporada?" + new URLSearchParams(params).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    setOriginalData(data); // Guardar datos originales
    setstate(data);
    setLoading(false);
    getEquipos(data);
    getJugadores(data);
    // Limpiar filtros locales cuando se cargan nuevos datos
    filtro.fEquipo = "";
    filtro.fJugador = "";
  };

  const filterLocalData = () => {
    let filteredData = [...originalData];

    // Filtrar por equipo si está seleccionado
    if (filtro.fEquipo && filtro.fEquipo !== "") {
      filteredData = filteredData.filter(item => item.cEquipo === filtro.fEquipo);
    }

    // Filtrar por jugador si está seleccionado
    if (filtro.fJugador && filtro.fJugador !== "") {
      filteredData = filteredData.filter(item => item.cJugador === filtro.fJugador);
    }

    setstate(filteredData);
  };

  const columns = [
    { title: "Id. Temporada", dataIndex: "fTemporada", key: "fTemporada" },
    { title: "Id. Categoria", dataIndex: "fCategoria", key: "fCategoria" },
    { title: "Equipo", dataIndex: "cEquipo", key: "cEquipo" },
    { title: "Jugador", dataIndex: "cJugador", key: "cJugador" },
    { title: "Handicap Inicial", dataIndex: "nHCP_inicial", key: "nHCP_inicial" },
    { title: "Handicap Final", dataIndex: "nHCP_final", key: "nHCP_final" },
  ];

  return (
    <div>
      <h2 className="centered">Formaciones por Temporadas</h2>

      <Flex justify="space-between" style={{ padding: 20 }}>
        <Space>
          Categoría
          <Select
            label="Categoría"
            options={categorias}
            value={filtro.fCategoria || undefined}
            onChange={(v) => {
              filtro.fCategoria = v;
              // Limpiar filtros locales al cambiar categoría
              filtro.fEquipo = "";
              filtro.fJugador = "";
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
            value={filtro.fTemporada || undefined}
            onChange={(v) => {
              filtro.fTemporada = v;
              // Limpiar filtros locales al cambiar temporada
              filtro.fEquipo = "";
              filtro.fJugador = "";
              getData();
            }}
            // fieldNames={{ label: "Descripcion", value: "pTemporada" }}
            style={{ width: "240px" }}
          ></Select>
        </Space>
      </Flex>

      <Flex justify="space-between" style={{ padding: 20 }}>
        <Space>
          Equipos
          <Select
            label="Equipos"
            options={equipos}
            value={filtro.fEquipo || undefined}
            onChange={(v) => {
              filtro.fEquipo = v || "";
              filterLocalData();
            }}
            style={{ width: "240px" }}
            allowClear
            placeholder="Seleccionar equipo"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        </Space>
        <Space>
          Jugadores
          <Select
            label="Jugadores"
            options={jugadores}
            value={filtro.fJugador || undefined}
            onChange={(v) => {
              filtro.fJugador = v || "";
              filterLocalData();
            }}
            style={{ width: "240px" }}
            allowClear
            placeholder="Seleccionar jugador"
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
          ></Select>
        </Space>
      </Flex>

      {!state || state.length === 0 || loading ? (
        ""
      ) : (
        <Flex justify="flex-end" style={{ padding: "0 20px 20px 20px" }}>

          <Space>
            <CSVLink
              data={state}
              headers={ExportHlp.tableColumn2CvsHeader(columns)}
              filename={`formacion-temporadas-${ExportHlp.fecha()}.csv`}
              target="_blank"
            >
              <Button type="primary">Exportar</Button>
            </CSVLink>
          </Space>
        </Flex>

      )}

      {contextHolder}
      {loading ? (
        "Cargando ..."
      ) : (
        <Table columns={columns} dataSource={state} rowKey="id" pagination={{ pageSize: 20 }} />
      )}
    </div>
  );
}
