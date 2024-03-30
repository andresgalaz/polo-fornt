import React, { useState, useEffect } from "react";
import { Button, Flex, Modal, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import PaisForm from "./PaisForm";
import AxiosService from "../../Helpers/AxiosService";

function PaisAbm() {
  const [state, setstate] = useState([]);
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
    const { data } = await AxiosService.get("pais", modal, () => {
      setloading(false);
    });
    setstate(data);
  };

  const PaisFormModal = ({ open, grabar, onCancel }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title="Formulario Paises"
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
            formInstance?.resetFields();
            grabar(values);
          } catch (error) {
            console.error("Failed:", error);
          }
        }}
      >
        <PaisForm
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
    setOpen(true);
    setFormValues(rec);
  };

  const grabar = async (values) => {
    await AxiosService.put("pais", values, modal);
    await getData();
    setOpen(false);
  };

  const columns = [
    { title: "Id.", dataIndex: "pPais", key: "pPais" },
    { title: "Nombre", dataIndex: "cPais", key: "cPais" },
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

  return (
    <div>
      <Flex justify="flex-end">
        <Button type="primary" onClick={() => abrir()}>
          Nuevo
        </Button>
      </Flex>
      {contextHolder}
      <PaisFormModal open={open} grabar={grabar} onCancel={() => setOpen(false)} />
      <h2 className="centered">Paises</h2>
      {loading ? "Loading ..." : <Table columns={columns} dataSource={state} rowKey="pPais" />}
    </div>
  );
}

export default PaisAbm;
