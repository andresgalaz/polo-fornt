import React, { useState, useEffect } from "react";
import { Button, Flex, Modal, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import FormacionTable from "./FormacionTable";
import AxiosService from "../../Helpers/AxiosService";

function FormacionAbm() {
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
    const { data } = await AxiosService.get("formacion", modal, () => {
      setloading(false);
    });
    setstate(data);
  };

  const FormacionTableModal = ({ open, onCancel }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title="Seleccione la Formación"
        width={"90%"}
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
            await AxiosService.put("formacion", values, modal);
            await getData();
            setOpen(false);
          } catch (error) {
            console.error("Failed:", error);
          }
        }}
      >
        <FormacionTable
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

  return (
    <div>
      <Flex justify="flex-end">
        <Button type="primary" onClick={() => abrir()}>
          Buscar Formación
        </Button>
      </Flex>
      {contextHolder}
      <FormacionTableModal open={open} onCancel={() => setOpen(false)} />
      <h2 className="centered">Formacions</h2>
      En construcción
    </div>
  );
}

export default FormacionAbm;
