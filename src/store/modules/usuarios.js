const usuarios = {
  namespaced: true,
  state: {
    searchFilter: null,
    situacao: [
      {'value': 0, 'text': 'Inativo'},
      {'value': 1, 'text': 'Ativo'}
    ]
  },
  mutations: {
    setSearch (state, name) {
      state.searchFilter = name
    }
  }
}

export default usuarios
