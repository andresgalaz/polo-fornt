import React, { useState, useEffect } from "react";
import { Button, Flex, Input, Modal, Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import EquipoForm from "./EquipoForm";
import AxiosService from "../../Helpers/AxiosService";

let tableData;
export default function EquipoAbm() {
  const [state, setstate] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [nuevo, setNuevo] = useState(false);
  const [loading, setloading] = useState(true);
  const [formValues, setFormValues] = useState();
  const [open, setOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  useEffect(
    () => {
      getData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getData = async () => {
    const { data } = await AxiosService.get("equipo", modal, () => {
      setloading(false);
    });
    tableData = data;
    searchTable();
  };

  const EquipoFormModal = ({ open, grabar, cancelar }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title="Formulario Equipos"
        // width={"60%"}
        okText="Grabar"
        cancelText="Cancelar"
        okButtonProps={{
          autoFocus: true,
        }}
        onCancel={cancelar}
        destroyOnClose
        onOk={async () => {
          try {
            const values = await formInstance?.validateFields();
            if (await grabar(values)) formInstance?.resetFields();
          } catch (error) {
            console.error("Failed:", error);
          }
        }}
      >
        <EquipoForm
          initialValues={formValues}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
        />
      </Modal>
    );
  };

  const abrir = (rec) => {
    setNuevo(rec === undefined);
    setFormValues(rec);
    setOpen(true);
  };

  const cancelar = () => {
    setOpen(false);
    setNuevo(false);
  };

  const grabar = async (values) => {
    const resp = await AxiosService.put("equipo", { nuevo, ...values }, modal);
    if (!resp) return false;
    setNuevo(false);
    await getData();
    setOpen(false);
    return true;
  };

  const columns = [
    { title: "Id.", dataIndex: "pEquipo", key: "pEquipo" },
    { title: "Nombre", dataIndex: "cNombre", key: "cNombre" },
    { title: "Tipo Categoria", dataIndex: "cTpCategoria", key: "cTpCategoria" },
    { title: "Categoria", dataIndex: "cCategoria", key: "cCategoria" },
    { title: "País", dataIndex: "cPais", key: "cPais" },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Button icon={<EditOutlined />} onClick={() => abrir(record)}>
            Editar
          </Button>
        );
      },
    },
  ];

  function searchTable(searchStr) {
    if (searchStr) setFiltro(searchStr);
    else searchStr = filtro;
    const searchKeys = searchStr.split(" ");
    var tempdata = tableData.filter((fila) => {
      let bOK = true;
      for (let i = 0; i < searchKeys.length; i++)
        bOK = bOK && JSON.stringify(fila).toLocaleLowerCase().includes(searchKeys[i].toLocaleLowerCase());
      return bOK;
    });
    setstate(tempdata);
  }

  return (
    <div>
      <Flex justify="space-between" style={{ padding: 20 }}>
        <Space>
          Buscar
          <Input
            placeholder="search students"
            style={{ width: "140%" }}
            onChange={(e) => {
              searchTable(e.target.value);
            }}
          />
        </Space>
        <Space>
          <Button type="primary" onClick={() => abrir()}>
            Nuevo
          </Button>
        </Space>
      </Flex>
      {contextHolder}
      <EquipoFormModal open={open} grabar={grabar} cancelar={cancelar} />
      <h2 className="centered">Equipos</h2>
      {loading ? "Cargando ..." : <Table columns={columns} dataSource={state} rowKey="pEquipo" />}
    </div>
  );
}
