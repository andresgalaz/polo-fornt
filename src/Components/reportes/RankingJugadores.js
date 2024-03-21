import { Flex, Modal, Select, Space, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function RankingJugadores() {
  const [state, setstate] = useState([]);
  const [filtro] = useState({ pCategoria: "", pTemporada: "" });
  const [loading, setloading] = useState(true);
  const [modal, contextHolder] = Modal.useModal();
  const [categorias, setCategorias] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const apiServer = process.env.REACT_APP_API_SERVER + "reporte/ranking-jugadores";

  useEffect(
    () => {
      getData();
      async function getTemporadas() {
        try {
          const data = (await axios.get(process.env.REACT_APP_API_SERVER + "temporada")).data;
          // Rama un par value / label con mas información
          const dataCb = data.reduce((acum, curr) => {
            acum.push({ value: curr.pTemporada, label: curr.nTemporada + " " + curr.cDescripcion });
            return acum;
          }, []);
          dataCb.unshift({ value: "", label: "Todas" });
          setTemporadas(dataCb);
        } catch (e) {
          let msg = e.response.data;
          if (e.code !== "ERROR_BAD_REQUEST") {
            console.error(msg);
            msg = "Error inesperado en el servidor";
          }
          modal.error({
            title: "Mensaje del Servidor",
            content: <>{msg}</>,
          });
        }
      }
      getTemporadas();

      async function getCategorias() {
        try {
          const data = (await axios.get(process.env.REACT_APP_API_SERVER + "categoria")).data;
          data.unshift({ pCategoria: "", cDescripcion: "Todas" });
          setCategorias(data);
        } catch (e) {
          let msg = e.response.data;
          if (e.code !== "ERROR_BAD_REQUEST") {
            console.error(msg);
            msg = "Error inesperado en el servidor";
          }
          modal.error({
            title: "Mensaje del Servidor",
            content: <>{msg}</>,
          });
        }
      }
      getCategorias();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getData = async () => {
    try {
      setloading(false);
      const cUrlRequest = apiServer + "?" + new URLSearchParams(filtro).toString();
      console.log(cUrlRequest);
      const res = await axios.get(cUrlRequest);
      setstate(res.data);
    } catch (e) {
      let msg = e.response.data;
      if (e.code !== "ERROR_BAD_REQUEST") {
        console.error(msg);
        msg = "Error inesperado en el servidor";
      }
      modal.error({
        title: "Mensaje del Servidor",
        content: <>{msg}</>,
      });
    }
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
      {loading ? "Loading ..." : <Table columns={columns} dataSource={state} />}
    </div>
  );
}
