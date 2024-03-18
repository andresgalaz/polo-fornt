import { Form, Input } from "antd";
import React, { useEffect } from "react";

export default function TemporadaForm({ initialValues, isInsert, onFormInstanceReady }) {
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
      <Form.Item name="pTemporada" label="Id." rules={[{ required: true }]}>
        <Input disabled={!isInsert} />
      </Form.Item>
      <Form.Item name="cTemporada" label="Nombre">
        <Input onInput={(e) => (e.target.value = e.target.value.toUpperCase())} />
      </Form.Item>
    </Form>
  );
}
