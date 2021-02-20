<template>
  <div class="root">
    <div class="lyric" v-html="lyricHtml" ref="lyricBox">
    </div>
  </div>
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
        return val
      }
    },
    beforeRouteEnter(from, to, next) {
        

       
       next(()=> {
         setTimeout(()=> {
           window.lastExtra && window.scrollLyric(window.lastExtra);
         })
       })
    },
    watch: {
    },
    computed:{

       ...mapState(['lyric']),

       lyricHtml() {
         let list = this.lyric.replace(/\[[^\]]+]/gm, '').split('\n');

         list = list.map((item, index) => {
           return `<div line=${index+1}>` + item + '</div>';
         })

         return list.join('');
       },
    },
    mounted() {
      // this.$forceUpdate()
      window.lyricBox = this.$refs.lyricBox;



    },
    methods: {
    }
  }
</script>

<style>
  .lyric {
    white-space: pre-line;
    word-break: break-all;
    font-size: 16px;
    line-height: 28px;

    color: #777;
    text-align: center;

  }

  .lyric div {
    /* transition: font-size .5s; */
  }
/*  .active {
    color: red;
  } */

  .lyric .active {
    font-size: 20px;
  }
</style>
