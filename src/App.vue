<template>
  <div id="app">
    <mu-appbar title="首页">
      <mu-icon-button icon="menu" slot="left" @click.native="open = true" />
      <mu-icon-button icon="refresh" slot="right"  @click='refresh' v-show="!isStar"/>
      <mu-icon-button :icon="icon" slot="right"  @click='goStar'/>
      <mu-icon-menu icon="more_vert" slot="right">
        <mu-menu-item title="菜单 12" />
        <mu-menu-item title="菜单 2" />
        <mu-menu-item title="菜单 3" />
        <mu-menu-item title="菜单 4" />
        <mu-menu-item title="退出" @click.native="quit" />
      </mu-icon-menu>
    </mu-appbar>

    <div class="main-slot">

      <keep-alive>
      <router-view></router-view>
      </keep-alive>

    </div>

    <mu-drawer :open="open" :docked="docked" @close="toggle()">
      <mu-list @itemClick="docked ? '' : toggle()">
        <mu-list-item title="Menu Item 1"/>
        <mu-list-item title="Menu Item 2"/>
        <mu-list-item title="Menu Item 3"/>
        <mu-list-item v-if="docked" @click.native="open = false" title="Close"/>
      </mu-list>
    </mu-drawer>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      docked: false,
      open: false,
      icon: 'star',
      isStar: false
    }
  },
  watch: {
    '$route.path'(newVal, oldVal) {
      if(newVal !== '/star') {
        this.icon = 'star_outline'
        this.isStar = false;
      } else {
        this.icon = 'star';
        this.isStar = true
      }
    }
  },
  methods: {

    toggle() {
      this.open = !this.open
    },

    playMusic() {
      if (this.icon == 'tv') {
        this.icon = 'android'
        window.Hub.$emit('play-music')

      }else {
        this.icon = 'tv'
        window.Hub.$emit('stop-music')
      }
    },

    goStar() {
      this.$router.push(this.$route.path == "/star" ?  '/' : '/star')
    },

    refresh() {
      window.Hub.$emit('refresh')
    },
    
    quit() {
      callplus("quit")
    },
  }
}

</script>
<style lang='scss'>
#app {
  .mu-appbar {
    position: fixed;
    top: 0;
  }

  .main-slot {
    margin-top: 56px;
  }

}


</style>
