import { boot } from 'quasar/wrappers'
import axios from 'axios'

const url_dev='https://excel.api.phoenixtechsa.com/api/' ;
const api = axios.create({ baseURL:url_dev })

if (localStorage.getItem('token')) {
  api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

const ApiRest=function(url,config){
  config.Authorization=`Bearer ${localStorage.getItem('token')}`;
  return fetch(url,config).then(m=>m.json());
}
export { axios, api,ApiRest}