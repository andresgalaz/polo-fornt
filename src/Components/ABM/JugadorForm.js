import { Checkbox, Form, Input } from "antd";
import React, { useEffect } from "react";

export default function JugadorForm({ initialValues, onFormInstanceReady }) {
  const [form] = Form.useForm();

  useEffect(
    () => {
      onFormInstanceReady(form);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div>
      <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
        <Form.Item name="pJugador" label="Id.">
          <Input disabled={initialValues !== undefined} style={{ width: "40%" }} />
        </Form.Item>

        <Form.Item name="cNombre" label="cNombre">
          <Input style={{ width: "90%" }} />
        </Form.Item>

        <Form.Item name="bPatron" label="Patron" valuePropName="checked">
          <Checkbox></Checkbox>
        </Form.Item>
      </Form>
    </div>
  );
}
