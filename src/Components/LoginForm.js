import { Button, Form, Input, Modal } from "antd";
import { LoginOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import AuthService from "../Helpers/AuthService";

export default function LoginForm(props) {
  const [form] = Form.useForm();
  const [newPasswdReq, setNewPasswdReq] = useState(false);
  const [tokenSession, setTokenSession] = useState({});
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [modal, contextHolder] = Modal.useModal();

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
      const cambio = await AuthService.cambiaContrasena(tokenSession, cUsuario, cPasswordNew1);
      console.log(cambio);
      return true;
    }
    // const x = await e.preventDefault();
    // console.log(x);

    try {
      const session = await AuthService.ingresar(cUsuario, cPassword);
      console.log("Sign in successful", session);
      if (session) {
        setTokenSession(session.Session);
        if (session.ChallengeName === "NEW_PASSWORD_REQUIRED") {
          modal.error({
            title: "Login",
            content: <>Se requiere una nueva contraseña</>,
          });
          setNewPasswdReq(true);
        }
        props.onLoginOK(true);
      } else {
        modal.error({
          title: "Login",
          content: <>Usuario o contraseña incorrectos</>,
        });
      }
    } catch (error) {
      modal.error({
        title: "Login",
        content: <>Problema con el servidor {error}</>,
      });
    }
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
