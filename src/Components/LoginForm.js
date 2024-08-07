import { Button, Form, Input, Modal } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import AxiosService from "../Helpers/AxiosService";

export default function LoginForm(props) {
  const [form] = Form.useForm();
  const [newPasswdReq, setNewPasswdReq] = useState(false);
  const [tokenSession, setTokenSession] = useState({});
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [modal, contextHolder] = Modal.useModal();

  const ingresar = async (cUsuario, cPassword) => {
    const { data } = await AxiosService.put("login/ingresar", { cUsuario, cPassword }, modal, () => {});
    console.log(data);
    return data;
  };
  const cambiaContrasena = async (cTokenSession, cUsuario, cPassword) => {
    const { data } = await AxiosService.put(
      "login/cambiarPassword",
      { cTokenSession, cUsuario, cPassword },
      modal,
      () => {}
    );
    console.log(data);
    return data;
  };

  const conectar = async (e) => {
    props.onLoginOK(false);
    const cUsuario = form.getFieldValue("cUsuario");
    const cPassword = form.getFieldValue("cPassword");
    if (cUsuario === "") return false;
    const cPasswordNew1 = form.getFieldValue("cPasswordNew1");
    const cPasswordNew2 = form.getFieldValue("cPasswordNew2");
    if (newPasswdReq) {
      if (cPasswordNew1 === "" || cPasswordNew2 === "") {
        modal.error({
          title: "Login",
          content: <>Debe ingresar contrseña nueva</>,
        });
        return false;
      }
      if (cPasswordNew1 !== cPasswordNew2) {
        modal.error({
          title: "Login",
          content: <>La nueva contraseña no coincide</>,
        });
        return false;
      }
      const cambio = await cambiaContrasena(tokenSession, cUsuario, cPasswordNew1);
      if (cambio.length > 0) {
        modal.error({
          title: "Login",
          content: <>{cambio}</>,
        });
        return false;
      } else {
        props.onLoginOK(true);
        return true;
      }
      // return true;
    }
    // try {
    const resp = await ingresar(cUsuario, cPassword);
    // console.log("Sign in successful", session.AuthenticationResult.IdToken);
    console.log("tokensesion :", resp.session);
    if (resp.nuevaPassword) {
      setTokenSession(resp.session);
      modal.error({
        title: "Login",
        content: <>Se requiere una nueva contraseña</>,
      });
      setNewPasswdReq(true);
      return false;
    }
    if (!resp.nombre || !resp.grupo) {
      modal.error({
        title: "Login",
        content: <>Usuario o contraseña erróneo</>,
      });
      return false;
    }
    console.log("nombre usuario :", resp.nombre);
    console.log("grupo :", resp.grupo);
    props.onLoginOK(true);
    // } catch (error) {
    //   modal.error({
    //     title: "Login",
    //     content: <>Problema con el servidor {error}</>,
    //   });
    // }
  };

  return (
    <Form layout="vertical" form={form} onFinish={conectar} name="form_in_modal" style={{ width: "300px" }}>
      {contextHolder}
      <Form.Item
        name="cUsuario"
        label="Usuario"
        rules={[
          {
            required: true,
            message: "Ingrese su usuario!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="cPassword"
        label="Contraseña"
        rules={[
          {
            required: true,
            message: "Ingrese su contraseña!",
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item name="cPasswordNew1" label="Nueva Contraseña" style={newPasswdReq ? {} : { display: "none" }}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="cPasswordNew2" label="Repita Contraseña Nueva" style={newPasswdReq ? {} : { display: "none" }}>
        <Input.Password />
      </Form.Item>
      {/* <Button icon={<LoginOutlined />} onClick={() => conectar()}> */}
      <Button icon={<LoginOutlined />} htmlType="submit">
        Ingresar
      </Button>
    </Form>
  );
}
