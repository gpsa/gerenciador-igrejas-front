<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs9>
        <v-combobox
          v-model="meses"
          :items="monthList"
          label="Escolha os meses"
          multiple
          chips
          deletable-chips

        ></v-combobox>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex xs11 sm3>
        <v-btn light :disabled="!meses || meses.length == 0" @click.prevent="submit">Consultar</v-btn>
        <v-btn light :disabled="!meses || items.length == 0"
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
            <td class="text-xs-right">{{ props.item.dataNascimento }}</td>
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
  import helper from '@/helper'

  export default {
    name: 'aniversariantes',
    data() {
      return {
        meses: [],
        search: '',
        items: [],
        loading: false,
        pages: 0,
        totalItems: 0,
        pagination: {
          rowsPerPage: 200
        },
        headers: [
          {text: 'Nome', value: 'nome'},
          {text: 'Data de nascimento', value: 'dataNascimento'}
        ]
      }
    },
    computed: {
      monthList: () => helper.monthList()
    },
    watch: {
      meses() {
        this.items = []
      }
    },
    methods: {
      ...mapActions(['downloadCSV']),
      download() {
        this.loading = true
        const {sortBy, descending, page} = this.pagination

        let filter = [
          {
            type: 'birthday',
            field: 'dataNascimento',
            months: this.getSelectedMonths()
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

        return apiClient.get('/relatorios/aniversariantes?' + query, {
          headers: {
            Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
          responseType: 'blob'
        }).then((response) => {
          this.loading = false;
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'relatorio-aniversariantes.xlsx');
          document.body.appendChild(link);
          link.click();
        })
      },
      submit() {
        return this.getDataFromApi().then((data) => {
          this.items = data.items
          this.totalItems = data.pagination.totalItems
        })
      },
      getSelectedMonths: function () {
        let list = []
        this.meses.forEach(({value}) => {
          list.push(value)
        })

        return list;
      },
      getDataFromApi() {
        this.loading = true
        const {sortBy, descending, page} = this.pagination

        let filter = [
          {
            type: 'birthday',
            field: 'dataNascimento',
            months: this.getSelectedMonths()
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
              nome: item.nome,
              dataNascimento: this.$store.getters.formatDate(item.dataNascimento.date)
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
