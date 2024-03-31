import React, { useState, useEffect } from "react";
import { Button, Flex, Modal, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import TemporadaForm from "./TemporadaForm";
import AxiosService from "../../Helpers/AxiosService";

function TemporadaAbm() {
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
    const { data } = await AxiosService.get("temporada", modal, () => {
      setloading(false);
    });
    setstate(data);
  };

  const TemporadaFormModal = ({ open, onCancel }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title="Formulario Temporadas"
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
            await AxiosService.put("temporada", values, modal);
            await getData();
            setOpen(false);
          } catch (error) {
            console.error("Failed:", error);
          }
        }}
      >
        <TemporadaForm
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

  const columns = [
    { title: "Id.", dataIndex: "pTemporada", key: "pTemporada" },
    { title: "Años", dataIndex: "nTemporada", key: "nTemporada" },
    { title: "País", dataIndex: "cPais", key: "cPais" },
    { title: "Descripción", dataIndex: "cDescripcion", key: "cDescripcion" },
    {
      title: "Action",
      // dataIndex: "pTemporada",
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
      <TemporadaFormModal open={open} onCancel={() => setOpen(false)} />
      <h2 className="centered">Temporadas</h2>
      {loading ? "CargandoCargando ..." : <Table columns={columns} dataSource={state} rowKey="pTemporada" />}
    </div>
  );
}

export default TemporadaAbm;
