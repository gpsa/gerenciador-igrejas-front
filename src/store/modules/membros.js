const membros = {
  namespaced: true,
  state: {
    searchFilter: null,
    envelope: [
      { 'value': 'ind', 'text': 'Individual' },
      { 'value': 'fam', 'text': 'Familiar' }
    ],
    sexo: [
      { 'value': 'F', 'text': 'Feminino' },
      { 'value': 'M', 'text': 'Masculino' }
    ],
    categoria: [
      { 'value': 'jov', 'text': 'Jovens' },
      { 'value': 'adu', 'text': 'Adultos' },
      { 'value': 'cri', 'text': 'Crianças' },
      { 'value': 'out', 'text': 'Outros...' }
    ],
    estadoCivil: [
      { value: 'Solteiro(a)', 'text': 'Solteiro(a)' },
      { value: 'Casado(a)', 'text': 'Casado(a)' },
      { value: 'Separado(a)', 'text': 'Separado(a)' },
      { value: 'Viúvo(a)', 'text': 'Viúvo(a)' }
    ],
    filhosArray: [
      { id: 0, nome: null, idade: null },
      { id: 1, nome: null, idade: null },
      { id: 2, nome: null, idade: null }
    ]
  },
  mutations: {
    setSearch (state, name) {
      state.searchFilter = name
    }
  }
}

export default membros
