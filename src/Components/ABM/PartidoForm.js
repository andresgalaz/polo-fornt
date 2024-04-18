import { Checkbox, Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function PartidosForm({ initialValues, onFormInstanceReady }) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [jugadores, setJugadores] = useState([]);

  useEffect(
    () => {
      onFormInstanceReady(form);
      (async () => {
        const { data } = await AxiosService.get("jugador", modal);
        setJugadores(data);
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const filterOptionJugador = (input, option) => (option?.cNombre ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      {contextHolder}
      <Form.Item name="idx" label="idx" hidden={true}>
        <Input />
      </Form.Item>
      <Form.Item name="posicion" label="Posición" rules={[{ required: true }]}>
        <Input disabled={true} style={{ width: "90%" }} />
      </Form.Item>
      <Form.Item name="fJugador" label="Nombre">
        <Select
          options={jugadores}
          fieldNames={{ value: "pJugador", label: "cNombre" }}
          showSearch
          filterOption={filterOptionJugador}
          style={{ width: "90%" }}
        />
      </Form.Item>
      <Form.Item name="nHandicap" label="HCP Inicial">
        <InputNumber
          parser={(value) => {
            console.log("parser");
            return `${parseInt(value)}`;
          }}
        />
      </Form.Item>
      <Form.Item name="bTitular" valuePropName="checked">
        <Checkbox> Es Titular </Checkbox>
      </Form.Item>
    </Form>
  );
}
