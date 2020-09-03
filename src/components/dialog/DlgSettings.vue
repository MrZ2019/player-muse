<template>
  <mu-dialog :open="dialog" title="设置" @close="close">
    <mu-flex class="select-control-row">
      <mu-switch v-model="settings.debugMode" :label="'调试模式'"></mu-switch>
    </mu-flex>
    <mu-flex class="select-control-row">
      <mu-raised-button label="本地扫描" class="demo-raised-button" primary @click="goScan"/>
    </mu-flex>

    <mu-flat-button slot="actions" @click="close" primary label="取消"/>
    <mu-flat-button slot="actions" primary @click="finish" label="确定"/>
  </mu-dialog>
</template>

<script>
  import {mapMutations, mapState} from 'vuex';

  export default {
    data() {
      return {
        dialog: false,
        listName: '',

      }
    },
    watch: {
      'settings.debugMode'(val) {
        if (val) {
          window.vConsole = new VConsole();
        } else {
          window.vConsole.destroy();
        }
      }
    },
    mounted() {
      if (this.settings.debugMode) {
        window.vConsole = new VConsole();
      }
    },
    computed:{
      ...mapState(['settings'])
    },
    methods: {
      ...mapMutations(['renamePlayList']),
      showDialog(isRename) {
        this.dialog = true;
        this.isRename = isRename;

        if (this.isRename) {
          this.listName = this.$store.state.playlist[this.$store.state.curListIndex].name;
        }
      },

      close() {
        this.dialog = false;
      },
      goScan() {
        this.$router.push('/scan')
        this.dialog = false;
      },

      finish() {
        this.$store.commit('saveSettings', this.settings);
        this.dialog = false;

      },
    }
  }
</script>

<style>
  .select-control-row {
    display: block;
  }
</style>
