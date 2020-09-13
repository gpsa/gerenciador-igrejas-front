<template>
    <v-flex xs12 sm8>
        <v-form action="javascript:;" v-model="valid" @submit="submit" lazy-validation>
            <api-dialog :open="dialog" :message="dialog_msg" :title="dialog_title"
                        @close="(dialog=false); Object.keys(dialog_errors).length===0 && $router.go('-1')">
                <api-validation-messages :validations="dialog_errors" v-if="Object.keys(dialog_errors).length>0"/>
            </api-dialog>

            <v-flex xs11 sm5>
                <v-flex xs3 sm3>
                    <v-text-field
                            v-model="membro.id"
                            readonly
                            disabled
                            align-right
                    ></v-text-field>
                </v-flex>
                <v-text-field
                        label="Nome"
                        v-model="membro.nome"
                        align-right

                ></v-text-field>
                <v-select
                        label="Sexo"
                        v-bind:items="sexo"
                        v-model="membro.sexo"
                        item-value="value"
                ></v-select>
                <v-select
                        label="Estado civil"
                        v-bind:items="estadoCivil"
                        v-model="membro.estadoCivil"
                        item-value="value"
                ></v-select>
                <v-menu
                        lazy
                        v-model="menu.dataNascimento"
                        transition="scale-transition"
                        offset-y
                        full-width
                        :nudge-right="40"
                        max-width="290px"
                        min-width="290px"
                >
                    <v-text-field
                            slot="activator"
                            label="Data de Nascimento"
                            v-model="membro.dataNascimento"
                            prepend-icon="event"
                            readonly
                    ></v-text-field>
                    <v-date-picker
                            locale="pt-br"
                            v-model="inputDataNascimento"
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
            </v-flex>
            <v-tabs>
                <v-tabs-bar class="cyan" dark>
                    <v-tabs-item :key="'congregacao'" :href="'#tab-congregacao'">
                        Congregação
                    </v-tabs-item>
                    <v-tabs-item :key="'endereco'" :href="'#tab-endereco'">
                        Endereço
                    </v-tabs-item>
                    <v-tabs-item :key="'contatos'" :href="'#tab-contatos'">
                        Contatos
                    </v-tabs-item>
                    <v-tabs-item :key="'parentesco'" :href="'#tab-parentesco'">
                        Parentesco
                    </v-tabs-item>
                    <v-tabs-item :key="'filhos'" :href="'#tab-filhos'">
                        Filhos
                    </v-tabs-item>
                    <v-tabs-slider color="yellow"></v-tabs-slider>
                </v-tabs-bar>
                <v-tabs-items>
                    <v-tabs-content
                            :key="'congregacao'"
                            :id="'tab-congregacao'"
                    >
                        <v-flex xs4 sm4>
                            <v-menu
                                    lazy
                                    v-model="menu.dataCongregacao"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    :nudge-right="40"
                                    max-width="290px"
                                    min-width="290px"
                            >
                                <v-text-field
                                        slot="activator"
                                        label="Data de congregação"
                                        v-model="membro.dataCongregacao"
                                        prepend-icon="event"
                                        readonly
                                ></v-text-field>
                                <v-date-picker
                                        v-model="inputDataCongregacao"
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
                        </v-flex>
                        <v-flex xs4 sm4>
                            <v-menu
                                    lazy
                                    v-model="menu.dataBatismo"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    :nudge-right="40"
                                    max-width="290px"
                                    min-width="290px"
                            >
                                <v-text-field
                                        slot="activator"
                                        label="Data de batismo"
                                        v-model="membro.dataBatismo"
                                        prepend-icon="event"
                                        readonly
                                ></v-text-field>
                                <v-date-picker
                                        v-model="inputDataBatismo"
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
                        </v-flex>
                        <v-text-field
                                label="Cargo"
                                v-model="membro.cargo"
                                align-right
                        ></v-text-field>
                        <v-select
                                label="Envelope"
                                v-bind:items="envelope"
                                v-model="membro.envelope"
                                item-value="value"
                        ></v-select>
                        <v-select
                                label="Categoria"
                                v-bind:items="categoria"
                                v-model="membro.categoria"
                                item-value="value"
                        ></v-select>
                    </v-tabs-content>
                    <v-tabs-content
                            :key="'endereco'"
                            :id="'tab-endereco'"
                    >
                        <v-card flat>
                            <v-text-field
                                    label="Endereço"
                                    v-model="membro.endereco"
                                    required
                            ></v-text-field>
                            <v-text-field
                                    label="CEP"
                                    v-model="membro.cep"
                                    :mask="'#####-###'"
                                    required
                            ></v-text-field>
                        </v-card>
                    </v-tabs-content>
                    <v-tabs-content
                            :key="'contatos'"
                            :id="'tab-contatos'"
                    >
                        <v-card flat>
                            <v-text-field
                                    label="Telefone Celular"
                                    v-model="membro.telefoneCelular"
                            ></v-text-field>
                            <v-text-field
                                    label="Telefone Residencial"
                                    v-model="membro.telefoneResidencial"
                            ></v-text-field>
                            <v-text-field
                                    label="Telefone Comercial"
                                    v-model="membro.telefoneComercial"
                            ></v-text-field>
                        </v-card>
                    </v-tabs-content>
                    <v-tabs-content
                            :key="'parentesco'"
                            :id="'tab-parentesco'"
                    >
                        <v-card flat>
                            <v-text-field
                                    label="Nome da mãe"
                                    v-model="membro.nomeMae"
                            ></v-text-field>
                            <v-text-field
                                    label="Nome do pai"
                                    v-model="membro.nomePai"
                            ></v-text-field>
                            <v-text-field
                                    label="Nome do cônjuge"
                                    v-model="membro.nomeConjuge"
                            ></v-text-field>

                            <v-flex xs4 sm4>
                                <v-menu
                                        lazy
                                        v-model="menu.dataNascimentoConjuge"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        :nudge-right="40"
                                >
                                    <v-text-field
                                            slot="activator"
                                            label="Nascimento do cônjuge"
                                            v-model="membro.dataNascimentoConjuge"
                                            prepend-icon="event"
                                            readonly
                                    ></v-text-field>

                                    <v-date-picker
                                            v-model="inputDataNascimentoConjuge"
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
                            </v-flex>

                            <v-checkbox
                                    label="Cônjuge evangélico?"
                                    v-model="membro.conjugeEvangelico"
                            ></v-checkbox>
                        </v-card>
                    </v-tabs-content>
                    <v-tabs-content
                            :key="'filhos'"
                            :id="'tab-filhos'"
                    >
                        <v-card flat>
                            <v-checkbox
                                    label="Possui filhos?"
                                    v-model="membro.filhos"
                            ></v-checkbox>
                        </v-card>
                        <v-layout row wrap v-for="(filho,i) in membro.filhosArray" v-if="membro.filhos"
                                  :key="filho.id">
                            <v-flex xs10>
                                <v-card flat>
                                    <v-text-field
                                            :label="'Nome filho '+(i+1)"
                                            v-model="filho.nome"
                                            required
                                    ></v-text-field>
                                </v-card>
                            </v-flex>
                            <v-flex xs2>
                                <v-card flat>
                                    <v-text-field
                                            :label="'Idade filho '+(i+1)"
                                            v-model="filho.idade"
                                            required
                                    ></v-text-field>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-tabs-content>
                </v-tabs-items>
            </v-tabs>
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

  export default {
    name: 'membro-form',
    props: ['id'],
    components: {
      'api-validation-messages': apiValidationMessages,
      'api-dialog': dialog
    },
    computed: {
      ...mapState('membros', {
        'envelope': state => state.envelope,
        'sexo': state => state.sexo,
        'categoria': state => state.categoria,
        'estadoCivil': state => state.estadoCivil,
        'filhosArray': state => state.filhosArray
      }),
      inputDataNascimento: {
        get () {
          return this.$store.getters.parseDate(this.membro.dataNascimento)
        },
        set (val) {
          this.membro.dataNascimento = this.$store.getters.formatDate(val)
        }
      },
      inputDataBatismo: {
        get () {
          return this.$store.getters.parseDate(this.membro.dataBatismo)
        },
        set (val) {
          this.membro.dataBatismo = this.$store.getters.formatDate(val)
        }
      },
      inputDataNascimentoConjuge: {
        get () {
          return this.$store.getters.parseDate(this.membro.dataNascimentoConjuge)
        },
        set (val) {
          this.membro.dataNascimentoConjuge = this.$store.getters.formatDate(val)
        }
      },
      inputDataCongregacao: {
        get () {
          return this.$store.getters.parseDate(this.membro.dataCongregacao)
        },
        set (val) {
          this.membro.dataCongregacao = this.$store.getters.formatDate(val)
        }
      }
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
        membro: {
          id: null,
          nome: '',
          sexo: '',
          endereco: '',
          cep: '',
          telefoneResidencial: '',
          telefoneComercial: '',
          telefoneCelular: '',
          nomePai: '',
          nomeMae: '',
          estadoCivil: '',
          nomeConjuge: '',
          conjugeEvangelico: '',
          conjugeIgreja: '',
          filhos: null,
          dataNascimentoConjuge: '',
          dataBatismo: '',
          dataNascimento: '',
          dataCongregacao: '',
          cargo: '',
          envelope: '',
          categoria: ''
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
      submit () {
        return this.$validator.validateAll().then((result) => {
          if (!result) {
            return false
          }

          this.isSubmiting = true

          let data = Object.assign({}, this.membro)
          let datas = ['dataCongregacao', 'dataNascimento', 'dataNascimentoConjuge', 'dataBatismo']

          datas.forEach((item) => {
            if (data[item] === null || data[item].length < 10) {
              return
            }

            let dt = data[item].split('/')

            data[item] = dt[2].padStart(4, 0) + '-' + dt[1].padStart(2, 0) + '-' + dt[0].padStart(2, 0)
          })

          var vm = this

          return apiClient.post('/membro/pessoa' + (this.membro.id > 0 ? '/' + data.id : ''), data).then((response) => {
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
      if (!(this.id > 0)) {
        return
      }
      apiClient.get('/membro/pessoa/' + this.id).then(({data}) => {
        const filhos = []
        const newData = {}

        new Map(Object.entries(data)).forEach((item, key) => {
          if (key.indexOf('data') >= 0 && item !== null) {
            item = this.$store.getters.formatDate(item.date)
          } else if (new RegExp(/^(nomeFilho|idadeFilho)/i).test(key)) {
            let idx = parseInt(key.replace(/[^0-9]+/, '')) - 1
            let newKey = key.substring(0, key.indexOf('Filho'))

            if (!filhos[idx]) {
              filhos[idx] = {id: idx}
            }

            filhos[idx][newKey] = item
          }

          newData[key] = item
        })

        newData.filhosArray = filhos.length > 0 ? filhos : this.filhosArray

        this.membro = newData
      })
    }
  }
</script>

<style scoped>

</style>
