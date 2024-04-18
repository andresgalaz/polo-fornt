import { Button, Card, Checkbox, Col, DatePicker, Flex, Form, Input, Modal, Row, Select, Table } from "antd";
import React, { useEffect, useState } from "react";
import PartidoTable from "./PartidoTable";
import AxiosService from "../../Helpers/AxiosService";
import FechaHlp from "../../Helpers/FechaHlp";
import PartidoForm from "./PartidoForm";

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
  const [bGrabarFormacion, setbGrabarFormacion] = useState(false);
  const [nuevo, setNuevo] = useState(false);
  const [openJugador, setOpenJugador] = useState(false);
  const [formJugadorValues, setFormJugadorValues] = useState({});
  const [nEquipo, setnEquipo] = useState(0);

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

    // Formacion de equipos
    const { data: formacion1 } = await AxiosService.get(`partido/formacion/${idPartido}/1`, modal);
    const { data: formacion2 } = await AxiosService.get(`partido/formacion/${idPartido}/2`, modal);
    // setFormacionEquipo1(formacion1);
    totales(1, formacion1);
    // setFormacionEquipo2(formacion2);
    totales(2, formacion2);
    setbBotonGrabar(true);
    setbGrabarFormacion(true);
  };

  const buscaPartido = () => {
    setOpenBusca(true);
    setNuevo(false);
  };

  const nuevoPartido = () => {
    form.resetFields();
    setbBotonGrabar(true);
    setFormacionEquipo1([]);
    setFormacionEquipo2([]);
    setEquipoGanador(equipos);
    setbGrabarFormacion(false);
    setNuevo(true);
  };
  const grabarPartido = async () => {
    try {
      const values = await form.validateFields();
      values["nuevo"] = nuevo;
      const {
        data: { pPartido },
      } = await AxiosService.put("partido", values, modal);
      getData(pPartido);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  const grabarFormacion = async () => {
    const idPartido = form.getFieldValue("pPartido");
    // Graba los dos equipos Formacion de equipos
    await AxiosService.put(
      `partido/formacion/${idPartido}`,
      { equipo1: formacionEquipo1, equipo2: formacionEquipo2 },
      modal
    );
    nuevoPartido();
  };
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

  const totales = (nEquipo, data) => {
    if (!nEquipo || (nEquipo !== 1 && nEquipo !== 2)) return;
    // Si está la linea de totales se elimina
    if (data.length === 4) data.push({ posicion: "Total" });

    let nHandicap = 0;
    for (var i = 0; i < 4; i++) {
      data[i].posicion = `Jugador ${i + 1}`;
      nHandicap += data[i].nHandicap;
    }
    data[4].nHandicap = nHandicap;
    // setstate(data);
    if (nEquipo === 1) setFormacionEquipo1(data);
    if (nEquipo === 2) setFormacionEquipo2(data);
  };

  const grabarJugador = async (rec) => {
    if (nEquipo !== 1 && nEquipo !== 2) return;
    setOpenJugador(false);
    const {
      data: [jugador],
    } = await AxiosService.get(`jugador/${rec.fJugador}`, modal);
    const data = nEquipo === 1 ? formacionEquipo1 : formacionEquipo2;
    data[rec.idx].fJugador = rec.fJugador;
    data[rec.idx].cJugador = jugador.cNombre;
    data[rec.idx].nHandicap = rec.nHandicap;
    data[rec.idx].bTitular = rec.bTitular;
    console.log("TOTALES");
    // Se copia para no destruir el original
    totales(nEquipo, data);
    setnEquipo(0);
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

  const PartidoFormModal = ({ open, grabar, onCancel }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title={`Jugador del Equipo ${nEquipo}`}
        width={"400px"}
        maskClosable={false}
        okText="Aceptar"
        cancelText="Cancelar"
        okButtonProps={{
          autoFocus: true,
        }}
        onCancel={onCancel}
        destroyOnClose
        onOk={async () => {
          try {
            const values = await formInstance?.validateFields();
            formInstance?.resetFields();
            grabar(values);
          } catch (error) {
            console.error("Failed:", error);
          }
        }}
      >
        <PartidoForm
          initialValues={formJugadorValues}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
        />
      </Modal>
    );
  };

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
        <Button type="primary" disabled={!bGrabarFormacion} onClick={grabarFormacion}>
          Grabar Formación
        </Button>
      </Flex>
      <PartidoTableModal open={openBusca} onCancel={() => setOpenBusca(false)} />
      <PartidoFormModal open={openJugador} grabar={grabarJugador} onCancel={() => setOpenJugador(false)} />

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
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    // Fila de totales
                    if (rowIndex === 4) return;
                    // Filas de jugadores
                    setOpenJugador(true);
                    setnEquipo(1);
                    setFormJugadorValues({ idx: rowIndex, ...record });
                  },
                };
              }}
            ></Table>
          </Col>
          <Col sm={12}>
            <Table
              columns={colsFormacion}
              dataSource={formacionEquipo2}
              pagination={false}
              rowKey="uuid"
              style={{ paddingleft: 20 }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    // Fila de totales
                    if (rowIndex === 4) return;
                    // Filas de jugadores
                    setOpenJugador(true);
                    setnEquipo(2);
                    setFormJugadorValues({ idx: rowIndex, ...record });
                  },
                };
              }}
            ></Table>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
