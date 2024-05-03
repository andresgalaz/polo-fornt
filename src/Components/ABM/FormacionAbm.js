import React, { useState, useEffect } from "react";
import { Form, Button, Flex, Modal, Select, Input, Row, Col, Table } from "antd";
// import { EditOutlined } from "@ant-design/icons";
import FormacionTable from "./FormacionTable";
import AxiosService from "../../Helpers/AxiosService";
import FormacionForm from "./FormacionForm";

// let formacionJugadoresData;

function FormacionAbm() {
  const [form] = Form.useForm();
  const [state, setstate] = useState([]);
  // const [formHeadValues, setFormHeadValues] = useState({});
  const [formJugadorValues, setFormJugadorValues] = useState({});
  const [nueva, setNueva] = useState(false);
  const [idFormacion, setIdFormacion] = useState(0);
  const [openBusca, setOpenBusca] = useState(false);
  const [openJugador, setOpenJugador] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const [equipos, setEquipos] = useState([]);
  const [temporadas, setTemporadas] = useState([]);

  useEffect(
    () => {
      // onFormInstanceReady(form);
      getData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const buildFormacion = async () => {
    const fEquipo = form.getFieldValue("fEquipo");
    const fTemporada = form.getFieldValue("fTemporada");
    if (!fEquipo || !fTemporada) return;
    // Cuenta los jugadores distintos de TDB
    const nCountJugador = state.reduce((acc, cur, idx) => (idx < 4 && cur.fJugador !== 0 ? ++acc : acc), 0);
    if (nCountJugador > 0) return;
    // Si no se han ingrsado jugadores se busca a última formación en la
    // temporada anterior
    const { data } = await AxiosService.get(`formacion/ultima/${fEquipo}/${fTemporada}/`, modal);
    // formacionJugadoresData = [...data];
    console.log("buildFormacion:");
    totales(data);
  };

  const getTemporada = async (v) => {
    if (!v) return;
    const { data } = await AxiosService.get(`temporada/${v}`, modal);
    const cPais = data[0].cPais;
    form.setFieldsValue({ cPais });
    // buildFormacion();
  };

  const getEquipo = async (v) => {
    if (!v) return;
    const { data } = await AxiosService.get(`equipo/${v}`, modal);
    const cCategoria = data[0].cCategoria;
    form.setFieldsValue({ cCategoria });
    // buildFormacion();
  };

  const totales = (data) => {
    let HCPInicial = 0,
      HCPequilibrio = 0,
      HCPfinal = 0,
      HCPvotado = 0,
      HCPvotadoJugadores = 0;
    if (data.length > 4) data.length = 4;
    else if (data.length < 4) {
      for (let i = data.length; i < 4; i++) {
        data.push({
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
    }
    data.forEach((rec, idx) => {
      rec["posicion"] = `Jugador ${idx + 1}`;
      HCPInicial += rec["nHandicap"];
      HCPequilibrio += rec["nHandicapEquilibrio"];
      HCPfinal += rec["nHandicapFinal"];
      HCPvotado += rec["nHandicapVotado"];
      HCPvotadoJugadores += rec["nHandicapVotadoJugadores"];
    });
    data.push({
      posicion: "Total",
      nHandicap: HCPInicial,
      nHandicapEquilibrio: HCPequilibrio,
      nHandicapFinal: HCPfinal,
      nHandicapVotado: HCPvotado,
      nHandicapVotadoJugadores: HCPvotadoJugadores,
    });
    setstate([...data]);
  };

  const getData = async (idFormacion) => {
    setIdFormacion(idFormacion);
    const { data: dataTem } = await AxiosService.get("temporada", modal);
    // Arma un par [value / label] con mas información
    const dataCb = dataTem.reduce((acum, curr) => {
      acum.push({ value: curr.pTemporada, label: curr.nTemporada + " " + curr.cDescripcion });
      return acum;
    }, []);
    setTemporadas(dataCb);

    const { data: dataEqu } = await AxiosService.get("equipo", modal);
    setEquipos(dataEqu);

    if (!idFormacion) return;
    const { data } = await AxiosService.get(`formacion/${idFormacion}`, modal);
    // formacionJugadoresData = [...data];
    console.log("getData PRE:", data.length);
    totales(data);
    console.log("getData POST:", data.length);
    setstate(data);
    console.log("DATA:", data);

    // Alguno de estos 2 es redundante
    /*setFormHeadValues({
      fEquipo: data[0].fEquipo,
      cTpCategoria: data[0].cCategoria,
      fTemporada: data[0].fTemporada,
    });*/
    // Alguno de estos 2 es redundante
    form.setFieldsValue({
      fEquipo: data[0].fEquipo,
      fTemporada: data[0].fTemporada,
    });
    getEquipo(data[0].fEquipo);
    getTemporada(data[0].fTemporada);
  };

  const FormacionTableModal = ({ open, onCancel }) => {
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
        <FormacionTable
          onOk={async (rec) => {
            setOpenBusca(false);
            getData(rec.fFormacion);
          }}
        />
      </Modal>
    );
  };

  const FormacionFormModal = ({ open, grabar, onCancel }) => {
    const [formInstance, setFormInstance] = useState();
    return (
      <Modal
        open={open}
        title="Jugador de la Formación"
        width={"80%"}
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
        <FormacionForm
          initialValues={formJugadorValues}
          onFormInstanceReady={(instance) => {
            setFormInstance(instance);
          }}
        />
      </Modal>
    );
  };

  const buscarFormacion = (rec) => {
    setNueva(false);
    setOpenBusca(true);
    // setFormValues(rec);
  };

  const nuevaFormacion = () => {
    setNueva(true);
  };

  const grabarHabilitado = () => {
    return form.getFieldValue("fEquipo") !== undefined && form.getFieldValue("fTemporada") !== undefined;
  };

  const grabarFormacion = async () => {
    // Valida jugador repetido dentro de la misma formación
    const duplicates = state.reduce((pre, cur, idx) => {
      if (state.some((itSm, idxSm) => itSm.fJugador !== 0 && itSm.fJugador === cur.fJugador && idx !== idxSm))
        pre.push(cur);
      return pre;
    }, []);
    if (duplicates.length > 0) {
      modal.error({
        title: "Formaciones",
        content: <>El jugador {duplicates[0].cJugador} está duplicado en la formación</>,
      });
      return;
    }

    // Construye objeto para grabar usando la API
    const jugadores = state.reduce((pre, cur, idx) => {
      const { fJugador, nHandicap, nHandicapEquilibrio, nHandicapFinal, nHandicapVotado, nHandicapVotadoJugadores } =
        cur;
      if (idx <= 3)
        pre.push({
          fJugador,
          nHandicap,
          nHandicapEquilibrio,
          nHandicapFinal,
          nHandicapVotado,
          nHandicapVotadoJugadores,
        });
      return pre;
    }, []);
    const { fEquipo, fTemporada } = form.getFieldsValue(); // formHeadValues;
    await AxiosService.put(
      "formacion",
      { nueva, fFormacion: idFormacion, fEquipo, fTemporada, jugadores },
      modal,
      () => {
        // Una ves recibida la respuesta OK
        cancelar();
      }
    );
  };

  const cancelar = () => {
    form.resetFields();
    setNueva(false);
    setIdFormacion(0);
    setstate([]);
  };

  const columns = [
    { title: "Posición", dataIndex: "posicion", key: "posicion" },
    { title: "Nombre", dataIndex: "cJugador", key: "cJugador" },
    { title: "HCP Inicial", dataIndex: "nHandicap", key: "nHandicap", align: "right" },
    { title: "HCP Equilibrio", dataIndex: "nHandicapEquilibrio", key: "nHandicapEquilibrio", align: "right" },
    { title: "HCP Final", dataIndex: "nHandicapFinal", key: "nHandicapFinal", align: "right" },
    { title: "HCP Votado", dataIndex: "nHandicapVotado", key: "nHandicapVotado", align: "right" },
    {
      title: "HCP Votado Jugador",
      dataIndex: "nHandicapVotadoJugadores",
      key: "nHandicapVotadoJugadores",
      align: "right",
    },
  ];

  const filterOptionEquipo = (input, option) => (option?.cNombre ?? "").toLowerCase().includes(input.toLowerCase());

  const grabarJugador = async (rec) => {
    setOpenJugador(false);
    const {
      data: [jugador],
    } = await AxiosService.get(`jugador/${rec.fJugador}`, modal);
    const data = state;
    data[rec.idx].fJugador = rec.fJugador;
    data[rec.idx].cJugador = jugador.cNombre;
    data[rec.idx].nHandicap = rec.nHandicap;
    data[rec.idx].nHandicapEquilibrio = rec.nHandicapEquilibrio;
    data[rec.idx].nHandicapFinal = rec.nHandicapFinal;
    data[rec.idx].nHandicapVotado = rec.nHandicapVotado;
    data[rec.idx].nHandicapVotadoJugadores = rec.nHandicapVotadoJugadores;
    // Se copia para no destruir el original
    console.log("grabarJugador:");
    totales(data);
  };

  const getTitulo = () => {
    if (nueva) return "Nueva Formación";
    if (idFormacion && idFormacion !== 0) return `Formación - ${idFormacion}`;
    return "Formaciones";
  };

  return (
    <div>
      <Flex justify="flex-end" gap="large">
        <Button type="primary" onClick={buscarFormacion} disabled={nueva}>
          Buscar
        </Button>
        <Button type="primary" onClick={nuevaFormacion} disabled={nueva}>
          Nueva
        </Button>
        <Button type="primary" danger={nueva} onClick={grabarFormacion} disabled={!grabarHabilitado()}>
          {nueva ? "Crear" : "Grabar"}
        </Button>
        <Button type="primary" onClick={cancelar}>
          Cancelar
        </Button>
      </Flex>
      {contextHolder}
      <FormacionTableModal open={openBusca} onCancel={() => setOpenBusca(false)} />
      <FormacionFormModal open={openJugador} grabar={grabarJugador} onCancel={() => setOpenJugador(false)} />

      <h2 className="centered">{getTitulo()}</h2>

      <Form layout="vertical" form={form} name="form_formacion">
        <Row>
          <Col sm={14}>
            <Form.Item name="fEquipo" label="Equipo" rules={[{ required: true }]}>
              <Select
                showSearch
                disabled={!nueva}
                options={equipos}
                style={{ width: "90%" }}
                onChange={(v) => {
                  getEquipo(v);
                  buildFormacion();
                }}
                filterOption={filterOptionEquipo}
                fieldNames={{ value: "pEquipo", label: "cNombre" }}
              />
            </Form.Item>
          </Col>
          <Col sm={10}>
            <Form.Item name="cCategoria" label="Categoria" rules={[{ required: true }]}>
              <Input disabled={true} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={14}>
            <Form.Item name="fTemporada" label="Temporada" rules={[{ required: true }]}>
              <Select
                options={temporadas}
                style={{ width: "90%" }}
                onChange={(v) => {
                  getTemporada(v);
                  buildFormacion();
                }}
                disabled={!nueva}
              />
            </Form.Item>
          </Col>
          <Col sm={10}>
            <Form.Item name="cPais" key="pais" label="Pais">
              <Input disabled={true} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="posicion"
        columns={columns}
        dataSource={state}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              console.log("onRow", state, rowIndex);
              // Fila de totales
              if (rowIndex === 4) return;
              // Filas de jugadores
              setOpenJugador(true);
              setFormJugadorValues({ idx: rowIndex, ...record });
            },
          };
        }}
      />
    </div>
  );
}

export default FormacionAbm;
