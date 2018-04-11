<template>
    <v-layout row justify-center>
        <v-flex xs12 sm4>
            <v-select
                    label="Membro"
                    autocomplete
                    cache-items
                    required
                    item-value="value"
                    item-text="text"
                    :loading="loading"
                    :items="items"
                    :rules="[() => select > 0 || 'You must choose at least one']"
                    :search-input.sync="search"
                    v-model="select"
            ></v-select>
        </v-flex>
    </v-layout>
</template>

<script>
  import {mapState} from 'vuex'
  import apiClient from '@/apiclient'
  import qs from 'qs'
  import dialog from '@/components/general/Dialog'
  import URL from 'url-parse'

  export default {
    components: {
      'api-dialog': dialog
    },
    computed: {
      ...mapState('dizimos', {
        'categoria': state => state.categoria
      })
    },
    data () {
      return {
        loading: false,
        dialog: true,
        items: [],
        select: '',
        search: null
      }
    },
    watch: {
      search (val) {
        val && this.getDataFromApi(val)
      },
      select (val) {
        if (val > 0) {
          this.$store.commit('dizimos/setDizimosMembro', {[val]: this.items[val].text})
          this.$router.push('/dizimos/membro/' + this.items[val].value + new URL(this.items[val].dizimos).query)
        }
      }
    },
    methods: {
      getDataFromApi (val) {
        this.loading = true

        let filter = (val && val.length > 0 ? [
          {
            'type': 'like',
            'field': 'nome',
            'value': val + '%'
          }
        ] : {})

        const query = qs.stringify({
          filter
        })

        return apiClient.get('/membro/pessoa?' + query).then(({data}) => {
          this.loading = false
          this.items = []

          data._embedded.pessoa_membro.forEach((pessoa) => {
            this.items[pessoa.id] = ({
              value: pessoa.id,
              text: pessoa.nome,
              dizimos: pessoa._embedded.dizimos._links.self.href
            })
          })

          return data
        })
      }
    }
  }
</script>

<style scoped>

</style>