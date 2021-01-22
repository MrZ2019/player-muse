<template>
  <div class="lyric">{{lyric | l}}</div>
</template>

<script>

  import {mapState} from 'vuex'
  export default {
    data() {
      return {
      }
    },
    filters: {
      l(val) {
        return val.replace(/\[[^\]]+]/gm, '').replace(/\n\s+/gm, '\n\n')
      }
    },
    computed:{
       ...mapState(['lyric'])
    },
    methods: {
    }
  }
</script>

<style>
  .lyric {
    white-space: pre-line;
    word-break: break-all;
    font-size: 18px;
  }
</style>
