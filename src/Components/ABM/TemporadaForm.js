import { Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function TemporadaForm({ initialValues, isInsert, onFormInstanceReady }) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [paises, setPaises] = useState([]);

  useEffect(
    () => {
      onFormInstanceReady(form);
      async function getPaises() {
        const { data } = await AxiosService.get("pais", modal);
        setPaises(data);
      }
      getPaises();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (isInsert) {
    form.setFieldsValue({ pTemporada: 0, nTemporada: 2024 });
  }

  return (
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      {contextHolder}
      <Form.Item name="pTemporada" label="Id." rules={[{ required: true }]}>
        <InputNumber min={0} disabled={true} />
      </Form.Item>
      <Form.Item name="nTemporada" label="Año" rules={[{ required: true }]}>
        <InputNumber min={2000} max={2099} />
      </Form.Item>
      <Form.Item name="fPais" label="Pais" rules={[{ required: true }]}>
        <Select options={paises} fieldNames={{ label: "cPais", value: "pPais" }} />
      </Form.Item>
      <Form.Item name="cDescripcion" label="Descripción">
        <Input />
      </Form.Item>
    </Form>
  );
}
