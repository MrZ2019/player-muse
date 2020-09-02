<template>
  <mu-dialog :open="dialog" title="新建组" @close="close">
     <mu-text-field label="名称" fullWidth v-model="groupName"/>

    <mu-flat-button slot="actions" @click="close" primary label="取消"/>
    <mu-flat-button slot="actions" primary @click="finish" label="确定"/>
  </mu-dialog>
</template>

<script>
  import {mapMutations} from 'vuex';

  export default {
    data() {
      return {
        dialog: false,
        groupName: '',
      }
    },
    computed:{

    },
    methods: {
      ...mapMutations(['renamePlayList']),
      showDialog(isRename) {
        this.dialog = true;
        this.isRename = isRename;

        if (this.isRename) {
          this.groupName = this.$store.state.playlist[this.$store.state.curListIndex].name;
        }
      },

      close() {
        this.dialog = false;
      },
      finish() {
        if (this.isRename) {
          this.dialog = false;
          this.renamePlayList(this.groupName);
          alert('成功')
          return
        }
        this.$store.commit('addGroup', this.groupName);
        this.dialog = false;
        alert('添加成功')
      },
    }
  }
</script>

<style>
</style>
