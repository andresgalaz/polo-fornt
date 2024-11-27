import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import PartidoTable from "./PartidoTable";
import AxiosService from "../../Helpers/AxiosService";
import FechaHlp from "../../Helpers/FechaHlp";
import PartidoForm from "./PartidoForm";

export default function PartidoAbm() {
  const [form] = Form.useForm();
  const [abiertos, setAbiertos] = useState([]);
  const [bBotonGrabar, setbBotonGrabar] = useState(false);
  const [equipos, setEquipos] = useState([]);
  const [equipoGanador, setEquipoGanador] = useState([]);
  const [formacionEquipo1, setFormacionEquipo1] = useState([]);
  const [formacionEquipo2, setFormacionEquipo2] = useState([]);
  const [formJugadorValues, setFormJugadorValues] = useState({});
  const [historia, setHistoria] = useState({ fTemporada: null, dPartido: null, fAbierto: null });
  const [idPartido, setIdPartido] = useState(0);
  const [modal, contextHolder] = Modal.useModal();
  const [nEquipo, setnEquipo] = useState(0); // TODO AGV: Ver si se puede llevar en los datos del form de jugadores
  const [nuevo, setNuevo] = useState(false);
  const [openBusca, setOpenBusca] = useState(false);
  const [openJugador, setOpenJugador] = useState(false);
  const [sumaHCP1, setSumaHCP1] = useState(0);
  const [sumaHCP2, setSumaHCP2] = useState(0);
  const [temporadas, setTemporadas] = useState([]);

  useEffect(
    () => {
      getAbiertos();
      getTemporadas();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const AjusteGanadorHandicap = () => {
    // Ganador por Handicap
    const nGolesAjustEquipo1 = form.getFieldValue("nGolesEquipo1") - form.getFieldValue("nAjusteHandicapEquipo1");
    const nGolesAjustEquipo2 = form.getFieldValue("nGolesEquipo2") - form.getFieldValue("nAjusteHandicapEquipo2");

    console.log("AjusteGanadorHandicap", nGolesAjustEquipo1, nGolesAjustEquipo2);

    if (nGolesAjustEquipo1 > nGolesAjustEquipo2) {
      form.setFieldValue("fEquipoGanadorHandicap", form.getFieldValue("fEquipo1"));
      form.setFieldValue("bEmpateHandicap", false);
    } else if (nGolesAjustEquipo1 < nGolesAjustEquipo2) {
      form.setFieldValue("fEquipoGanadorHandicap", form.getFieldValue("fEquipo2"));
      form.setFieldValue("bEmpateHandicap", false);
    } else {
      form.setFieldValue("fEquipoGanadorHandicap", null);
      form.setFieldValue("bEmpateHandicap", true);
    }
  };

  const buildEquipoGanador = (equipos, equipo1, equipo2) => {
    const arr = [];
    const elemEquipo1 = equipos.find((val) => val.pEquipo === equipo1);
    const elemEquipo2 = equipos.find((val) => val.pEquipo === equipo2);

    if (elemEquipo1) arr.push(elemEquipo1);
    if (elemEquipo2) arr.push(elemEquipo2);
    setEquipoGanador(arr);
  };

  const buscaPartido = () => {
    setOpenBusca(true);
    setNuevo(false);
  };

  const cancelar = () => {
    form.resetFields();
    setNuevo(false);
    setIdPartido(0);
    setEquipos([]);
    setFormacionEquipo1([]);
    setFormacionEquipo2([]);
  };

  const cargaFormacionEquipo = async (nEquipo, fEquipo) => {
    const fTemporada = form.getFieldValue("fTemporada");

    // Si cambio el valor del equipo
    if (!fEquipo) return;

    const cUrlParams = new URLSearchParams({ fTemporada, fEquipo }).toString();
    const { data } = await AxiosService.get(`formacion?${cUrlParams}`, modal);
    data.forEach((e) => {
      e.bTitular = true;
    });
    const nSumaHCP = await getSumaHCP(nEquipo, fEquipo, fTemporada);
    totales(nEquipo, data, nSumaHCP);
  };

  const colsFormacion = [
    { key: "1", title: "Equipo 1", dataIndex: "posicion" },
    { key: "2", title: "Nombre", dataIndex: "cJugador" },
    { key: "3", title: "HCP", dataIndex: "nHandicap", align: "right" },
    { key: "4", title: "Titular", dataIndex: "bTitular", render: (value) => renderBoolean(value) },
  ];

  const filterOptionEquipo = (input, option) => (option?.cNombre ?? "").toLowerCase().includes(input.toLowerCase());

  const getAbiertos = async () => {
    const { data } = await AxiosService.get("abierto", modal);
    setAbiertos(data);
  };

  const getEquipos = async () => {
    const fTemporada = form.getFieldValue("fTemporada");
    const fAbierto = form.getFieldValue("fAbierto");
    if (!fTemporada || !fAbierto) {
      setEquipos([]);
      return;
    }
    const abierto = abiertos.find((val) => val.pAbierto === fAbierto);
    if (!abierto) {
      console.error(`No se ecnontró abierto id=${fAbierto} en la lista`);
      return;
    }

    const cUrlRequest = "equipo?" + new URLSearchParams({ fCategoria: abierto.fCategoria, fTemporada }).toString();
    const { data } = await AxiosService.get(cUrlRequest, modal);

    setEquipos(data);
    return data;
  };

  const getData = async (idPartido) => {
    if (!idPartido) return;
    setIdPartido(idPartido);
    const {
      data: [partido],
    } = await AxiosService.get(`partido/${idPartido}`, modal);

    partido.dPartido = FechaHlp.fromString(partido.dPartido);
    partido.bFinal = partido.bFinal === 1 ? true : false;
    form.setFieldsValue(partido);
    // Carga combos equipo que dependen de Temporada y Abierto
    const equipos = await getEquipos();
    // Se hace necesario pasar el parametro equipos, porque setEquipos, no siempre actualiza
    // asi nos evitamos usar una variable externa
    buildEquipoGanador(equipos, partido.fEquipo1, partido.fEquipo2);
    // Formacion de equipos
    const { data: formacion1 } = await AxiosService.get(`partido/formacion/${idPartido}/1`, modal);
    const { data: formacion2 } = await AxiosService.get(`partido/formacion/${idPartido}/2`, modal);
    // Suma HCP equipo original
    const suma1 = await getSumaHCP(1, partido.fEquipo1, partido.fTemporada);
    const suma2 = await getSumaHCP(2, partido.fEquipo2, partido.fTemporada);

    totales(1, formacion1, suma1);
    totales(2, formacion2, suma2);

    setbBotonGrabar(true);
  };

  const getSumaHCP = async (nEquipo, fEquipo, fTemporada) => {
    const { data: suma } = await AxiosService.get(`formacion/sumaHandicap/${fEquipo}/${fTemporada}`, modal);
    if (nEquipo === 1) setSumaHCP1(suma);
    if (nEquipo === 2) setSumaHCP2(suma);
    console.log(`Suma ${nEquipo}/${fEquipo}/${fTemporada}: ${suma}`);
    return suma;
  };

  const getTemporadas = async () => {
    const { data: dataTem } = await AxiosService.get("temporada", modal);
    // Arma un par [value / label] con mas información
    const dataCb = dataTem.reduce((acum, curr) => {
      acum.push({ value: curr.pTemporada, label: curr.nTemporada + " " + curr.cDescripcion });
      return acum;
    }, []);
    setTemporadas(dataCb);
    getEquipos();
  };

  const getTitulo = () => {
    if (nuevo) return "Nueva Partido";
    if (idPartido && idPartido !== 0) return `Partido - ${idPartido}`;
    return "Partidos";
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
    // Actualiza el total
    data[4].nHandicap = data.reduce((pre, cur, idx) => (idx < 4 ? pre + cur.nHandicap : pre), 0);

    const nSumaHCP = nEquipo === 1 ? sumaHCP1 : sumaHCP2;
    form.setFieldValue("nAjusteHandicapEquipo" + nEquipo, data[4].nHandicap - nSumaHCP);

    AjusteGanadorHandicap();
    setnEquipo(0);
  };

  const grabarPartido = async () => {
    const nGolesEquipo1 = form.getFieldValue("nGolesEquipo1");
    const nGolesEquipo2 = form.getFieldValue("nGolesEquipo2");
    if (nGolesEquipo1 && nGolesEquipo2 && nGolesEquipo1 === nGolesEquipo2) {
      modal.error({
        title: "Validación datos partido",
        content: <>Debe haber un equipo ganador del abierto</>,
      });
    }

    try {
      const values = await form.validateFields();
      values["nuevo"] = nuevo;
      values["pPartido"] = idPartido;
      values["equipo1"] = formacionEquipo1;
      values["equipo2"] = formacionEquipo2;

      const {
        data: { pPartido },
      } = await AxiosService.put("partido", values, modal);
      // getData(pPartido);
      modal.info({
        title: "Partido",
        content: <>El partido se ha grabado en forma exitosa. ID={pPartido}</>,
      });
      if (nuevo) {
        const fTemporada = form.getFieldValue("fTemporada");
        const dPartido = form.getFieldValue("dPartido");
        const fAbierto = form.getFieldValue("fAbierto");

        setHistoria({ fTemporada, dPartido, fAbierto });
      }
      cancelar();
    } catch (errorInfo) {
      console.error("Failed:", errorInfo);
    }
  };

  const handleFormValuesChange = async (changedValues) => {
    const formFieldName = Object.keys(changedValues)[0];
    console.log(formFieldName);
    console.log(changedValues);

    if ("fTemporada,fAbierto".includes(formFieldName)) getEquipos();

    if (formFieldName === "fEquipo1" || formFieldName === "fEquipo2") {
      cargaFormacionEquipo(formFieldName === "fEquipo1" ? 1 : 2, Object.values(changedValues)[0]);
      buildEquipoGanador(equipos, form.getFieldValue().fEquipo1, form.getFieldValue().fEquipo2);
      form.setFieldValue("fEquipoGanadorAbierto", undefined);
      form.setFieldValue("fEquipoGanadorHandicap", undefined);
    }
    if (
      formFieldName === "nGolesEquipo1" ||
      formFieldName === "nGolesEquipo2" ||
      formFieldName === "nAjusteHandicapEquipo1" ||
      formFieldName === "nAjusteHandicapEquipo2"
    ) {
      const nGolesEquipo1 = form.getFieldValue("nGolesEquipo1");
      const nGolesEquipo2 = form.getFieldValue("nGolesEquipo2");

      console.log("handleFormValuesChange:nGolesEquipo", nGolesEquipo1, nGolesEquipo2);

      if (nGolesEquipo1 > nGolesEquipo2) {
        form.setFieldValue("fEquipoGanadorAbierto", form.getFieldValue("fEquipo1"));
      } else if (nGolesEquipo1 < nGolesEquipo2) {
        form.setFieldValue("fEquipoGanadorAbierto", form.getFieldValue("fEquipo2"));
      } else {
        form.setFieldValue("fEquipoGanadorAbierto", null);
      }
      AjusteGanadorHandicap();
    }
    setbBotonGrabar(
      form.getFieldValue("fTemporada") !== undefined &&
        form.getFieldValue("dPartido") !== undefined &&
        form.getFieldValue("fAbierto") !== undefined &&
        form.getFieldValue("fEquipo1") !== undefined &&
        form.getFieldValue("fEquipo2") !== undefined &&
        form.getFieldValue("nGolesEquipo1") !== undefined &&
        form.getFieldValue("nGolesEquipo2") !== undefined
    );
  };

  const nuevoPartido = () => {
    console.log(historia);
    cancelar();
    setEquipoGanador(equipos);
    setNuevo(true);

    form.setFieldValue("fTemporada", historia.fTemporada);
    form.setFieldValue("dPartido", historia.dPartido); // FechaHlp.fromString(historia.dPartido));
    form.setFieldValue("fAbierto", historia.fAbierto);
    getEquipos();
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

  const renderBoolean = (value) => {
    return <Checkbox checked={value}></Checkbox>;
  };

  const totales = async (nEquipo, data, sumaHCP) => {
    if (!nEquipo || (nEquipo !== 1 && nEquipo !== 2)) return;

    if (data.length < 4) {
      for (let i = data.length; i < 4; i++) {
        data.push({
          uuid: `uuid-${100 * nEquipo + i}`,
          posicion: `Jugador ${i}`,
          fJugador: 0,
          cJugador: "TBD",
          nHandicap: 0,
          nHandicapEquilibrio: 0,
          nHandicapFinal: 0,
          nHandicapVotado: 0,
          nHandicapVotadoJugadores: 0,
        });
      }
    } else if (data.length > 4) data.length = 4;

    let nHandicapTotal = 0;
    for (var i = 0; i < 4; i++) {
      data[i].posicion = `Jugador ${i + 1}`;
      nHandicapTotal += data[i].nHandicap;
    }
    data.push({ uuid: `total-${100 * nEquipo}`, posicion: "Total", nHandicap: nHandicapTotal });

    // setstate(data);
    if (nEquipo === 1) {
      setFormacionEquipo1([...data]);
      form.setFieldValue("nAjusteHandicapEquipo1", nHandicapTotal - sumaHCP);
    }
    if (nEquipo === 2) {
      setFormacionEquipo2([...data]);
      form.setFieldValue("nAjusteHandicapEquipo2", nHandicapTotal - sumaHCP);
    }
    AjusteGanadorHandicap();
  };

  return (
    <div>
      {contextHolder}
      <Flex justify="flex-end" gap="large">
        <Button type="primary" onClick={buscaPartido} disabled={nuevo}>
          Buscar
        </Button>
        <Button type="primary" onClick={nuevoPartido} disabled={nuevo}>
          Nuevo
        </Button>
        <Button type="primary" danger={nuevo} onClick={grabarPartido} disabled={!bBotonGrabar}>
          {nuevo ? "Crear" : "Grabar"}
        </Button>
        <Button type="primary" onClick={cancelar}>
          Cancelar
        </Button>
      </Flex>
      <PartidoTableModal open={openBusca} onCancel={() => setOpenBusca(false)} />
      <PartidoFormModal open={openJugador} grabar={grabarJugador} onCancel={() => setOpenJugador(false)} />

      <h2 className="centered">{getTitulo()}</h2>

      <Card title="Datos" type="inner" style={{ width: "90%" }}>
        <Form
          layout="vertical"
          disabled={idPartido === 0 && !nuevo}
          form={form}
          name="form_partido"
          onValuesChange={handleFormValuesChange}
        >
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
                <InputNumber style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nAjusteHandicapEquipo1" label="Ajuste HCP 1" rules={[{ required: true }]}>
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
                <InputNumber style={{ width: "90%" }} />
              </Form.Item>
            </Col>
            <Col sm={8}>
              <Form.Item name="nAjusteHandicapEquipo2" label="Ajuste HCP 2" rules={[{ required: true }]}>
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
              <Form.Item name="fEquipoGanadorHandicap" label="Equipo Ganador HCP" rules={[{ required: false }]}>
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
                <Checkbox> Empate en HCP </Checkbox>
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
                    setFormJugadorValues({ fTemporada: form.getFieldValue("fTemporada"), idx: rowIndex, ...record });
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
