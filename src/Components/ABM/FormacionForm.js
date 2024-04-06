import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function FormacionForm({ initialValues, onFormInstanceReady }) {
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

  const filterOptionJugador = (input, option) => (option?.cnombre ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
      {contextHolder}
      <Form.Item name="idx" label="idx" hidden={true}>
        <Input />
      </Form.Item>
      <Row>
        <Col sm={10}>
          <Form.Item name="posicion" label="Posición" rules={[{ required: true }]}>
            <Input disabled={true} style={{ width: "90%" }} />
          </Form.Item>
        </Col>
        <Col sm={10}>
          <Form.Item name="ftpjugador" label="Nombre">
            <Select
              options={jugadores}
              fieldNames={{ value: "ptpjugador", label: "cnombre" }}
              showSearch
              filterOption={filterOptionJugador}
              style={{ width: "90%" }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col sm={4}>
          <Form.Item name="nhandicap" label="HCP Inicial">
            <InputNumber />
          </Form.Item>
        </Col>
        <Col sm={4}>
          <Form.Item name="nhandicapequilibrio" label="HCP Equilibrio">
            <InputNumber />
          </Form.Item>
        </Col>
        <Col sm={4}>
          <Form.Item name="nhandicapfinal" label="HCP Final">
            <InputNumber />
          </Form.Item>
        </Col>
        <Col sm={4}>
          <Form.Item name="nhandicapvotado" label="HCP Votadol">
            <InputNumber />
          </Form.Item>
        </Col>
        <Col sm={4}>
          <Form.Item name="nhandicapvotado_jugadores" label="HCP Votado Jugador">
            <InputNumber />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
