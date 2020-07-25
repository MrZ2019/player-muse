<template>
  <mu-dialog :open="dialog" title="播放列表" @close="close">
      <mu-list @change="handleChange">
        <mu-list-item :title="item.name" v-for="(item,index) in playlist" :value="index"/>
      </mu-list>
  </mu-dialog>
</template>

<script>

  import {mapState} from 'vuex'
  export default {
    data() {
      return {
        dialog: false,
        selectedItem: '',
      }
    },
    computed:{
       ...mapState(['playlist'])
    },
    methods: {
      handleChange(index) {
        this.$store.commit('addItemToList', {index, item: this.selectedItem})
        this.dialog = false;
      },

      showDialog(item) {
        this.dialog = true;
        this.selectedItem = item;
      },

      close() {
        this.dialog = false;
      },
    }
  }
</script>

<style>
</style>
