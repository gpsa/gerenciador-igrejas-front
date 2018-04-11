<template>

</template>

<script>
  export default {
    created () {
      this.$store.dispatch('logout')
      this.$router.replace('/signin')
    }
  }
</script>