<template>
    <v-flex xs12>
        <v-card>
            <v-card-text>
                <v-fab-transition>
                    <v-btn
                            title="Adicionar"
                            color="blue"
                            dark
                            absolute
                            top
                            right
                            fab
                            @click="$router.push('/membros/new')"
                    >
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-fab-transition>
            </v-card-text>
            <v-card-title>
                Membro
                <v-spacer></v-spacer>
                <v-text-field
                        append-icon="search"
                        :label="$t('Search')"
                        single-line
                        hide-details
                        :value="searchFilter"
                        @input="searchFilterEvent"
                        lazy
                ></v-text-field>
            </v-card-title>
        </v-card>
        <v-data-table
                v-bind:headers="headers"
                v-bind:items="items"
                v-bind:search="searchFilter"
                v-bind:pagination.sync="pagination"
                :total-items="totalItems"
                :loading="loading"
                hide-actions
                class="elevation-1"

        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-right">{{ props.item.id }}</td>
                <td class="text-xs-right">{{ props.item.nome }}</td>
                <td class="text-xs-right hidden-xs-only">{{ props.item.telefone_residencial }}</td>
                <td class="text-xs-right hidden-xs-only">{{ getCatName(props.item.categoria) }}</td>
                <td class="text-xs-right">
                    <v-btn fab small @click.native="$router.push('/membros/'+props.item.id)">
                        <v-icon dark>edit</v-icon>
                    </v-btn>
                    <v-btn fab small @click.native="goToDizimos(props.item)" title="Dízimos">
                        <v-icon dark>money</v-icon>
                    </v-btn>
                    <v-btn fab small @click="dialogDelete(props.item.id)" title="Remover">
                        <v-icon dark>delete</v-icon>
                    </v-btn>
                </td>
            </template>
        </v-data-table>
        <div class="text-xs-center pt-2">
            <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
        </div>
        <api-dialog :open="dialog.current.open" :message="dialog.current.message"
                    :title="dialog.current.title"
                    @close="remove"
                    @closeCancel="cancelDialogDelete"
                    :showCancel="dialog.current.cancel"
                    :showOk="dialog.current.ok">
            {{dialog.current.content}}
        </api-dialog>
    </v-flex>
</template>

<script>
  import {mapState} from 'vuex'
  import apiClient from '@/apiclient'
  import qs from 'qs'
  import URL from 'url-parse'
  import dialog from '@/components/general/Dialog'

  export default {
    components: {
      'api-dialog': dialog
    },
    computed: {
      ...mapState('membros', {
        'categoria': state => state.categoria,
        'searchFilter': state => state.searchFilter
      })
    },
    data () {
      return {
        dialog: {
          current: {},
          delete: {
            id: 0,
            ok: true,
            cancel: true,
            open: true,
            title: 'Excluir',
            message: 'Deseja excluir esse registro?'
          }
        },
        search: '',
        items: [],
        loading: true,
        pages: 0,
        totalItems: 0,
        pagination: {
          rowsPerPage: 25
        },
        headers: [
          {text: '#', value: 'id'},
          {text: 'Nome', value: 'nome'},
          {text: 'Fone', sortable: false, value: 'telefone_residencial', 'class': ' hidden-xs-only'},
          {text: 'Categoria', value: 'categoria', 'class': ' hidden-xs-only'},
          {text: 'Ações', value: '', sortable: false}
        ]
      }
    },
    watch: {
      pagination: {
        handler (newVal, oldVal) {
          this.getDataFromApi().then((data) => {
            this.items = data.items
            this.totalItems = data.pagination.totalItems
          })
        },
        deep: true
      }
    },
    methods: {
      searchFilterEvent (data) {
        this.$store.commit('membros/setSearch', data)
      },
      goToDizimos (membro) {
        this.$store.commit('dizimos/setDizimosMembro', {[membro.id]: membro.nome})
        this.$router.push('/dizimos/membro/' + membro.id + new URL(membro.dizimos).query)
      },
      dialogDelete (id) {
        this.dialog.current = Object.assign({}, this.dialog.delete)
        this.dialog.current.id = id
      },
      cancelDialogDelete (refresh = false) {
        this.dialog.current = {}

        if (refresh === true) {
          this.pagination.totalItems = null
        }
      },
      remove () {
        const dialog = this.dialog.current

        dialog.ok = false
        dialog.cancel = false
        dialog.message = 'Removendo registro...aguarde'

        return apiClient.delete('/membro/pessoa/' + dialog.id).then((ret) => {
          dialog.message = 'Registro removido com sucesso'

          setTimeout(this.cancelDialogDelete, 2000, true)
        }).catch((ret) => {
          dialog.message = 'Erro ao excluir o registro'

          setTimeout(this.cancelDialogDelete, 2000)
        })
      },
      getCatName (val) {
        let categoria = this.categoria.find((currentValue, index, arr) => {
          return currentValue.value === val
        })

        return (categoria ? categoria.text : null)
      },
      getDataFromApi () {
        this.loading = true
        const {sortBy, descending, page} = this.pagination

        let filter = (this.searchFilter && this.searchFilter.length > 0 ? [
          {
            'type': 'like',
            'field': 'nome',
            'value': this.searchFilter + '%'
          }
        ] : {})

        let orderBy = (sortBy && sortBy.length > 0 ? [{
          'type': 'field',
          'field': sortBy,
          'direction': descending ? 'desc' : 'asc'
        }] : {})

        const query = qs.stringify({
          'order-by': orderBy,
          filter,
          page
        })

        return apiClient.get('/membro/pessoa?' + query).then(({data}) => {
          this.loading = false
          this.pages = data.page_count

          const newData = {
            pagination: {
              // rowsPerPage: data.page_size,
              totalItems: data.total_items,
              page: data.page
            },
            items: []
          }

          data._embedded.pessoa_membro.forEach((item) => {
            newData.items.push({
              id: item.id,
              nome: item.nome,
              telefone_residencial: item.telefoneResidencial,
              categoria: item.categoria,
              dizimos: item._embedded.dizimos._links.self.href
            })
          })

          return newData
        })
      }
    }
  }
</script>

<style scoped>

</style>