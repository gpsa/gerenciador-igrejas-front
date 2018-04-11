<template>
    <div>
        <div v-if="!Array.isArray(validations)" v-for="(error,id) in validations">
            {{$t('Verify the field name')}}: <b>{{id | capitalize}}</b>
            <template v-for="item in error">
                <v-alert :item="item" outline color="error" icon="warning" :value="true">- {{item}}</v-alert>
            </template>
        </div>
        <div v-else>
            <v-alert v-for="item in validations" :item="item" outline color="error" icon="warning" key="item"
                     :value="true">
                {{item}}
            </v-alert>
        </div>
    </div>
</template>

<script>
  export default {
    props: {
      'validations': {
        type: [Array, Object]
      }
    },
    name: 'api-validation-messages'
  }
</script>