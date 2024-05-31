import { Form, Input } from "antd";
import React, { useEffect } from "react";

export default function CategoriaForm({ initialValues, onFormInstanceReady }) {
  const [form] = Form.useForm();

  useEffect(
    () => {
      onFormInstanceReady(form);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      <Form.Item name="pCategoria" label="Id." rules={[{ required: true }]}>
        <Input disabled={initialValues !== undefined} />
      </Form.Item>
      <Form.Item name="cCategoria" label="Nombre">
        <Input onInput={(e) => (e.target.value = e.target.value.toUpperCase())} />
      </Form.Item>
      <Form.Item name="cDescripcion" label="Descripción">
        <Input />
      </Form.Item>
    </Form>
  );
}
