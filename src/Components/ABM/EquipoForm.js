import { Form, Input, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import AxiosService from "../../Helpers/AxiosService";

export default function EquipoForm({ initialValues, onFormInstanceReady }) {
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [categorias, setCategorias] = useState([]);
  const [paises, setPaises] = useState([]);

  useEffect(
    () => {
      onFormInstanceReady(form);
      (async () => {
        const { data } = await AxiosService.get("categoria", modal);
        setCategorias(data);
      })();
      (async () => {
        const { data } = await AxiosService.get("pais", modal);
        setPaises(data);
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div>
      {contextHolder}
      <Form layout="vertical" form={form} name="form_in_modal" initialValues={initialValues}>
        <Form.Item name="pEquipo" label="Id.">
          <Input disabled={initialValues !== undefined} style={{ width: "40%" }} />
        </Form.Item>
        <Form.Item name="cNombre" label="Nombre">
          <Input style={{ width: "90%" }} />
        </Form.Item>
        <Form.Item name="fCategoria" label="Categoria">
          <Select
            options={categorias}
            fieldNames={{ value: "pCategoria", label: "cDescripcion" }}
            showSearch
            style={{ width: "90%" }}
          />
        </Form.Item>
        <Form.Item name="fPais" label="País">
          <Select
            options={paises}
            fieldNames={{ value: "pPais", label: "cPais" }}
            showSearch
            style={{ width: "90%" }}
          />
        </Form.Item>
      </Form>
    </div>
  );
}
