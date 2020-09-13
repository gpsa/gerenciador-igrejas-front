<template>
    <v-flex xs12 sm4>
        <v-form @submit.prevent="submit" v-model="valid" ref="form" lazy-validation>
            <v-dialog v-model="dialog" persistent max-width="290">
                <v-card>
                    <v-card-title class="headline">Erro ao autenticar</v-card-title>
                    <v-card-text v-t="dialog_msg"></v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="green darken-1" flat @click.native="dialog = false">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <v-text-field
                    :label="$t('Enter your username')"
                    v-model="form.username"
                    :rules="rules.username"
                    v-validate="'required|min:5'"
                    required
                    name="username"
            >
            </v-text-field>
            <v-text-field
                    :label="$t('Enter your password')"
                    v-model="form.password"
                    :rules="rules.password"
                    v-validate="'required|min:3'"
                    :append-icon="e1 ? 'visibility_off' : 'visibility'"
                    @click:append="() => (e1 = !e1)"
                    :type="e1 ? 'text' : 'password'"
                    name="password"
            ></v-text-field>

            <v-btn type="submit"
                   v-if="!isSubmiting"
                   :disabled="!valid"
            >
                submit
            </v-btn>
            <v-btn @click="clear"
                   v-if="!isSubmiting">{{$t('clear')}}
            </v-btn>
            <v-progress-linear v-if="isSubmiting" v-bind:indeterminate="true"></v-progress-linear>
        </v-form>
    </v-flex>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    data: () => ({
      dialog: false,
      dialog_msg: '',
      e1: false,
      valid: false,
      isSubmiting: false,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [],
        password: []
      }
    }),
    watch: {
      errors: {
        handler: function () {
          const err = this.$validator.errors

          Object.keys(this.rules).forEach((val) => {
            if (!this.rules[val]) {
              return
            }

            this.rules[val] = [() => (err.has(val) ? err.first(val) : true)]
          })
        },
        deep: true
      }
    },
    methods: {
      ...mapActions(['login']),
      submit () {
        this.$validator.validateAll().then((result) => {
          if (!result) {
            return false
          }

          const data = {
            grant_type: 'password',
            username: this.form.username,
            password: this.form.password,
            client_id: this.form.username + '_web'
          }

          this.isSubmiting = true

          this.login(data).then((data) => {
            // always executed
            this.isSubmiting = false

            if (data.status) {
              this.$router.replace('/')
            } else {
              this.dialog_msg = data.error.message
              this.dialog = true
            }
          })
        }).catch(err => {
          console.error(err)
        })
      },
      clear () {
        Object.keys(this.rules).forEach((val, key) => {
          this.rules[val] = []
        })

        this.form.username = ''
        this.form.password = ''
        this.valid = false
      }
    }
  }
</script>

<style scoped>

</style>
