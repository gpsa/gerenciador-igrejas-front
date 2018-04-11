<template>
    <div>
        <v-dialog v-model="open" persistent max-width="290">
            <v-card>
                <v-card-title class="headline">{{$t(title)}}</v-card-title>
                <v-card-text>
                    {{$t(message)}}
                    <slot></slot>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn v-if="showCancel" color="red darken-1" flat @click.native="$emit('closeCancel')">{{$t('Cancel')}}</v-btn>
                    <v-btn v-if="showOk" color="green darken-1" flat @click.native="$emit('close')">{{$t('OK')}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
  export default {
    name: 'MyDialog',
    props: {
      showCancel: {
        type: Boolean,
        default: false
      },
      showOk: {
        type: Boolean,
        default: true
      },
      title: {},
      message: {},
      open: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style scoped>

</style>