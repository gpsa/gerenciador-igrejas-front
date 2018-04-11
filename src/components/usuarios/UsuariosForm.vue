<template>
    <v-flex xs12 sm8>
        <v-form action="javascript:;" v-model="valid" @submit="submit" lazy-validation>
            <api-dialog :open="dialog" :message="dialog_msg" :title="dialog_title"
                        @close="closeDialog">
                <api-validation-messages :validations="dialog_errors" v-if="Object.keys(dialog_errors).length>0"/>
            </api-dialog>

            <v-flex xs11 sm5>
                <v-flex xs3 sm3>
                    <v-text-field
                            :value="usuario_id == 'me' ? user.id : usuario_id == 'new' ? '' : usuario_id"
                            readonly
                            disabled
                            align-right
                    ></v-text-field>
                </v-flex>
                <v-text-field
                        label="Nome"
                        v-model="usuario.displayName"
                        align-right
                ></v-text-field>
                <v-text-field
                        label="Nome de usuário"
                        v-model="usuario.username"
                        align-right
                ></v-text-field>
                <v-text-field
                        type="password"
                        label="Senha"
                        v-model="usuario.password"
                        align-right
                ></v-text-field>
                <v-text-field
                        label="E-mail"
                        type="email"
                        v-model="usuario.email"
                        align-right
                ></v-text-field>
                <v-switch v-bind:label="'Estado'" v-model="usuario.state"></v-switch>
            </v-flex>

            <v-btn type="submit"
                   :disabled="!valid || isSubmiting">
                {{$t('save')}}
            </v-btn>
            <v-btn type="button"
                   :disabled="isSubmiting"
                   @click="$router.go(-1)">
                {{$t('back')}}
            </v-btn>
            <v-progress-linear v-if="isSubmiting" v-bind:indeterminate="true"></v-progress-linear>
        </v-form>
    </v-flex>
</template>

<script>
  import apiClient from '@/apiclient'
  import apiValidationMessages from '@/components/general/ApiValidationMessages'
  import dialog from '@/components/general/Dialog'
  import {mapState, mapMutations} from 'vuex'

  const name = 'usuarios-form'

  export default {
    name: name,
    props: ['usuario_id'],
    components: {
      'api-validation-messages': apiValidationMessages,
      'api-dialog': dialog
    },
    computed: {
      ...mapState('usuarios', {
        'situacao': state => state.situacao
      }),
      ...mapState(['user'])
    },
    data () {
      return {
        valid: false,
        isSubmiting: false,
        dialog: false,
        dialog_title: '',
        dialog_msg: '',
        dialog_errors: [],
        menu: {
          dataNascimento: false
        },
        usuario: {
          username: null,
          password: null,
          displayName: null,
          email: null,
          state: 0
        }
      }
    },
    methods: {
      ...mapMutations(['parseDate', 'formatDate']),
      openDialog (title, message) {
        this.dialog_title = title
        this.dialog_msg = message
        this.dialog = true
      },
      closeDialog () {
        this.dialog = false
        if ((Object.keys(this.dialog_errors).length === 0 || this.dialog_errors.length === 0)) {
          this.$router.go('-1')
        }
      },
      submit () {
        return this.$validator.validateAll().then((result) => {
          if (!result) {
            return false
          }

          this.isSubmiting = true

          let data = Object.assign({}, this.usuario)
          let datas = []

          datas.forEach((item) => {
            let dt = data[item].split('/')

            data[item] = dt[2].padStart(4, 0) + '-' + dt[1].padStart(2, 0) + '-' + dt[0].padStart(2, 0)
          })

          const vm = this
          const usuarioId = this.usuario_id > 0 ? this.usuario_id : (
            this.usuario_id === 'me' ? this.user.id : null
          )

          return apiClient({
            method: (usuarioId > 0 ? 'patch' : 'post'),
            url: '/usuarios/usuario' + (usuarioId > 0 ? '/' + usuarioId : ''),
            data
          }).then((response) => {
            this.isSubmiting = false
            this.dialog_errors = []

            if (response.status && [200, 201].indexOf(response.status) >= 0) {
              this.openDialog('Sucesso', 'Dados registrados com sucesso')

              if (this.usuario_id === 'me') {
                this.$store.commit('setUser', Object.assign(this.user, this.usuario))
              }
            } else {
              this.dialog_errors = (response.response.data.validation_messages ? response.response.data.validation_messages
                : response.response.data.detail)

              this.openDialog('Atenção')
            }

            // console.log(response)
          }).catch(function (error) {
            vm.dialog_errors = error.response.data.validation_messages ? error.response.data.validation_messages
              : (error.response.data.detail ? [error.response.data.detail] : ['Erro do servidor'])
            vm.openDialog('Atenção')
            vm.isSubmiting = false

            return {status: false, error: {status: error.status, message: error}}
          })
        })
      }
    },
    created () {
      let usuarioId = (this.usuario_id === 'me' ? this.user.id : (this.usuario_id > 0 ? this.usuario_id : 0))

      if (!(usuarioId > 0)) {
        return
      }

      apiClient.get('/usuarios/usuario/' + usuarioId).then(({data}) => {
        const newData = {}

        new Map(Object.entries(data)).forEach((item, key) => {
          if (!(key in this.usuario)) {
            return
          }

          if (key.indexOf('data') >= 0) {
            item = this.$store.getters.formatDate(item.date)
          }

          newData[key] = item
        })

        this.usuario = newData
      })
    }
  }
</script>

<style scoped>

</style>