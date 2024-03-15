import React, { useState, useEffect } from "react";
import { Button, Flex, Modal, Table } from "antd";
import axios from "axios";
import { EditOutlined } from "@ant-design/icons";
import PaisForm from "./PaisForm";

function PaisTable() {
  const [state, setstate] = useState([]);
  const [loading, setloading] = useState(true);
  const [formValues, setFormValues] = useState();
  const [open, setOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios.get("http://localhost:3002/pais").then((res) => {
      setloading(false);
      setstate(
        res.data.map((row) => ({
          pPais: row.pPais,
          cPais: row.cPais,
        }))
      );
    });
  };
  const putData = async (values) => {
    await axios
      .post("http://localhost:3002/pais", values)
      .then((res) => {
        setloading(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        modal.error({
          title: "Mensaje del Servidor",
          content: <>{err.response.data}</>,
        });
      });
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
    await putData(values);
    await getData();
    setOpen(false);
  };

  const columns = [
    { title: "Id.", dataIndex: "pPais", key: "pPais" },
    { title: "Nombre", dataIndex: "cPais", key: "cPais" },
    {
      title: "Action",
      // dataIndex: "pPais",
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
      {loading ? "Loading ..." : <Table columns={columns} dataSource={state} />}
    </div>
  );
}

export default PaisTable;
