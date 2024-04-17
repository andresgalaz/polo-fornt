import dayjs from "dayjs";

export default class FechaHlp {
  static fromString(s) {
    if (!s) return null;
    try {
      const b = s.split(/\D+/);
      return dayjs(new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6])));
    } catch (e) {
      console.err(`No se puso convertir a fecha: ${s}`, e);
    }
  }
}
