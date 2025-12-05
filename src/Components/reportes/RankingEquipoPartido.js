import { Button, Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";
import { CSVLink } from "react-csv";
import ExportHlp from "../../Helpers/ExportHlp";

export default function RankingEquiposPartido() {
  const [state, setstate] = useState([]);
  const [filtro] = useState({ fTemporada: "" , fEquipo: "" });
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [temporadas, setTemporadas] = useState([]);
  const [equipos, setEquipos] = useState([]);

  useEffect(
    () => {
      getTemporadas();
      getEquipos();
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

  const getEquipos = async (fTemporadaSelected) => {
    // Agregar filtro de temporada si es necesario
    const { data } = await AxiosService.get("equipo?" + new URLSearchParams({fTemporada: fTemporadaSelected}).toString(), modal);
    if (!data) return;
    // Arma un par [value / label] con mas información
    const dataCb = data.reduce((acum, curr) => {
      acum.push({ value: curr.pEquipo, label: curr.cNombre });
      return acum;
    }, []);
    setEquipos(dataCb);
  }

  const getData = async () => {
    if (filtro.fTemporada === "") return;
    setLoading(true);
    const cUrlRequest = "reporte/ranking-equipo-partido?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    setstate(data);
    setLoading(false);
  };

const columns = [
    { title: "Id.Temporada", dataIndex: "nTemporada", key: "nTemporada", hidden: true },
    { title: "Abierto", dataIndex: "cAbierto", key: "cAbierto" },
    { title: "Partido", dataIndex: "nPartido", key: "nPartido" },
    { title: "Fecha", dataIndex: "dPartido", key: "dPartido" },
    { title: "Resultado", dataIndex: "cResultado", key: "cResultado" },
    { title: "Id.Equipo", dataIndex: "nEquipo", key: "nEquipo", hidden: true },
    { title: "Equipo", dataIndex: "cEquipo", key: "cEquipo" },
    { title: "Puntos", dataIndex: "nPuntos", key: "nPuntos", align: "right" },
];

const totalPuntos = state.reduce((sum, item) => sum + parseInt(item.nPuntos), 0);

return (
    <div>
        <h2 className="centered">Ranking Equipos y Resultados</h2>

        <Flex justify="space-between" style={{ padding: 20 }}>
            <Space>
                Temporadas
                <Select
                    label="Temporadas"
                    options={temporadas}
                    defaultValue=""
                    onChange={(v) => {
                        filtro.fTemporada = v;
                        getData();
                        getEquipos(v);
                        filtro.fEquipo = "";
                    }}
                    style={{ width: "240px" }}
                ></Select>
                </Space>
            <Space>
                Equipos
                <Select
                    label="Equipos"
                    options={equipos}
                    defaultValue=""
                    onChange={(v) => {
                        filtro.fEquipo = v;
                        getData();
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
            {!state || state.length === 0 || loading ? (
                ""
            ) : (
                <Space>
                    <CSVLink
                        data={state}
                        headers={ExportHlp.tableColumn2CvsHeader(columns)}
                        filename={`ranking-equipos${ExportHlp.fecha()}.csv`}
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
            <>
                <Table columns={columns} dataSource={state} rowKey="id" pagination={{ pageSize: 20 }} />
                {state && state.length > 0 && (
                    <div style={{ textAlign: 'right', padding: '10px 20px', fontWeight: 'bold' }}>
                        Total Puntos: {totalPuntos}
                    </div>
                )}
            </>
        )}
    </div>
);
}
