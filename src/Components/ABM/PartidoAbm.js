import { Button, Card, Checkbox, Col, DatePicker, Flex, Form, Input, Modal, Row, Select, Table } from "antd";
import React from "react";

export default function PartidoAbm() {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const buscar = () => {};
  const crear = () => {};
  const grabar = () => {};
  const grabarFormacion = () => {};
  const renderBoolean = (value) => {
    return <Checkbox checked={value}></Checkbox>;
  };

  const columnsEq1 = [
    { key: "1", title: "Equipo 1", dataIndex: "posicion" },
    { key: "2", title: "Nombre", dataIndex: "cJugador" },
    { key: "3", title: "HCP", dataIndex: "nhandicap", align: "right" },
    { key: "4", title: "Titular", dataIndex: "bTitular", render: (value) => renderBoolean(value) },
  ];
  const columnsEq2 = [
    { key: "1", title: "Equipo 2", dataIndex: "posicion" },
    { key: "2", title: "Nombre", dataIndex: "cJugador" },
    { key: "3", title: "HCP", dataIndex: "nhandicap", align: "right" },
    { key: "4", title: "Titular", dataIndex: "bTitular", render: (value) => renderBoolean(value) },
  ];

  const dataEq1 = [
    { posicion: "Jugador 1", bTitular: false },
    { posicion: "Jugador 2", bTitular: false },
    { posicion: "Jugador 3", bTitular: false },
    { posicion: "Jugador 4", bTitular: false },
  ];
  const dataEq2 = [
    { posicion: "Jugador 1", bTitular: false },
    { posicion: "Jugador 2", bTitular: false },
    { posicion: "Jugador 3", bTitular: false },
    { posicion: "Jugador 4", bTitular: true },
  ];

  return (
    <div>
      <Flex justify="flex-end" gap="large">
        <Button type="primary" onClick={buscar}>
          Buscar
        </Button>
        <Button type="primary" onClick={crear}>
          Nuevo
        </Button>
        <Button type="primary" onClick={grabar}>
          Grabar
        </Button>
        <Button type="primary" onClick={grabarFormacion}>
          Grabar Formación
        </Button>
      </Flex>
      {contextHolder}
      <h2 className="centered">Partidos</h2>
      <Card title="Datos" type="inner" style={{ width: "90%" }}>
        <Form layout="vertical" form={form} name="form_in_modal">
          <Row>
            <Col sm={8}>
              <Form.Item name="cTemporada" label="Temporada" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="cFecha" label="Fecha" rules={[{ required: true }]}>
                <DatePicker
                  onChange={(v) => {
                    console.log("Fecha", v);
                  }}
                />
              </Form.Item>
            </Col>
            <Col sm={8}></Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="pAbierto" label="Abierto" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}></Col>
            <Col sm={8}></Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="cEquipo1" label="Equipo 1" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nGolesEquipo1" label="Goles Equipo 1" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nAjusteHDP1" label="Ajuste HDP 1" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="cEquipo2" label="Equipo 2" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nGolesEquipo2" label="Goles Equipo 2" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nAjusteHDP2" label="Ajuste HDP 2" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="cGanadorAbierto" label="Equipo Ganador Abierto" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="cGanadorHDP" label="Equipo Ganador HDP" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}></Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="bFinal">
                <Checkbox checked={true} disabled={false} onChange={(e) => console.log("bFinal", e)}>
                  Es una final
                </Checkbox>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="bEmpateHDP">
                <Checkbox checked={true} disabled={false} onChange={(e) => console.log("bEmpateHDP", e)}>
                  Empate en HDP
                </Checkbox>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="bCampeonTC">
                <Checkbox checked={true} disabled={false} onChange={(e) => console.log("bCampeonTC", e)}>
                  Es campeón Triple Corona
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card title="Formaciones" type="inner" style={{ width: "90%" }}>
        <Row>
          <Col sm={12}>
            <Table columns={columnsEq1} dataSource={dataEq1} pagination={false} style={{ paddingRight: 20 }}></Table>
          </Col>
          <Col sm={12}>
            <Table columns={columnsEq2} dataSource={dataEq2} pagination={false} style={{ paddingleft: 20 }}></Table>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
