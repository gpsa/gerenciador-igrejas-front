<template>
    <div class="hello">
        <h1>{{ $t('welcome {user}', {'user' : user.displayName}) }}</h1>
    </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'HelloWorld',
    data () {
      return {}
    },
    computed: {
      ...mapState(['user'])
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h1, h2 {
        font-weight: normal;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
