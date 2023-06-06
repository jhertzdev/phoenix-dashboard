import axios from "axios";

export const instance = axios.create({
  baseURL: 'https://backend.excel.tarjetajovendiamante.com/api/',
  headers: { "X-Custom-Header": "foobar" },
});
