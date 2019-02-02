<template>
  <v-app id="inspire">
    <v-navigation-drawer
      fixed
      v-model="drawer"
      app
      v-if="menuCount"
    >
      <v-list dense>
        <template v-for="(item, i) in menu">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="i"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
          </v-layout>
          <v-divider
            dark
            v-else-if="item.divider"
            class="my-4"
            :key="i"
          ></v-divider>
          <v-list-group v-else-if="item.children" v-model="item.model" no-action>
            <v-subheader inset>Files</v-subheader>
            <v-list-tile slot="item" @click="">
              <v-list-tile-action>
                <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
              router v-bind:to="child.action"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else router v-bind:to="item.action">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="indigo" dark fixed app>
      <v-toolbar-side-icon @click.stop="drawer = !drawer" v-if="menuCount>0"></v-toolbar-side-icon>
      <v-toolbar-title>{{appName.toUpperCase()}}{{pageTitle ? ' - ' + pageTitle : ''}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <login-count-down :token="token"/>
    </v-toolbar>
    <v-content>
      <v-container fill-height>
        <v-layout row wrap justify-center align-center>
          <router-view></router-view>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="indigo" app>
      <span class="white--text">&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
  import {mapState} from 'vuex'
  import LoginCountDown from '@/components/general/LoginCountDown'

  export default {
    components: {LoginCountDown},
    data: () => ({
      drawer: false,
      items: [
        {icon: 'home', text: 'Início', action: '/', auth: true},
        {icon: 'contacts', text: 'Dízimos', action: '/dizimos', auth: true},
        {icon: 'people', text: 'Membros', action: '/membros', auth: true},
        {icon: 'account_box', text: 'Usuários', action: '/usuarios', auth: true},
        {heading: 'RELATÓRIOS'},
        {text: 'Aniversariantes', action: '/relatorios/aniversariantes', auth: true},
        {text: 'Dízimos', action: '/relatorios/dizimos', auth: true},
        {divider: true},
        {icon: 'settings', text: 'Configurações da Conta', action: '/usuarios/me', auth: true},
        {icon: 'lock', text: 'Sair', action: '/logout', auth: true}
      ]
    }),
    computed: {
      ...mapState({
        token: state => state.token,
        pageTitle: state => state.pageTitle,
        appName: state => state.appName
      }),
      menu() {
        const vm = this

        return this.items.filter(function (item) {
          return !item.auth || (item.auth && vm.token !== null)
        })
      },
      menuCount() {
        return this.menu.filter((value) => !value.divider).length
      }
    },
    props: {
      source: String
    }
  }
</script>
