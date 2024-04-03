import React, { useState, useEffect } from "react";
import { Form, Button, Flex, Modal, Select, Input, Row, Col, Table } from "antd";
// import { EditOutlined } from "@ant-design/icons";
import FormacionTable from "./FormacionTable";
import AxiosService from "../../Helpers/AxiosService";

function FormacionAbm() {
  const [form] = Form.useForm();
  const [state, setstate] = useState([]);
  // const [formValues, setFormValues] = useState();
  const [open, setOpen] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
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

  const getData = async (idFormacion) => {
    const { data: dataTem } = await AxiosService.get("temporada", modal);
    // Arma un par [value / label] con mas información
    const dataCb = dataTem.reduce((acum, curr) => {
      acum.push({ value: curr.pTemporada, label: curr.nTemporada + " " + curr.cDescripcion });
      return acum;
    }, []);
    setTemporadas(dataCb);

    if (!idFormacion) return;
    // const cUrlRequest = "formacion/equipo?" + new URLSearchParams({ fFormacion: idFormacion }).toString();
    // const { data } = await AxiosService.get(cUrlRequest, modal);
    const { data } = await AxiosService.get(`formacion/${idFormacion}`, modal);

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

    form.setFieldsValue({
      cEquipo: data[0].cEquipo,
      cTpCategoria: data[0].cCategoria,
      fTpTemporada: data[0].ftemporada,
    });
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
            setOpen(false);
            getData(rec.fformacion);
          }}
        />
      </Modal>
    );
  };

  const abrir = (rec) => {
    setOpen(true);
    // setFormValues(rec);
  };

  const copiar = () => {
    console.log("Copiar:", state);
    modal.warning({
      title: "Formaciones - Copiar",
      content: <>En construcción</>,
    });
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
      <FormacionTableModal open={open} onCancel={() => setOpen(false)} />
      <h2 className="centered">Formaciones</h2>

      <Form layout="vertical" form={form} name="form_in_modal">
        <Row>
          <Col sm={14}>
            <Form.Item name="cEquipo" label="Equipo" rules={[{ required: true }]}>
              <Input disabled={true} style={{ width: "90%" }} />
            </Form.Item>
          </Col>
          <Col sm={10}>
            <Form.Item name="cTpCategoria" label="Categoria" rules={[{ required: true }]}>
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
      <Table rowKey="pkFormacion" columns={columns} dataSource={state} pagination={false} />
    </div>
  );
}

export default FormacionAbm;
