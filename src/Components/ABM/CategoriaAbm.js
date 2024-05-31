import React, { useState, useEffect } from "react";
import { Button, Flex, Modal, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CategoriaForm from "./CategoriaForm";
import AxiosService from "../../Helpers/AxiosService";

export default function CategoriaAbm() {
  const [state, setstate] = useState([]);
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
    const { data } = await AxiosService.get("categoria", modal, () => {
      setloading(false);
    });
    setstate(data);
  };

  const CategoriaFormModal = ({ open, grabar, cancelar }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title="Formulario Categorías"
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
        <CategoriaForm
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
    const resp = await AxiosService.put("categoria", { nuevo, ...values }, modal);
    if (!resp) return false;
    setNuevo(false);
    await getData();
    setOpen(false);
    return true;
  };

  const columns = [
    { title: "Id.", dataIndex: "pCategoria", key: "pCategoria" },
    { title: "Nombre", dataIndex: "cCategoria", key: "cCategoria" },
    { title: "Descripción", dataIndex: "cDescripcion", key: "cDescripcion" },
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
        <Button
          type="primary"
          onClick={() => {
            abrir();
          }}
        >
          Nuevo
        </Button>
      </Flex>
      {contextHolder}
      <CategoriaFormModal open={open} grabar={grabar} cancelar={cancelar} />
      <h2 className="centered">Categorías</h2>
      {loading ? "Cargando ..." : <Table columns={columns} dataSource={state} rowKey="pCategoria" />}
    </div>
  );
}
