import React, { useState, useEffect } from "react";
import { Form, Button, Flex, Modal, Select, Input, Row, Col, Table } from "antd";
// import { EditOutlined } from "@ant-design/icons";
import FormacionTable from "./FormacionTable";
import AxiosService from "../../Helpers/AxiosService";
import FormacionForm from "./FormacionForm";

let formacionJugadoresData;

function FormacionAbm() {
  const [form] = Form.useForm();
  const [state, setstate] = useState([]);
  const [formHeadValues, setFormHeadValues] = useState({});
  const [formJugadorValues, setFormJugadorValues] = useState({});
  const [nueva, setNueva] = useState(false);
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

  const getTemporada = async (v) => {
    const { data } = await AxiosService.get(`temporada/${v}`, modal);
    const cPais = data[0].cPais;
    form.setFieldsValue({ cPais });
  };

  const getEquipo = async (v) => {
    const { data } = await AxiosService.get(`equipo/${v}`, modal);
    const cCategoria = data[0].cCategoria;
    form.setFieldsValue({ cCategoria });
  };

  const totales = (data) => {
    let HCPInicial = 0,
      HCPequilibrio = 0,
      HCPfinal = 0,
      HCPvotado = 0,
      HCPvotadoJugadores = 0;
    data.forEach((rec, idx) => {
      rec["posicion"] = `Jugador ${idx + 1}`;
      HCPInicial += rec["nhandicap"];
      HCPequilibrio += rec["nhandicapequilibrio"];
      HCPfinal += rec["nhandicapfinal"];
      HCPvotado += rec["nhandicapvotado"];
      HCPvotadoJugadores += rec["nhandicapvotado_jugadores"];
    });
    data.push({
      posicion: "Total",
      nhandicap: HCPInicial,
      nhandicapequilibrio: HCPequilibrio,
      nhandicapfinal: HCPfinal,
      nhandicapvotado: HCPvotado,
      nhandicapvotado_jugadores: HCPvotadoJugadores,
    });
    setstate(data);
  };

  const getData = async (idFormacion) => {
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
    formacionJugadoresData = [...data];
    totales(data);

    // Alguno de estos 2 es redundante
    setFormHeadValues({
      ptpequipo: data[0].ftpequipo,
      cTpCategoria: data[0].cCategoria,
      fTpTemporada: data[0].ftemporada,
    });
    // Alguno de estos 2 es redundante
    form.setFieldsValue({
      ptpequipo: data[0].ftpequipo,
      fTpTemporada: data[0].ftemporada,
    });
    getEquipo(data[0].ftpequipo);
    getTemporada(data[0].ftemporada);
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
            getData(rec.fformacion);
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
        title="JUgador de la Formación"
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

  const abrir = (rec) => {
    setNueva(false);
    setOpenBusca(true);
    // setFormValues(rec);
  };

  const copiar = () => {
    setNueva(true);
  };

  const editar = () => {
    console.log("Editar:", state);
    modal.warning({
      title: "Formaciones - Editar",
      content: <>En construcción</>,
    });
  };

  const columns = [
    { title: "Posición", dataIndex: "posicion", key: "posicion" },
    { title: "Nombre", dataIndex: "cJugador", key: "cJugador" },
    { title: "HCP Inicial", dataIndex: "nhandicap", key: "nhandicap", align: "right" },
    { title: "HCP Equilibrio", dataIndex: "nhandicapequilibrio", key: "nhandicapequilibrio", align: "right" },
    { title: "HCP Final", dataIndex: "nhandicapfinal", key: "nhandicapfinal", align: "right" },
    { title: "HCP Votado", dataIndex: "nhandicapvotado", key: "nhandicapvotado", align: "right" },
    {
      title: "HCP Votado Jugador",
      dataIndex: "nhandicapvotado_jugadores",
      key: "nhandicapvotado_jugadores",
      align: "right",
    },
  ];

  const filterOptionEquipo = (input, option) => (option?.cnombre ?? "").toLowerCase().includes(input.toLowerCase());
  const grabarJUgador = async (rec) => {
    console.log("grabarJUgador:", rec);
    setOpenJugador(false);
    const {
      data: [jugador],
    } = await AxiosService.get(`jugador/${rec.ftpjugador}`, modal);
    const data = formacionJugadoresData;
    data[rec.idx].ftpjugador = rec.ftpjugador;
    data[rec.idx].cJugador = jugador.cnombre;
    data[rec.idx].nhandicap = rec.nhandicap;
    data[rec.idx].nhandicapequilibrio = rec.nhandicapequilibrio;
    data[rec.idx].nhandicapfinal = rec.nhandicapfinal;
    data[rec.idx].nhandicapvotado = rec.nhandicapvotado;
    data[rec.idx].nhandicapvotado_jugadores = rec.nhandicapvotado_jugadores;
    // Se copia para no destruir el original
    totales([...data]);
  };

  return (
    <div>
      <Flex justify="flex-end" gap="large">
        <Button type="primary" onClick={abrir}>
          Buscar Formación
        </Button>
        <Button type="primary" onClick={copiar}>
          Copiar como Nueva Formación
        </Button>
        <Button type="primary" onClick={editar}>
          Grabar Editando Formación
        </Button>
      </Flex>
      {contextHolder}
      <FormacionTableModal open={openBusca} onCancel={() => setOpenBusca(false)} />
      <FormacionFormModal open={openJugador} grabar={grabarJUgador} onCancel={() => setOpenJugador(false)} />

      <h2 className="centered">Formaciones</h2>

      <Form layout="vertical" form={form} name="form_in_modal">
        <Row>
          <Col sm={14}>
            <Form.Item name="ptpequipo" label="Equipo" rules={[{ required: true }]}>
              <Select
                showSearch
                disabled={nueva === false}
                options={equipos}
                style={{ width: "90%" }}
                onChange={getEquipo}
                filterOption={filterOptionEquipo}
                fieldNames={{ value: "ptpequipo", label: "cnombre" }}
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
            <Form.Item name="fTpTemporada" label="Temporada" rules={[{ required: true }]}>
              <Select options={temporadas} style={{ width: "90%" }} onChange={getTemporada} />
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
        rowKey="pkFormacion"
        columns={columns}
        dataSource={state}
        pagination={false}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
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
