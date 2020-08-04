<template>
  <div class="lyric">
    {{lyric}}
  </div>
</template>

<script>

  import {mapState} from 'vuex'
  export default {
    data() {
      return {
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
    white-space: pre;
    font-size: 18px;
  }
</style>
