import config from '@/config'
import apiClient from '@/apiclient'
import axios from 'axios/index'
// import helper from '@/helper'

export default {
  logout ({commit}) {
    commit('setAuth', {user: {}, token: null})
  },
  login ({commit}, data) {
    return axios.post(config.api.url + '/oauth', data).then((response) => {
      if (response.data.access_token) {
        commit('setAuth', {user: {}, token: response.data})

        // Get Usuário
        apiClient.get('/usuarios/usuario/me')
          .then(({data}) => {
            commit('setAuth', {user: data, token: Object.assign({startDate: new Date()}, response.data)})
          })

        return {status: true}
      }
    }).catch(function (error) {
      let status = error.response && error.response.status ? error.response.status : 500
      let message = error.response && error.response.data ? error.response.data.detail : 'Erro ao conectar com o servidor remoto'

      return {status: false, error: {status: status, message: message}}
    })
  },
  checkAuth ({commit}) {
    if (!this.state.token || !this.state.token.startDate) {
      return
    }

    let deadline = Math.trunc(Date.parse(this.state.token.startDate) / 1000) + this.state.token.expires_in
    let now = Math.trunc((new Date()).getTime() / 1000)

    let data = {
      'grant_type': 'refresh_token',
      'client_id': this.state.user.username + '_web',
      'refresh_token': this.state.token.refresh_token
    }

    if ((Math.trunc((deadline - now) / 60) % 60) <= config.session_refresh.missing_minutes) {
      axios.post(config.api.url + '/oauth', data).then((response) => {
        commit('setAuth', {user: this.state.user, token: Object.assign({startDate: new Date()}, response.data)})
      })
    }
  },
  checkPageTitle ({commit, state}, path) {
    for (let k in state.menu) {
      if (state.menu[k].href === path) {
        commit('setPageTitle', state.menu[k].title)
        break
      }
    }
  },
  validationsToArray (state, data) {
    const dataArray = []

    Object.keys(data).forEach(function (key) {
      dataArray[key] = Object.values(data[key])
    })

    return dataArray
  },
  convertArrayOfObjectsToCSV (state, args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data

    data = args.data || null
    if (data == null || !data.length) {
      return null
    }

    columnDelimiter = args.columnDelimiter || ','
    lineDelimiter = args.lineDelimiter || '\n'

    keys = Object.keys(data[0])

    result = ''
    result += (args.header || Object.keys(data[0])).join(columnDelimiter)
    result += lineDelimiter

    data.forEach(function (item) {
      ctr = 0
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter

        result += item[key]
        ctr++
      })
      result += lineDelimiter
    })

    return result
  },
  downloadCSV (state, args) {
    let data = []
    let headers = []

    args.headers.forEach(({text}) => {
      headers.push(text)
    })

    state.dispatch('convertArrayOfObjectsToCSV', {
      data: args.items,
      header: headers
    }).then((csv) => {
      if (csv === null) {
        return
      }

      let filename = args.filename || 'export.csv'

      if (!csv.match(/^data:text\/csv/i)) {
        csv = 'data:text/csv;charset=utf-8,' + csv
      }
      data = encodeURI(csv)

      let link = document.createElement('a')
      link.setAttribute('href', data)
      link.setAttribute('download', filename)
      link.click()
    })
  }
}
