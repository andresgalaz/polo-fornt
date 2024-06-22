import { Button, Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";
import { CSVLink } from "react-csv";
import ExportHlp from "../../Helpers/ExportHlp";

export default function FormacionTemporadas() {
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
    const cUrlRequest = "reporte/formacion-temporada?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    setstate(data);
    setLoading(false);
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
        {!state || state.length === 0 || loading ? (
          ""
        ) : (
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
