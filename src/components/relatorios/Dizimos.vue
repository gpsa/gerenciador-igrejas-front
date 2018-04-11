<template>
    <v-container fluid>
        <v-layout row wrap>
            <v-flex xs11 sm5>
                <v-menu
                        lazy
                        :close-on-content-click="false"
                        v-model="dataInicialOpen"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        max-width="290px"
                        min-width="290px"
                >
                    <v-text-field
                            slot="activator"
                            label="Data inicial"
                            v-model="dataInicial"
                            prepend-icon="event"
                            readonly
                    ></v-text-field>
                    <v-date-picker v-model="dataInicial" no-title scrollable actions>
                        <template slot-scope="{ save, cancel }">
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                                <v-btn flat color="primary" @click="save">OK</v-btn>
                            </v-card-actions>
                        </template>
                    </v-date-picker>
                </v-menu>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11 sm5>
                <v-menu
                        lazy
                        :close-on-content-click="false"
                        v-model="dataFinalOpen"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        max-width="290px"
                        min-width="290px"
                >
                    <v-text-field
                            slot="activator"
                            label="Data final"
                            v-model="dataFinal"
                            prepend-icon="event"
                            readonly
                    ></v-text-field>
                    <v-date-picker v-model="dataFinal" no-title scrollable actions>
                        <template slot-scope="{ save, cancel }">
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                                <v-btn flat color="primary" @click="save">OK</v-btn>
                            </v-card-actions>
                        </template>
                    </v-date-picker>
                </v-menu>
            </v-flex>
            <v-spacer></v-spacer>
            <v-flex xs11 sm2>
                <v-btn light :disabled="!dataInicial || !dataFinal" @click.prevent="submit">Consultar</v-btn>
                <v-btn light :disabled="!dataInicial || !dataFinal || items.length == 0"
                       @click.prevent="download">Exportar
                </v-btn>
            </v-flex>
        </v-layout>
        <v-layout row wrap>
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
                        <td class="text-xs-right">{{ props.item.nome }}</td>
                        <td class="text-xs-right">{{ props.item.data }}</td>
                        <td class="text-xs-right">{{ props.item.valor }}</td>
                    </template>
                </v-data-table>
                <div class="text-xs-center pt-2">
                    <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
                </div>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  import {mapActions} from 'vuex'
  import apiClient from '@/apiclient'
  import qs from 'qs'

  export default {
    name: 'relatorio-dizimos',
    data () {
      return {
        dataInicialOpen: false,
        dataFinalOpen: false,
        dataInicial: null,
        dataFinal: null,
        search: '',
        items: [],
        loading: false,
        pages: 0,
        totalItems: 0,
        pagination: {
          rowsPerPage: 200
        },
        headers: [
          {text: 'Membro', value: 'membro'},
          {text: 'Data', value: 'data'},
          {text: 'Valor', value: 'valor'}
        ]
      }
    },
    watch: {
      dataInicial () {
        this.items = []
      },
      dataFinal () {
        this.items = []
      }
    },
    mounted () {
      let now = new Date()

      this.dataInicial = this.formatDate(new Date(now.getFullYear(), now.getMonth(), 1))
      this.dataFinal = this.formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0))
    },
    methods: {
      ...mapActions(['downloadCSV']),
      download () {
        return this.downloadCSV({
          items: this.items,
          headers: this.headers,
          filename: `dizimos_${this.dataInicial}_${this.dataFinal}.csv`
        })
      },
      formatDate (date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, 0) + '-' + date.getDate().toString().padStart(2, 0)
      },
      submit () {
        return this.getDataFromApi().then((data) => {
          this.items = data.items
          this.totalItems = data.pagination.totalItems
        })
      },
      getDataFromApi () {
        this.loading = true
        const {sortBy, descending, page} = this.pagination

        let filter = [
          {
            type: 'between',
            field: 'data',
            from: this.dataInicial + ' 00:00:00',
            to: this.dataFinal + ' 23:59:59'
          }
        ]

        let orderBy = (sortBy && sortBy.length > 0 ? [{
          'type': 'field',
          'field': sortBy,
          'direction': descending ? 'desc' : 'asc'
        }] : {})

        const query = qs.stringify({
          'order-by': orderBy,
          filter,
          page,
          page_size: this.pagination.rowsPerPage
        })

        return apiClient.get('/dizimos/dizimo?' + query).then(({data}) => {
          this.pages = data.page_count

          const newData = {
            pagination: {
              // rowsPerPage: data.page_size,
              totalItems: data.total_items,
              page: data.page
            },
            items: []
          }

          // Nenhum dado retornado
          if (!data._embedded || !data._embedded.financas_dizimo.length) {
            this.loading = false
          }

          data._embedded.financas_dizimo.forEach((item) => {
            return apiClient.get(item._embedded.membro._links.self.href).then(({data}) => {
              newData.items.push({
                nome: data.nome,
                data: this.$store.getters.formatDate(item.data.date),
                valor: item.valor
              })
            }).then(() => {
              this.loading = false
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