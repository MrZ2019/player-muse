<template>
  <mu-dialog :open="dialog" title="新建" @close="close">
     <mu-text-field label="名称" fullWidth v-model="listName"/>
<mu-select-field v-model="groupIndex" :labelFocusClass="['label-foucs']" label="选择分组">
    <mu-menu-item v-for="item,index in groupList" :key="index" :value="index" :title="item.name" />
  </mu-select-field>
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
        groupIndex: 0,
      }
    },
    computed:{
      ...mapState(['groupList'])
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
      finish() {
        if (this.isRename) {
          this.dialog = false;
          this.renamePlayList(this.listName);
          alert('成功')
          return
        }
        this.$store.commit('addPlayList', [this.listName, this.groupIndex]);
        this.dialog = false;
        alert('添加成功')
      },
    }
  }
</script>

<style>
</style>
