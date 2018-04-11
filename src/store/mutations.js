import helper from '@/helper'

export default {
  setUser (state, user) {
    state.user = user
    helper.ls.set('user', user)
  },
  setAuth (state, {user, token}) {
    state.token = token
    helper.ls.set('token', token)

    this.commit('setUser', user)
  },
  setMenu (state, data) {
    state.menu = data
  },
  setPageTitle (state, data) {
    state.pageTitle = data
  },
  showMessage (state, type, body) {
    state.message = {type, body}
  }
}
