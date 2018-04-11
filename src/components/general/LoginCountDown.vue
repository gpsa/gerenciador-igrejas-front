<template>
    <span v-if="token">
        <span class="hidden-sm-and-down">Tempo restante da sessão:</span>
        <b>{{sessionTimeout}}</b>
    </span>
</template>

<script>
  export default {
    name: 'login-count-down',
    data () {
      return {
        sessionTimeout: null,
        counter: null
      }
    },
    props: [
      'token'
    ],
    watch: {
      token: {
        handler: function (val, oldVal) {
          this.startTimeoutClock()
        }
      }
    },
    mounted () {
      this.startTimeoutClock()
    },
    methods: {
      startTimeoutClock () {
        const vm = this

        if ((!this.counter || !this.sessionTimeout) && this.token && this.token.startDate) {
          this.counter = setInterval(() => {
            if (!vm.token || !vm.token.startDate) {
              this.sessionTimeout = null
              return clearInterval(this.counter)
            }

            let deadline = Math.trunc(Date.parse(vm.token.startDate) / 1000) + vm.token.expires_in
            let now = Math.trunc((new Date()).getTime() / 1000)
            let diff = deadline - now

            let dias = Math.trunc(diff / 60 / 60 / 24) + 'd'
            let horas = (Math.trunc(diff / 60 / 60) % 24) + 'h'
            let minutos = (Math.trunc(diff / 60) % 60) + 'm'
            let segundos = (Math.trunc(diff) % 60) + 's'

            vm.sessionTimeout = `${dias} ${horas} ${minutos} ${segundos}`
          }, 1000)
        } else if (!this.token || !this.token.expires_in) {
          this.sessionTimeout = null
          clearInterval(this.counter)
        } else {
          console.log('ruim', this.token, this.counter, this.sessionTimeout)
        }
      }
    }
  }
</script>

<style scoped>

</style>