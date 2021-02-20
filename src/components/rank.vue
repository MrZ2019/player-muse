<template>
  <div class="rank container">
    <mu-list ref="mp3List">
      <mu-list-item  v-for="(item,index) in rankList" :value="index"  :class="{active: curIndex == index}">
        <span class="title" @click="play(item.name, index)">{{item.name}}</span>
        <span class="count">{{item.count}}次</span>
      </mu-list-item>
    </mu-list>

    <player ref="myplayer"></player>
  </div>
</template>

<script>

  import {mapState} from 'vuex'
  import player from './player';
  export default {
    data() {
      return {
        curIndex: -1,
      }
    },
    components: {player},
    computed:{
       ...mapState(['rankList'])
    },
    mounted() {
        this.rankList = this.rankList.sort((a, b) => {
          return b.count - a.count;
        })
    },
    methods: {

      play(name, index, isFromStart, isReplay) {

        this.curIndex = index;
        this.$refs.myplayer.play.apply(this.$refs.myplayer, arguments)

      }
    }
  }
</script>

<style lang='scss' scoped>
  .container {
    position: fixed;
    top: 64px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;


    .mu-list {
      min-height: 65%;
      max-height: 65%;
    }
   }

  .rank {
    /* white-space: pre; */
    font-size: 14px;
  }
  .title {
    float: left;
  }
  .count {
    float: right;
  }


</style>
