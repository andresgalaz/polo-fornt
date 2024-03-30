import { Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function RankingJugadores() {
  const [state, setstate] = useState([]);
  const [filtro] = useState({ pCategoria: "", pTemporada: "" });
  const [loading, setloading] = useState(true);
  const [modal, contextHolder] = Modal.useModal();
  const [categorias, setCategorias] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  // const apiServer = process.env.REACT_APP_API_SERVER + "reporte/ranking-jugadores";

  useEffect(
    () => {
      getData();
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
    dataCb.unshift({ value: "", label: "Todas" });
    setTemporadas(dataCb);
  };

  const getCategorias = async () => {
    const { data } = await AxiosService.get("categoria", modal);
    if (!data) return;
    // const data = (await axios.get(process.env.REACT_APP_API_SERVER + "categoria")).data;
    data.unshift({ pCategoria: "", cDescripcion: "Todas" });
    setCategorias(data);
  };

  const getData = async () => {
    await getTemporadas();
    await getCategorias();

    const cUrlRequest = "reporte/ranking-jugadores?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal, () => {
      setloading(false);
    });
    setstate(data);
  };

  const columns = [
    { title: "Id.Temporada", dataIndex: "id_temporada", key: "id_temporada" },
    { title: "Temporada", dataIndex: "temporada", key: "temporada" },
    { title: "Equipo", dataIndex: "equipo", key: "equipo" },
    { title: "Categoria", dataIndex: "categoria", key: "categoria" },
    { title: "Jugador", dataIndex: "jugador", key: "jugador" },
    { title: "Puntos", dataIndex: "puntos", key: "puntos" },
  ];

  return (
    <div>
      <h2 className="centered">Ranking de Jugadores</h2>

      <Flex justify="space-between">
        <Space>
          Categoría
          <Select
            label="Categoría"
            options={categorias}
            defaultValue=""
            onChange={(v) => {
              filtro.pCategoria = v;
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
              filtro.pTemporada = v;
              getData();
            }}
            // fieldNames={{ label: "Descripcion", value: "pTemporada" }}
            style={{ width: "240px" }}
          ></Select>
        </Space>
      </Flex>

      {contextHolder}
      {loading ? "Loading ..." : <Table columns={columns} dataSource={state} rowKey="id" />}
    </div>
  );
}
