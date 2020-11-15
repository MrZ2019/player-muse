<template>
  <div class="bg">
     <div class='text'>透明度</div>
     <mu-slider class="demo-slider" v-model="linear" @change="onSliderChange" :max="max" color='yellow'></mu-slider>
  </div>
</template>

<script>

  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        max: 100,
        linear: 50,
      }
    },
    computed:{
      ...mapState(['bgOpacity'])
    },
    mounted() {
      this.linear = (this.bgOpacity - 0) * 100;
    },
    methods: {
      onSliderChange() {
        // alert(this.linear)
        this.$store.state.bgOpacity = this.linear / 100;
        this.$store.state.settings.bgOpacity = this.$store.state.bgOpacity;

        this.$store.commit('saveSettings');
      },
    }
  }
</script>

<style>
  .bg {
    white-space: pre;
    font-size: 18px;
    padding: 12px;
  }

  .text {
    margin: 8px 0;
  }
</style>
