import React, { useState, useEffect } from "react";
import { Button, Flex, Modal, Table } from "antd";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import TemporadaForm from "./TemporadaForm";

function TemporadaTable() {
  const [state, setstate] = useState([]);
  const [loading, setloading] = useState(true);
  const [formValues, setFormValues] = useState();
  const [open, setOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const apiServer = process.env.REACT_APP_API_SERVER + "temporada";

  useEffect(
    () => {
      getData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const getData = async () => {
    await axios.get(apiServer).then((res) => {
      setloading(false);
      setstate(
        res.data.map((row) => ({
          pTemporada: row.pTemporada,
          cTemporada: row.cTemporada,
        }))
      );
    });
  };

  const putData = async (values) => {
    await axios
      .post(apiServer, values)
      .then((res) => {
        setloading(false);
      })
      .catch((err) => {
        console.err(err.response.data);
        modal.error({
          title: "Mensaje del Servidor",
          content: <>{err.response.data}</>,
        });
      });
  };

  const TemporadaFormModal = ({ open, grabar, onCancel }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title="Formulario Temporadaes"
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

  const grabar = async (values) => {
    await putData(values);
    await getData();
    setOpen(false);
  };

  const columns = [
    { title: "Id.", dataIndex: "pTemporada", key: "pTemporada" },
    { title: "Nombre", dataIndex: "cTemporada", key: "cTemporada" },
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
      <TemporadaFormModal open={open} grabar={grabar} onCancel={() => setOpen(false)} />
      <h2 className="centered">Temporadaes</h2>
      {loading ? "Loading ..." : <Table columns={columns} dataSource={state} />}
    </div>
  );
}

export default TemporadaTable;
