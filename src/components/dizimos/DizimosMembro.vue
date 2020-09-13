<template>
    <v-dialog
            v-model="open"
            fullscreen
            transition="dialog-bottom-transition"
            :overlay=false
            scrollable
    >
        <v-card>
            <v-toolbar style="flex: 0 0 auto;" dark class="primary">
                <v-btn icon @click.native="close" dark>
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Dízimos de <i>{{membro[membro_id]}}</i></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat
                           @click.native="$router.push('/dizimos/membro/'+membro_id+'/new?' + qs.stringify(query))"
                           title="Adicionar Novo Registro">
                        <v-icon dark>add</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
                <v-flex xs12>
                    <v-data-table
                            v-bind:headers="headers"
                            v-bind:items="items"
                            v-bind:pagination.sync="pagination"
                            :total-items="totalItems"
                            :loading="loading"
                            hide-actions
                            class="elevation-1"

                    >
                        <template slot="items" slot-scope="props">
                            <td class="text-xs-right">{{ props.item.id }}</td>
                            <td class="text-xs-right">{{ props.item.data }}</td>
                            <td class="text-xs-right">{{ props.item.valor }}</td>
                            <td class="text-xs-right">
                                <v-btn fab small
                                       @click.native="$router.push('/dizimos/membro/'+membro_id+'/'+props.item.id +'?' + qs.stringify(query))">
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
                                @close="remove"
                                @closeCancel="cancelDialogDelete"
                                :showCancel="dialog.current.cancel"
                                :showOk="dialog.current.ok">
                        {{dialog.current.content}}
                    </api-dialog>
                </v-flex>
            </v-card-text>
            <div style="flex: 1 1 auto;"></div>
        </v-card>
        <router-view></router-view>
    </v-dialog>
</template>

<script>
  import apiClient from '@/apiclient'
  import qs from 'qs'
  import dialog from '@/components/general/Dialog'
  import {mapState} from 'vuex'

  const name = 'dizimos-membro'

  export default {
    name: name,
    props: ['membro_id'],
    computed: {
      ...mapState('dizimos', ['membro'])
    },
    components: {
      'api-dialog': dialog
    },
    data: () => {
      return {
        qs,
        query: null,
        open: false,
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
        items: [],
        loading: true,
        pages: 0,
        totalItems: 0,
        pagination: {
          rowsPerPage: 15
        },
        headers: [
          {text: '#', value: 'id'},
          {text: 'Data', value: 'data'},
          {text: 'Valor', value: 'valor'},
          {text: '', value: '', sortable: false}
        ]
      }
    },
    created () {
      let query = Object.assign({}, this.$route.query)

      this.open = true
      this.query = query
    },
    beforeRouteUpdate (to, from, next) {
      if (to.name === name) {
        this.open = true
        this.getDataFromApi(this.$route.query).then((data) => {
          this.items = data.items
          this.totalItems = data.pagination.totalItems
        })
      }

      return next()
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
      close () {
        this.open = false
        const vm = this
        setTimeout(function () {
          vm.$router.go(-1)
        }, 200)
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

        return apiClient.delete('/dizimos/dizimo/' + dialog.id).then((ret) => {
          dialog.message = 'Registro removido com sucesso'

          setTimeout(this.cancelDialogDelete, 2000, true)
        }).catch((ret) => {
          dialog.message = 'Erro ao excluir o registro'

          setTimeout(this.cancelDialogDelete, 2000)
        })
      },
      getDataFromApi (routeQuery = null) {
        if (routeQuery !== null) {
          this.query = routeQuery
        }

        this.loading = true
        const {sortBy, descending, page} = this.pagination

        let filter = (this.searchFilter && this.searchFilter.length > 0 ? {
          '1': {
            'type': 'like',
            'field': 'valor',
            'value': this.searchFilter + '%'
          }
        } : {})

        let orderBy = (sortBy && sortBy.length > 0 ? [{
          'type': 'field',
          'field': sortBy,
          'direction': descending ? 'desc' : 'asc'
        }] : {})

        const query = qs.stringify(Object.assign(this.query, {
          'order-by': orderBy,
          filter,
          page
        }))

        return apiClient.get('/dizimos/dizimo?' + query).then(({data}) => {
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

          data._embedded.financas_dizimo.forEach((item) => {
            newData.items.push({
              id: item.id,
              data: item.data.date.substring(0, 10),
              valor: item.valor
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
