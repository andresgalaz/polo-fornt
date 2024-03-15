import { Form, Input } from "antd";
import React, { useEffect } from "react";

export default function PaisForm({ initialValues, isInsert, onFormInstanceReady }) {
  const [form] = Form.useForm();

  useEffect(() => {
    onFormInstanceReady(form);
  });

  return (
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      <Form.Item name="pPais" label="Id." rules={[{ required: true }]}>
        <Input disabled={!isInsert} />
      </Form.Item>
      <Form.Item name="cPais" label="Nombre">
        <Input onInput={(e) => (e.target.value = e.target.value.toUpperCase())} />
      </Form.Item>
    </Form>
  );
}
