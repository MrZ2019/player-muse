<template>
  <mu-dialog :open="dialog" title="分组列表" >
      <div slot="title" class="title-box">
        <span class="title-text">分组列表</span>
        <mu-icon value="clear" color="gray" @click="close" />
      </div>
      <mu-list @change="handleChange">
        <mu-list-item :title2="item.name" v-for="(item,index) in groupList" :value="index">
           <span class="text">{{item.name}}</span>
           <mu-icon value="remove_circle" color="gray" @click.stop="remove(index)" v-show="index !== 0"/>
           <mu-icon value="create" color="gray" @click.stop="rename(index, item)" v-show="index !== 0"/>
        </mu-list-item>
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
       ...mapState(['groupList'])
    },
    methods: {
      handleChange(index) {

        if (this.flag === 'move-list') {
          this.$store.commit('moveCurList', {index})
        } else {
          this.$store.commit('changeCurListGroup', {index, item: this.selectedItem})
        }
         
        this.dialog = false;
      },

      showDialog(flag) {
        this.dialog = true;
        this.flag = flag;
      },

      close() {
        this.dialog = false;
      },

      remove(index) {
        let r = confirm('确认删除此分组 ?')

        if (r) {
          this.$store.commit('removeGroup', index)
        }
      },

      rename(index, item) {
        let newName = prompt('', item.name)


         // return newName;
        if (newName) {
          this.$store.commit('renameGroup', {index, newName})
        }
      }

    }
  }
</script>

<style>

  .title-box {
    display: flex;
    width: 100%;
    align-items: center;

    justify-content: space-between;
  }

  .text, .mu-icon {
    display: inline-block;
    vertical-align: middle;
    /* font-size: 24px; */
  }

  .mu-icon {
    float: right;
  }
</style>
