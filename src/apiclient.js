import axios from 'axios'
import config from '@/config'
import store from '@/store'
import router from './router'

const apiclient = axios.create({
  baseURL: config.api.url
})

apiclient.interceptors.request.use(config => {
  if (store.state.token !== null) {
    config.headers['Authorization'] = store.state.token.token_type + ' ' + store.state.token.access_token
  }

  return config
})
apiclient.interceptors.response.use((response) => { // intercept the global error
  store.dispatch('checkAuth')
  return response
}, function (error) {
  if (error.response && error.response.status === 401) {
    router.replace('/logout')

    return false
  }

  throw error
})

export default apiclient
