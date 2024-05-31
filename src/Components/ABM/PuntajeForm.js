import { Checkbox, Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function PuntajeForm({ initialValues, onFormInstanceReady }) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [abiertos, setAbiertos] = useState([]);

  useEffect(
    () => {
      onFormInstanceReady(form);
      (async () => {
        const { data } = await AxiosService.get("abierto", modal);
        setAbiertos(data);
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const filterOptionAbierto = (input, option) => (option?.cNombre ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      {contextHolder}
      <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
        <Row>
          <Col sm={18}>
            <Form.Item name="pPuntaje" label="Id.">
              <Input disabled={initialValues !== undefined} style={{ width: "40%" }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={18}>
            <Form.Item name="cDescripcion" label="Descripción">
              <Input style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col sm={18}>
            <Form.Item name="fAbierto" label="Abierto">
              <Select
                options={abiertos}
                fieldNames={{ value: "pAbierto", label: "cNombre" }}
                showSearch
                filterOption={filterOptionAbierto}
                style={{ width: "90%" }}
              />
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item name="bFinal" label="Final" valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={18}>
            <Form.Item name="nPuntajeRanking" label="Puntaje Ranking" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item name="bTripleCorona" label="TC" valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={18}>
            <Form.Item name="nPuntajeHandicap" label="Puntaje Handicap" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item name="bFinalista" label="Finalista" valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={18}>
            <Form.Item name="nPuntajeGoles" label="Puntaje Goles" rules={[{ required: true }]}>
              <InputNumber min={0} />
            </Form.Item>
          </Col>
          <Col sm={4}>
            <Form.Item name="bPerdedor" label="Perdedor" valuePropName="checked">
              <Checkbox></Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
