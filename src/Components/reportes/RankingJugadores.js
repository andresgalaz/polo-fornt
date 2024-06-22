import { Button, Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";
import { CSVLink } from "react-csv";
import ExportHlp from "../../Helpers/ExportHlp";

export default function RankingJugadores() {
  const [state, setstate] = useState([]);
  const [filtro] = useState({ fTemporada: "" });
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [temporadas, setTemporadas] = useState([]);
  useEffect(
    () => {
      getTemporadas();
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

  const getData = async () => {
    if (filtro.fTemporada === "") return;
    setLoading(true);
    const cUrlRequest = "reporte/ranking-jugadores?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    setstate(data);
    setLoading(false);
  };

  const columns = [
    { title: "Id.Temporada", dataIndex: "nTemporada", key: "id_temporada" },
    { title: "Temporada", dataIndex: "cTemporada", key: "temporada" },
    { title: "Equipo", dataIndex: "cEquipo", key: "equipo" },
    // { title: "Categoria", dataIndex: "cTpCategoria", key: "categoria" },
    { title: "Jugador", dataIndex: "cJugador", key: "jugador" },
    { title: "Puntos", dataIndex: "nPuntos", key: "puntos" },
  ];

  return (
    <div>
      <h2 className="centered">Ranking de Jugadores</h2>

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
              filename={`ranking-jugadores${ExportHlp.fecha()}.csv`}
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
