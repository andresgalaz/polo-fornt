import React from "react";
import axios from "axios";

export default class AxiosService {
  static async get(ruta, modal, fnCb) {
    try {
      const apiServer = process.env.REACT_APP_API_SERVER + ruta;
      const res = await axios.get(apiServer);
      if (fnCb) fnCb(res);
      return res;
    } catch (e) {
      let msg = e.response.data;
      if (e.code !== "ERR_BAD_RESPONSE") {
        console.error(msg);
        msg = "Error inesperado en el servidor";
      }
      if (modal) {
        modal.error({
          title: "Mensaje del Servidor",
          content: <>{msg}</>,
        });
      }
    }
  }

  static async put(ruta, values, modal, fnCb, isLongRqeuest) {
    const configCall = {};
    if (isLongRqeuest) {
      configCall.timeout = 600 * 1000; // 5 minutes
    }

    try {
      const apiServer = process.env.REACT_APP_API_SERVER + ruta;
      const res = await axios.post(apiServer, values, configCall);
      if (fnCb) fnCb(res);
      return res;
    } catch (e) {
      let msg = e.response.data;
      if (e.code !== "ERR_BAD_RESPONSE") {
        console.error(msg);
        msg = "Error inesperado en el servidor";
      }
      if (modal) {
        modal.error({
          title: "Mensaje del Servidor",
          content: <>{msg}</>,
        });
      }
    }
  }
}
