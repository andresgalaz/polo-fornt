import { Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function AbiertoForm({ initialValues, isInsert, onFormInstanceReady }) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [categorias, setCategorias] = useState([]);

  useEffect(
    () => {
      onFormInstanceReady(form);
      async function getCategorias() {
        const { data } = await AxiosService.get("categoria", modal);
        setCategorias(data);
      }
      getCategorias();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      {contextHolder}
      <Form.Item name="pAbierto" label="Id." rules={[{ required: !isInsert }]}>
        <InputNumber min={0} disabled={true} />
      </Form.Item>
      <Form.Item name="cNombre" label="Nombre">
        <Input />
      </Form.Item>
      <Form.Item name="fCategoria" label="Categoría" rules={[{ required: true }]}>
        <Select options={categorias} fieldNames={{ label: "cCategoria", value: "pCategoria" }} />
      </Form.Item>
      <Form.Item name="nChukkers" label="Chukkers" rules={[{ required: true }]}>
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item name="nChukkersFinal" label="Chukkers Final" rules={[{ required: true }]}>
        <InputNumber min={0} />
      </Form.Item>
    </Form>
  );
}
