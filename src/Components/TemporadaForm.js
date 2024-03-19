import { Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TemporadaForm({ initialValues, isInsert, onFormInstanceReady }) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [categorias, setCategorias] = useState([]);

  useEffect(
    () => {
      onFormInstanceReady(form);
      async function getCategorias() {
        try {
          setCategorias((await axios.get(process.env.REACT_APP_API_SERVER + "categoria")).data);
        } catch (e) {
          let msg = e.response.data;
          if (e.code !== "ERROR_BAD_REQUEST") {
            console.error(msg);
            msg = "Error inesperado en el servidor";
          }
          modal.error({
            title: "Mensaje del Servidor",
            content: <>{msg}</>,
          });
        }
      }
      getCategorias();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      {contextHolder}
      <Form.Item name="pTemporada" label="Id." rules={[{ required: true }]}>
        <InputNumber min={0} disabled={!isInsert} />
      </Form.Item>
      <Form.Item name="nTemporada" label="Año" rules={[{ required: true }]}>
        <InputNumber min={2000} max={2099} defaultValue={2024} />
      </Form.Item>
      <Form.Item name="fPais" label="Pais" rules={[{ required: true }]}>
        <Select options={categorias} fieldNames={{ label: "cDescripcion", value: "pCategoria" }} />
      </Form.Item>
      <Form.Item name="cDescripcion" label="Descripción">
        <Input />
      </Form.Item>
    </Form>
  );
}
