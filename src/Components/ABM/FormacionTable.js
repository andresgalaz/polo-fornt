import { Button, Flex, Modal, Select, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";
import { SelectOutlined } from "@ant-design/icons";

export default function FormacionTable({ onOk }) {
  const [state, setstate] = useState([]);
  const [filtro] = useState({ pCategoria: "", pTemporada: "" });
  const [loading, setloading] = useState(true);
  const [modal, contextHolder] = Modal.useModal();
  const [categorias, setCategorias] = useState([]);
  const [temporadas, setTemporadas] = useState([]);

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
    const cUrlRequest = "formacion/equipo?" + new URLSearchParams(filtro).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal, () => {
      setloading(false);
    });
    setstate(data);
  };

  const seleccionar = (rec) => {
    console.log(rec);
    onOk(rec);
  };

  const columns = [
    { title: "Id.", dataIndex: "fformacion", key: "fformacion" },
    { title: "Equipo", dataIndex: "cEquipo", key: "cEquipo" },
    { title: "Tipo Categoria", dataIndex: "tpcategoria", key: "tpcategoria" },
    { title: "Categoria", dataIndex: "cCategoria", key: "cCategoria" },
    { title: "Año", dataIndex: "nTemporada", key: "nTemporada" },
    { title: "Temporada", dataIndex: "cTemporada", key: "cTemporada" },
    { title: "País", dataIndex: "cPais", key: "cPais" },
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
            label="Temporada"
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
      {loading ? (
        "Cargando ..."
      ) : (
        <Table
          columns={columns}
          dataSource={state}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                console.log(rowIndex, event);
                seleccionar(record);
              },
            };
          }}
          rowKey="fformacion"
          className="time-table-row-select"
          rowClassName={"custom-row"}
        />
      )}
      {contextHolder}
    </div>
  );
}
