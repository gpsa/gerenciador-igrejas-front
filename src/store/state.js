import helper from '@/helper'
import config from '@/config'

export default {
  appName: 'Gerenciador de Igrejas',
  pageTitle: 'Home',
  // menu: menu,
  user: {},
  token: helper.ls.get('token', null),
  message: {
    type: null,
    body: null
  },
  config: config
}
