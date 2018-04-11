import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

// Componentes
const Sigin = () => import('@/components/general/Sigin')
const Logout = () => import('@/components/general/Logout')
const NotFound = () => import('@/components/general/NotFound')
const HelloWorld = () => import('@/components/general/HelloWorld')
// Membros
const Membros = () => import('@/components/membros/Membros')
const MembrosIndex = () => import('@/components/membros/MembrosIndex')
const MembrosForm = () => import('@/components/membros/MembrosForm')
// Dizimos
const Dizimos = () => import('@/components/dizimos/Dizimos')
const DizimosIndex = () => import('@/components/dizimos/DizimosIndex')
const DizimosMembro = () => import('@/components/dizimos/DizimosMembro')
const DizimosForm = () => import('@/components/dizimos/DizimosForm')
// Usuários
const Usuarios = () => import('@/components/usuarios/Usuarios')
const UsuariosIndex = () => import('@/components/usuarios/UsuariosIndex')
const UsuariosForm = () => import('@/components/usuarios/UsuariosForm')
// Relatórios
const RelatoriosIndex = () => import('@/components/relatorios/Index')
const RelatoriosAniversariantes = () => import('@/components/relatorios/Aniversariantes')
const RelatoriosDizimos = () => import('@/components/relatorios/Dizimos')

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/', name: 'Home', component: HelloWorld, meta: {auth: true}
    },
    {
      path: '/membros',
      component: Membros,
      meta: {title: 'Membros'},
      children: [
        {
          path: '', name: 'Membros', component: MembrosIndex, meta: {auth: true, title: 'Lista'}
        },
        {
          path: ':id', name: 'Membro', component: MembrosForm, props: true, meta: {auth: true, title: 'Formulário'}
        }
      ]
    },
    {
      path: '/dizimos',
      component: Dizimos,
      meta: {title: 'Dízimos'},
      children: [
        {
          path: '', name: 'Dizimos', component: DizimosIndex, meta: {auth: true}
        },
        {
          path: 'membro/:membro_id',
          name: 'dizimos-membro',
          component: DizimosMembro,
          props: true,
          meta: {auth: true},
          children: [
            {
              path: ':dizimo_id', name: 'Membro - Dizimo', component: DizimosForm, props: true, meta: {auth: true}
            }
          ]
        }
      ]
    },
    {
      path: '/usuarios',
      component: Usuarios,
      meta: {title: 'Usuários'},
      children: [
        {
          path: '', name: 'Usuario', component: UsuariosIndex, meta: {auth: true, title: 'Lista'}
        },
        {
          path: ':usuario_id',
          name: 'usuarios-form',
          component: UsuariosForm,
          props: true,
          meta: {auth: true, title: 'Formulário'}
        }
      ]
    },
    {
      path: '/relatorios',
      name: 'Relatorios',
      component: RelatoriosIndex,
      meta: {auth: true},
      children: [
        {
          path: 'aniversariantes',
          name: 'relatorios-aniversariantes',
          component: RelatoriosAniversariantes,
          props: true,
          meta: {auth: true, title: 'Aniversariantes'}
        },
        {
          path: 'dizimos',
          name: 'relatorios-dizimos',
          component: RelatoriosDizimos,
          props: true,
          meta: {auth: true, title: 'Dízimos'}
        }
      ]
    },
    {
      path: '/signin', name: 'Login', component: Sigin, meta: {auth: false}
    },
    {
      path: '/logout', component: Logout, meta: {auth: true}
    },
    {path: '*', name: '', component: NotFound}
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.auth && store.state.token === null) {
    return next('/signin')
  } else {
    let path = []
    to.matched.forEach((item) => {
      let curpath = (item.meta.title ? item.meta.title : item.name)

      if (curpath && curpath.length > 0) {
        path.push(curpath)
      }
    })

    store.commit('setPageTitle', path.join(' - '))

    return next()
  }
})

export default router
