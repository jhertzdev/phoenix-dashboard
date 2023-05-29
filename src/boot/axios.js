import { boot } from 'quasar/wrappers'
import axios from 'axios'

const url_dev = 'https://backend.excel.tarjetajovendiamante.com/api/';
const api = axios.create({ baseURL: url_dev })

if (localStorage.getItem('token')) {
  api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
}

export default boot(({ app, router }) => {
  
  api.interceptors.response.use(response => {
    return response;
  }, error => {
    if (error.response.status === 401 && error.response.data.status === 'Token is Expired') {
      // TODO: Intentar refrescar el token
      router.push('/logout')
    }
    return error;
  });

  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

const ApiRest = function (url, config) {
  config.headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  return fetch(url_dev + url, config).then(m => m.json());
}
export { axios, api, ApiRest }
