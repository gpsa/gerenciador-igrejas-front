<template>
    <v-dialog v-model="dialog2" persistent max-width="500px">
        <v-form action="javascript:;" v-model="valid" @submit="submit" lazy-validation>
            <api-dialog :open="dialog" :message="dialog_msg" :title="dialog_title"
                        @close="dialog=false; close()">
                <api-validation-messages :validations="dialog_errors" v-if="Object.keys(dialog_errors).length>0"/>
            </api-dialog>
            <v-card>
                <v-card-title>
                    {{title}}
                </v-card-title>
                <v-card-text>
                    <v-text-field
                            :maxlength="11"
                            v-model.lazy="dizimo.valor"
                            pattern="[0-9]{0,10}\.[0-9]{0,2}"
                    />
                    <v-menu
                            lazy
                            v-model="menu.data"
                            transition="scale-transition"
                            offset-y
                            full-width
                            :nudge-right="40"
                            max-width="290px"
                            min-width="290px"
                    >
                        <v-text-field
                                slot="activator"
                                label="Data"
                                v-model="dizimo.data"
                                prepend-icon="event"
                                readonly
                        ></v-text-field>
                        <v-date-picker
                                locale="pt-br"
                                v-model="inputData"
                                no-title scrollable actions>
                            <template slot-scope="{ save, cancel }">
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="save">OK</v-btn>
                                </v-card-actions>
                            </template>
                        </v-date-picker>
                    </v-menu>
                </v-card-text>
                <v-card-actions>
                    <v-btn type="submit"
                           :disabled="!valid || isSubmiting">
                        {{$t('save')}}
                    </v-btn>
                    <v-btn type="button"
                           :disabled="isSubmiting"
                           @click="close(true)">
                        {{$t('back')}}
                    </v-btn>
                </v-card-actions>
                <v-progress-linear v-if="isSubmiting" v-bind:indeterminate="true"></v-progress-linear>
            </v-card>
        </v-form>
    </v-dialog>
</template>

<script>
  import apiClient from '@/apiclient'
  import apiValidationMessages from '@/components/general/ApiValidationMessages'
  import dialog from '@/components/general/Dialog'
  // import Money from '@/components/general/Money'
  import {VMoney} from 'v-money'

  export default {
    name: 'dizimos-form',
    props: ['dizimo_id', 'membro_id'],
    components: {
      'api-validation-messages': apiValidationMessages,
      'api-dialog': dialog
    },
    directives: {money: VMoney},
    computed: {
      inputData: {
        get () {
          return this.$store.getters.parseDate(this.dizimo.data)
        },
        set (val) {
          this.dizimo.data = this.$store.getters.formatDate(val)
        }
      },
      title () {
        return (this.dizimo_id > 0 ? 'Editar' : 'Registrar') + ' Dízimo ' + (this.dizimo.id && this.dizimo.id > 0 ? '#' + this.dizimo.id : '')
      }
    },
    data () {
      return {
        query: null,
        dialog2: true,
        valid: false,
        isSubmiting: false,
        dialog: false,
        dialog_title: '',
        dialog_msg: '',
        dialog_errors: [],
        menu: {
          data: false
        },
        dizimo: {
          id: null,
          data: null,
          valor: null,
          valor2: null,
          membro: null
        },
        money: {
          decimal: ',',
          thousands: '.',
          prefix: 'R$ ',
          precision: 2,
          masked: false
        }
      }
    },
    methods: {
      setDizimo (valor) {
        this.dizimo.valor = valor
        this.dizimo.valor2 = valor
      },
      openDialog (title, message) {
        this.dialog_title = title
        this.dialog_msg = message
        this.dialog = true
      },
      close (back = false) {
        this.dialog = false

        // route back?
        if (back || this.dialog_errors.length === 0) {
          this.dialog2 = false
          this.$router.back()
        }
      },
      submit () {
        return this.$validator.validateAll().then((result) => {
          if (!result) {
            return false
          }

          this.isSubmiting = true

          let data = Object.assign({}, {valor: this.dizimo.valor, data: this.dizimo.data})

          // Informa o membro
          if ([null, 0].indexOf(this.dizimo.id) >= 0) {
            data.membro = this.dizimo.membro
          }

          let datas = ['data']
          let numeros = ['valor']

          datas.forEach((item) => {
            let dt = data[item].split('/')
            data[item] = dt[2].padStart(4, 0) + '-' + dt[1].padStart(2, 0) + '-' + dt[0].padStart(2, 0)
          })

          numeros.forEach((item) => {
            data[item] = this.$store.getters.formatNumber(data[item])
          })

          var vm = this
          return apiClient({
            method: (this.dizimo.id > 0 ? 'patch' : 'post'),
            url: '/dizimos/dizimo' + (this.dizimo.id > 0 ? '/' + this.dizimo.id : ''),
            data
          }).then((response) => {
            this.isSubmiting = false
            this.dialog_errors = []

            if (response.status && [200, 201].indexOf(response.status) >= 0) {
              this.openDialog('Sucesso', 'Dados registrados com sucesso')
            } else {
              this.dialog_errors = response.response.data.validation_messages
              this.openDialog('Atenção')
            }
          }).catch(function (error) {
            vm.dialog_errors = error.response.data.validation_messages ? error.response.data.validation_messages
              : (error.response.data.detail ? [error.response.data.detail] : ['Erro do servidor'])
            vm.isSubmiting = false
            vm.openDialog('Atenção')

            return {status: false, error: {status: error.status, message: error}}
          })
        })
      }
    },
    created () {
      this.query = Object.assign({}, this.$route.query)
      this.dizimo.membro = this.membro_id

      if (this.dizimo_id === 'new') {
        return
      }

      apiClient.get('/dizimos/dizimo/' + this.dizimo_id).then(({data}) => {
        this.dizimo.id = data.id
        // this.dizimo.valor = this.$store.getters.parseNumber(data.valor)
        this.dizimo.valor = data.valor
        this.dizimo.data = this.$store.getters.formatDate(data.data.date)
      }).catch((error) => {
        console.error(error)
      })
    }
  }
</script>

<style scoped>

</style>
