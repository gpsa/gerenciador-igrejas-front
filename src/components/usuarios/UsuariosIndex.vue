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
                            @click="$router.push('/usuarios/new')"
                    >
                        <v-icon>add</v-icon>
                    </v-btn>
                </v-fab-transition>
            </v-card-text>
            <v-card-title>
                Usuarios
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
                <td class="text-xs-right">{{ props.item.displayName }}</td>
                <td class="text-xs-right">{{ props.item.email }}</td>
                <td class="text-xs-right hidden-xs-only">{{ props.ultimoAcesso }}</td>
                <td class="text-xs-right hidden-xs-only">{{ props.item.username }}</td>
                <td>
                    <v-switch v-model="props.item.state" @change="alteraStatus(props.item.id)"></v-switch>
                </td>
                <td class="text-xs-right">
                    <v-btn fab small @click.native="$router.push('/usuarios/'+props.item.id)">
                        <v-icon dark>edit</v-icon>
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
                    @close="(dialog.current.close ? dialog.current.close() : null)"
                    @closeCancel="(dialog.current.closeCancel ? dialog.current.closeCancel() : null)"
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
      ...mapState('usuarios', {
        'searchFilter': state => state.searchFilter,
        'situacao': state => state.situacao
      })
    },
    data () {
      return {
        dialog: {
          current: {},
          stateError: {
            ok: true,
            cancel: false,
            open: true,
            title: 'Atenção',
            message: 'Erro ao alterar usuário',
            close: this.defaultDialogClose
          },
          delete: {
            id: 0,
            ok: true,
            cancel: true,
            open: true,
            title: 'Excluir',
            close: this.remove,
            closeCancel: 'cancelDialogDelete',
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
          {text: 'Nome', value: 'displayName'},
          {text: 'E-mail', sortable: false, value: 'email'},
          {text: 'Último Acesso', value: 'ultimo_acesso', 'class': ' hidden-xs-only'},
          {text: 'Usuário', sortable: false, value: 'username', 'class': ' hidden-xs-only'},
          {text: 'Estado', value: 'state'},
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
      defaultDialogClose () {
        this.dialog.current = {}
      },
      alteraStatus (id) {
        let usuario = this.items.find((item) => {
          return item.id === id
        })

        this.loading = true

        apiClient.patch('/usuarios/usuario/' + id, {state: Number(usuario.state)}).then(() => {
          this.loading = false
        }).catch(() => {
          this.loading = false
          this.dialog.current = Object.assign({}, this.dialog.stateError)
        })
      },
      getStateText (val) {
        let situacao = this.situacao.find((currentValue, index, arr) => {
          return currentValue.value === parseInt(val)
        })

        return (situacao ? situacao.text : null)
      },
      searchFilterEvent (data) {
        // this.$store.usuarios.searchFilter = data
        // this.searchFilter = data
        this.$store.commit('usuarios/setSearch', data)
      },
      goToDizimos (membro) {
        var url = new URL(membro.dizimos)

        this.$router.push('/dizimos/membro/' + membro.id + url.query + '&membro=' + membro.nome)
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

        return apiClient.delete('/usuarios/usuario/' + dialog.id).then((ret) => {
          dialog.message = 'Registro removido com sucesso'

          setTimeout(this.cancelDialogDelete, 2000, true)
        }).catch((ret) => {
          dialog.message = 'Erro ao excluir o registro'

          setTimeout(this.cancelDialogDelete, 2000)
        })
      },
      getDataFromApi () {
        this.loading = true
        const {sortBy, descending, page} = this.pagination

        let filter = (this.searchFilter && this.searchFilter.length > 0 ? [
          {
            'type': 'like',
            'field': 'displayName',
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

        return apiClient.get('/usuarios/usuario?' + query).then(({data}) => {
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

          data._embedded.usuarios.forEach((item) => {
            newData.items.push({
              id: item.id,
              username: item.username,
              displayName: item.displayName,
              ultimoAcesso: item.ultimoAcesso,
              state: item.state
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