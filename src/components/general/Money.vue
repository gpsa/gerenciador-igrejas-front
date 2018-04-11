<template>
    <!--<v-text-field-->
    <!--ref="input"-->
    <!--:label="label"-->
    <!--align-right-->
    <!--v-model="value | teste"-->
    <!--@input="updateItem"-->
    <!--/>-->
    <div>
        <label v-if="label">{{ label }}</label>
        <input v-model="value | currency" v-on:focus="selectAll"
        >
    </div>
</template>

<script>
  export default {
    props: {
      value: {
        type: Number,
        default: 0,
        twoWay: true
      },
      label: {
        type: String,
        default: ''
      }
    },
    filters: {
      currency: {
        read: function (value) {
          return '$' + value.toFixed(2)
        },
        write: function (value) {
          var number = +value.replace(/[^\d.]/g, '')
          return isNaN(number) ? 0 : number
        }
      }
    },
    methods: {
      selectAll: function (event) {
        // Workaround for Safari bug
        // http://stackoverflow.com/questions/1269722/selecting-text-on-focus-using-jquery-not-working-in-safari-and-chrome
        setTimeout(function () {
          event.target.select()
        }, 0)
      }
    }
  }
</script>
