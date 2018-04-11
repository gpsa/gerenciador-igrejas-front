const dizimos = {
  namespaced: true,
  state: {
    membro: {},
    searchFilter: null
  },
  mutations: {
    setDizimosMembro (state, membro) {
      Object.assign(state.membro, membro)
    }
  }
}

export default dizimos
