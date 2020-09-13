import Vue from 'vue'
import VueI18n from 'vue-i18n'
import config from '@/config'
import helper from '@/helper'
import { Validator } from 'vee-validate'

const locales = ['en', 'pt_BR']

Vue.use(VueI18n)

let messages = {}

locales.forEach(v => {
  messages[v] = require(`./${v}/index`).default

  Validator.localize(v, require('vee-validate/dist/locale/' + v))

  if (messages[v].validation) {
    Validator.localize(v, messages[v].validation)
  }
})

const i18n = new VueI18n({
  locale: helper.ls.get('locale', config.locale),
  silentTranslationWarn: process.env.NODE_ENV === 'production',
  messages
})

export default i18n
