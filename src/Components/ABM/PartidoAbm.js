import { Button, Card, Checkbox, Col, DatePicker, Flex, Form, Input, Modal, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import PartidoTable from "./PartidoTable";
import AxiosService from "../../Helpers/AxiosService";
import FechaHlp from "../../Helpers/FechaHlp";

// let PartidoData;

export default function PartidoAbm() {
  const [form] = Form.useForm();
  const [openBusca, setOpenBusca] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [abiertos, setAbiertos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [equipoGanador, setEquipoGanador] = useState([]);
  const [temporadas, setTemporadas] = useState([]);
  // const [formValues, setFormValues] = useState({});
  const [formacionEquipo1, setFormacionEquipo1] = useState([]);
  const [formacionEquipo2, setFormacionEquipo2] = useState([]);
  const [bBotonGrabar, setbBotonGrabar] = useState(false);

  useEffect(
    () => {
      // onFormInstanceReady(form);
      getAbiertos();
      getTemporadas();
      getEquipos();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const buscaPartido = () => {
    setOpenBusca(true);
  };

  const nuevoPartido = () => {
    form.resetFields();
    setbBotonGrabar(true);
    setFormacionEquipo1([]);
    setFormacionEquipo2([]);
    setEquipoGanador(equipos);
  };
  const grabarPartido = async () => {
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      const resp = await AxiosService.put("partido", values, modal);
      console.log(resp);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  const grabarFormacion = () => {};
  const renderBoolean = (value) => {
    return <Checkbox checked={value}></Checkbox>;
  };

  const getTemporadas = async () => {
    const { data: dataTem } = await AxiosService.get("temporada", modal);
    // Arma un par [value / label] con mas información
    const dataCb = dataTem.reduce((acum, curr) => {
      acum.push({ value: curr.pTemporada, label: curr.nTemporada + " " + curr.cDescripcion });
      return acum;
    }, []);
    setTemporadas(dataCb);
  };

  const getEquipos = async () => {
    const { data } = await AxiosService.get("equipo", modal);
    setEquipos(data);
  };

  const getAbiertos = async () => {
    const { data } = await AxiosService.get("abierto", modal);
    setAbiertos(data);
  };

  const buildEquipoGanador = (equipo1, equipo2) => {
    const arr = [];
    const elemEquipo1 = equipos.find((val) => val.pEquipo === equipo1);
    const elemEquipo2 = equipos.find((val) => val.pEquipo === equipo2);

    if (elemEquipo1) arr.push(elemEquipo1);
    if (elemEquipo2) arr.push(elemEquipo2);
    setEquipoGanador(arr);
  };

  const getData = async (idPartido) => {
    if (!idPartido) return;
    const {
      data: [partido],
    } = await AxiosService.get(`partido/${idPartido}`, modal);
    partido.dPartido = FechaHlp.fromString(partido.dPartido);
    partido.bFinal = partido.bFinal === 1 ? true : false;
    // PartidoData = partido;
    buildEquipoGanador(partido.fEquipo1, partido.fEquipo2);
    form.setFieldsValue(partido);
    console.log("partido: ", partido);

    // Fomracion de equipos
    const { data: formacion1 } = await AxiosService.get(`partido/formacion/${idPartido}/1`, modal);
    const { data: formacion2 } = await AxiosService.get(`partido/formacion/${idPartido}/2`, modal);
    setFormacionEquipo1(formacion1);
    setFormacionEquipo2(formacion2);
    setbBotonGrabar(true);
  };

  const PartidoTableModal = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="Seleccione la Formación"
        width={"90%"}
        cancelText="Cancelar"
        okButtonProps={{ style: { display: "none" } }}
        onCancel={onCancel}
        destroyOnClose
      >
        <PartidoTable
          onOk={async (rec) => {
            setOpenBusca(false);
            getData(rec.pPartido);
          }}
        />
      </Modal>
    );
  };

  const handleFormValuesChange = (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];
    if (formFieldName === "fEquipo1" || formFieldName === "fEquipo2") {
      buildEquipoGanador(form.getFieldValue().fEquipo1, form.getFieldValue().fEquipo2);
      form.setFieldValue("fEquipoGanadorAbierto", undefined);
      form.setFieldValue("fEquipoGanadorHandicap", undefined);
    }
    if (formFieldName === "fEquipo1") setFormacionEquipo1([]);
    if (formFieldName === "fEquipo2") setFormacionEquipo2([]);
  };
  const filterOptionEquipo = (input, option) => (option?.cNombre ?? "").toLowerCase().includes(input.toLowerCase());
  const colsFormacion = [
    { key: "1", title: "Equipo 1", dataIndex: "posicion" },
    { key: "2", title: "Nombre", dataIndex: "cJugador" },
    { key: "3", title: "HCP", dataIndex: "nHandicap", align: "right" },
    { key: "4", title: "Titular", dataIndex: "bTitular", render: (value) => renderBoolean(value) },
  ];

  return (
    <div>
      {contextHolder}
      <Flex justify="flex-end" gap="large">
        <Button type="primary" onClick={buscaPartido}>
          Buscar
        </Button>
        <Button type="primary" onClick={nuevoPartido}>
          Nuevo
        </Button>
        <Button type="primary" disabled={!bBotonGrabar} onClick={grabarPartido}>
          Grabar
        </Button>
        <Button type="primary" disabled={true} onClick={grabarFormacion}>
          Grabar Formación
        </Button>
      </Flex>
      <PartidoTableModal open={openBusca} onCancel={() => setOpenBusca(false)} />

      <h2 className="centered">Partidos</h2>

      <Card title="Datos" type="inner" style={{ width: "90%" }}>
        <Form layout="vertical" form={form} name="form_partido" onValuesChange={handleFormValuesChange}>
          <Row>
            <Col sm={8}>
              <Form.Item name="fTemporada" label="Temporada" rules={[{ required: true }]}>
                <Select options={temporadas} style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="dPartido" label="Fecha" rules={[{ required: true }]}>
                <DatePicker />
              </Form.Item>
            </Col>
            <Col sm={8}></Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="fAbierto" label="Abierto" rules={[{ required: true }]}>
                <Select
                  label="Abierto"
                  options={abiertos}
                  defaultValue=""
                  fieldNames={{ label: "cNombre", value: "pAbierto" }}
                  style={{ width: "220px" }}
                ></Select>
              </Form.Item>
            </Col>
            <Col sm={8}></Col>
            <Col sm={8}></Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="fEquipo1" label="Equipo 1" rules={[{ required: true }]}>
                <Select
                  showSearch
                  options={equipos}
                  style={{ width: "90%" }}
                  filterOption={filterOptionEquipo}
                  fieldNames={{ value: "pEquipo", label: "cNombre" }}
                />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nGolesEquipo1" label="Goles Equipo 1" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nAjusteHandicapEquipo1" label="Ajuste HDP 1" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="fEquipo2" label="Equipo 2" rules={[{ required: true }]}>
                <Select
                  showSearch
                  options={equipos}
                  style={{ width: "90%" }}
                  filterOption={filterOptionEquipo}
                  fieldNames={{ value: "pEquipo", label: "cNombre" }}
                />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nGolesEquipo2" label="Goles Equipo 2" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nAjusteHandicapEquipo2" label="Ajuste HDP 2" rules={[{ required: true }]}>
                <Input style={{ width: "90%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="fEquipoGanadorAbierto" label="Equipo Ganador Abierto" rules={[{ required: true }]}>
                <Select
                  options={equipoGanador}
                  style={{ width: "90%" }}
                  fieldNames={{ value: "pEquipo", label: "cNombre" }}
                />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="fEquipoGanadorHandicap" label="Equipo Ganador HDP" rules={[{ required: true }]}>
                <Select
                  options={equipoGanador}
                  style={{ width: "90%" }}
                  fieldNames={{ value: "pEquipo", label: "cNombre" }}
                />
              </Form.Item>
            </Col>
            <Col sm={8}></Col>
          </Row>
          <Row>
            <Col sm={8}>
              <Form.Item name="bFinal" valuePropName="checked">
                <Checkbox> Es una final </Checkbox>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="bEmpateHandicap" valuePropName="checked">
                <Checkbox> Empate en HDP </Checkbox>
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="bTripleCorona" valuePropName="checked">
                <Checkbox> Es campeón Triple Corona </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="Formaciones" type="inner" style={{ width: "90%" }}>
        <Row>
          <Col sm={12}>
            <Table
              columns={colsFormacion}
              dataSource={formacionEquipo1}
              pagination={false}
              rowKey="uuid"
              style={{ paddingRight: 20 }}
            ></Table>
          </Col>
          <Col sm={12}>
            <Table
              columns={colsFormacion}
              dataSource={formacionEquipo2}
              pagination={false}
              rowKey="uuid"
              style={{ paddingleft: 20 }}
            ></Table>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
