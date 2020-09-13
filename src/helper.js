import Vue from 'vue'
// import inflector from 'i'

const storage = window.sessionStorage
let helper = {}

/**
 * string processor
 */
// helper.i = inflector()

/**
 * sessionStorage
 */
helper.ls = {
  set (key, value) {
    value = JSON.stringify(value)
    storage.setItem(key, value)
  },
  get (key, defaultValue) {
    let value = storage.getItem(key)
    if (value === null || value === 'undefined' || value === '') {
      value = defaultValue
    } else {
      value = JSON.parse(value)
    }
    return value
  }
}

helper.capitalize = value => value[0].toUpperCase() + value.slice(1)

/**
 * a wrapper for helper.ls
 */
helper.store = (...args) => {
  if (args.length < 2) {
    const { key } = args
    return helper.ls.get(key)
  } else {
    const { key, value } = args
    return helper.ls.set(key, value)
  }
}
Vue.directive('back', (el, binding) => {
  el.onclick = () => window.history.go(-1)
})

helper.monthList = (userLang) => {
  userLang = userLang || (navigator.language || navigator.userLanguage)
  let list = []
  let date

  for (let i = 1; i <= 12; i++) {
    date = new Date(new Date().getFullYear() + '-' + String('0' + i).slice(-2) + '-01T12:00:00Z')
    list.push({
      value: date.toLocaleString('en-us', { month: 'short' }).toLocaleUpperCase(),
      text: date.toLocaleString(userLang, { month: 'long' }).toLocaleUpperCase()
    })
  }

  return list
}

export default helper
