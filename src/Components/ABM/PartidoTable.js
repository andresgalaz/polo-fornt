import { Button, Flex, Input, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";
import { SelectOutlined } from "@ant-design/icons";

let partidosData;
export default function PartidoTable({ onOk }) {
  const [filtro] = useState({ pAbierto: "", pTemporada: "", cEquipo: "" });
  const [loading, setloading] = useState(true);
  const [modal, contextHolder] = Modal.useModal();
  const [abiertos, setAbiertos] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  const [state, setState] = useState([]);

  useEffect(
    () => {
      // getData();
      getTemporadas();
      getAbiertos();
      getData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filtro]
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

  const getAbiertos = async () => {
    const { data } = await AxiosService.get("abierto", modal);
    if (!data) return;
    // const data = (await axios.get(process.env.REACT_APP_API_SERVER + "abierto")).data;
    data.unshift({ pAbierto: "", cNombre: "Todos" });
    setAbiertos(data);
  };

  const searchTable = () => {
    const searchKey = filtro.cEquipo;
    var data = partidosData.filter(
      (rec) =>
        rec["cEquipo1"].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase()) ||
        rec["cEquipo2"].toLocaleLowerCase().includes(searchKey.toLocaleLowerCase())
    );
    setState(data);
  };

  const getData = async () => {
    const cUrlRequest = "partido?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal, () => {
      setloading(false);
    });
    partidosData = data;
    searchTable();
  };

  const seleccionar = (rec) => {
    onOk(rec);
  };

  const getFullDate = (f) => {
    if (!f) return "";
    // YYYY-MM-DD a DD/MM/YYYY
    const a = f.substr(0, 10).split("-");
    return `${a[2]}/${a[1]}/${a[0]}`;
  };

  const columns = [
    { title: "Id.", dataIndex: "pPartido", key: "pPartido" },
    { title: "Fecha", dataIndex: "dPartido", key: "dPartido", render: (fec) => getFullDate(fec) },
    { title: "Año", dataIndex: "nTemporada", key: "nTemporada" },
    { title: "Temporada", dataIndex: "cTemporada", key: "cTemporada" },
    { title: "Abierto", dataIndex: "cAbierto", key: "cAbierto" },
    { title: "Equipo 1", dataIndex: "cEquipo1", key: "cEquipo1" },
    { title: "Equipo 2", dataIndex: "cEquipo2", key: "cEquipo2" },
    {
      title: "Selección",
      key: "action",
      align: "center",
      render: (_, record) => {
        // No requiere onlick porque se está usando onRow->click
        return <Button icon={<SelectOutlined />}></Button>;
      },
    },
  ];

  return (
    <div>
      <div></div>
      <Flex justify="space-between" style={{ padding: 20 }}>
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
        <Space>
          Abierto
          <Select
            label="Abierto"
            options={abiertos}
            defaultValue=""
            onChange={(v) => {
              filtro.pAbierto = v;
              getData();
            }}
            fieldNames={{ label: "cNombre", value: "pAbierto" }}
            style={{ width: "220px" }}
          ></Select>
        </Space>
        <Space>
          Temporadas
          <Select
            label="Temporada"
            options={temporadas}
            defaultValue=""
            onChange={(v) => {
              filtro.pTemporada = v;
              getData();
            }}
            // fieldNames={{ label: "Descripcion", value: "pTemporada" }}
            style={{ width: "300px" }}
          ></Select>
        </Space>
      </Flex>
      {loading ? (
        "Cargando ..."
      ) : (
        <Table
          columns={columns}
          dataSource={state}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                seleccionar(record);
              },
            };
          }}
          rowKey="pPartido"
          className="time-table-row-select"
          rowClassName={"custom-row"}
        />
      )}
      {contextHolder}
    </div>
  );
}
