import { Button, Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";
import { CSVLink } from "react-csv";
import ExportHlp from "../../Helpers/ExportHlp";

export default function RankingEquipos() {
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
    const cUrlRequest = "reporte/ranking-equipo-resultado?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);
    setstate(data);
    setLoading(false);
  };

  const columns = [
    { title: "Id.Temporada", dataIndex: "nTemporada", key: "nTemporada" },
    { title: "Equipo", dataIndex: "cEquipo", key: "cEquipo" },
    { title: "HCP Inicial", dataIndex: "nHCP_inicial", key: "nHCP_inicial" },
    { title: "HCP Equilibrio", dataIndex: "nHCP_equilibrio", key: "nHCP_equilibrio" },
    { title: "HCP Final", dataIndex: "nHCP_final", key: "nHCP_final" },
    { title: "Ranking", dataIndex: "nRanking", key: "nRanking" },
    { title: "Jugados", dataIndex: "nJugados", key: "nJugados" },
    { title: "Ganados", dataIndex: "nGanados", key: "nGanados" },
    { title: "Perdidos", dataIndex: "nPerdidos", key: "nPerdidos" },
    { title: "Goles Favor", dataIndex: "nGolesFavor", key: "nGolesFavor" },
    { title: "Goles Contra", dataIndex: "nGolesContra", key: "nGolesContra" },
    { title: "Dif. Goles", dataIndex: "nDifGol", key: "nDifGol" },
    { title: "Dif. Goles HCP", dataIndex: "nDifGolHCP", key: "nDifGolHCP" },
    { title: "Ganados HCP", dataIndex: "nGanadosHCP", key: "nGanadosHCP" },
    { title: "Empatados HCP", dataIndex: "nEmpatadosHCP", key: "nEmpatadosHCP" },
    { title: "Gan. Equilibrio", dataIndex: "nGanadosEquilibrio", key: "nGanadosEquilibrio" },
    { title: "Emp. Equilibrio", dataIndex: "nEmpatadosEquilibrio", key: "nEmpatadosEquilibrio" },
  ];

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
            }}
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
        <Table columns={columns} dataSource={state} rowKey="id" pagination={{ pageSize: 20 }} />
      )}
    </div>
  );
}
