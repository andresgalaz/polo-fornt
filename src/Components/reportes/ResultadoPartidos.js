import { Button, Flex, Input, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";
import { CSVLink } from "react-csv";
import ExportHlp from "../../Helpers/ExportHlp";

let partidosData;
export default function ResultadoPartidos() {
  const [filtro] = useState({ fCategoria: "", fTemporada: "", fAbierto: "", cEquipo: "" });
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [abiertos, setAbiertos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [state, setState] = useState([]);

  useEffect(
    () => {
      getAbiertos();
      getTemporadas();
      getCategorias();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getAbiertos = async () => {
    const { data } = await AxiosService.get("abierto", modal);
    if (!data) return;
    setAbiertos(data);
  };

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
    const cUrlRequest = "reporte/resultado-partidos?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    partidosData = data;
    searchTable();
    // setstate(data);
    setLoading(false);
  };

  const searchTable = () => {
    const searchKey = filtro.cEquipo;
    var data = partidosData.filter((rec) => {
      return (
        rec["cEquipo1"].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase()) ||
        rec["cEquipo2"].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase())
      );
    });
    setState(data);
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
        <Space>
          Abierto
          <Select
            label="Abierto"
            options={abiertos}
            defaultValue=""
            onChange={(v) => {
              filtro.fAbierto = v;
              getData();
            }}
            fieldNames={{ label: "cNombre", value: "pAbierto" }}
            style={{ width: "220px" }}
          ></Select>
        </Space>
        <Space>
          Equipo
          <Input
            placeholder="busca equipos"
            style={{ width: "200px" }}
            onChange={(e) => {
              filtro.cEquipo = e.target.value;
              searchTable();
            }}
          />
        </Space>

        {!state || state.length === 0 || loading ? (
          ""
        ) : (
          <Space>
            <CSVLink
              data={state}
              headers={ExportHlp.tableColumn2CvsHeader(columns)}
              filename={`resultado-partidos-${ExportHlp.fecha()}.csv`}
              target="_blank"
            >
              <Button type="primary">Exportar</Button>
            </CSVLink>
          </Space>
        )}
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
