import React, { useState, useEffect } from "react";
import { Button, Flex, Input, Modal, Space, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import AbiertoForm from "./AbiertoForm";
import AxiosService from "../../Helpers/AxiosService";

let tableData;
export default function AbiertosAbm() {
  const [state, setstate] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [loading, setloading] = useState(true);
  const [formValues, setFormValues] = useState();
  const [nuevo, setNuevo] = useState(false);
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
    const { data } = await AxiosService.get("abierto", modal, () => {
      setloading(false);
    });
    tableData = data;
    searchTable();
  };

  const AbiertoFormModal = ({ open, onCancel }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title="Formulario Abiertos"
        okText="Grabar"
        cancelText="Cancelar"
        okButtonProps={{
          autoFocus: true,
        }}
        onCancel={onCancel}
        destroyOnClose
        onOk={async () => {
          try {
            const values = await formInstance?.validateFields();
            await AxiosService.put("abierto", { nuevo, ...values }, modal, () => {
              setNuevo(false);
              setOpen(false);
              formInstance?.resetFields();
              getData();
            });
          } catch (error) {
            console.error("Failed:", error);
          }
        }}
      >
        <AbiertoForm
          initialValues={formValues}
          isInsert={formValues === undefined}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
        />
      </Modal>
    );
  };

  const abrir = (rec) => {
    if (!rec) setNuevo(true);
    setOpen(true);
    setFormValues(rec);
  };

  const columns = [
    { title: "Id. Abierto", dataIndex: "pAbierto", key: "pAbierto" },
    { title: "Nombre", dataIndex: "cNombre", key: "cNombre" },
    { title: "Categoria", dataIndex: "cTpCategoria", key: "cTpCategoria" },
    { title: "Chukkers", dataIndex: "nChukkers", key: "nChukkers" },
    { title: "Chukkers Final", dataIndex: "nChukkersFinal", key: "nChukkersFinal" },
    { title: "Id. Categoria", dataIndex: "fCategoria", key: "fCategoria" },
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
      <AbiertoFormModal open={open} onCancel={() => setOpen(false)} />
      <h2 className="centered">Abiertos</h2>
      {loading ? "Cargando ..." : <Table columns={columns} dataSource={state} rowKey="pAbierto" />}
    </div>
  );
}
