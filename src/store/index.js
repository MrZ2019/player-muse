
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  playlist: [
    {
      name: '东西',
      list: []
    }
  ],
  curListIndex: -1,
  msg: 'Hello'
}

const mutations = {
  getPlayList(state) {
     let list = localStorage.getItem('playlist');

     if (list) {
       state.playlist = JSON.parse(list);
     }
  },
  addPlayList(state, name) {
    let newItem = {
      name: name,
      list: []
    }

    state.playlist.push(newItem);

    localStorage.setItem('playlist', JSON.stringify(state.playlist));
  },
  removePlayList(state ) {

    state.playlist.splice(state.curListIndex, 1)
    
    state.curListIndex = -1;

    localStorage.setItem('playlist', JSON.stringify(state.playlist));
  },
  addItemToList(state, {index, item}) {
    state.playlist[index].list.push({
      name: item,
    });

    localStorage.setItem('playlist', JSON.stringify(state.playlist));
  },
  changeList(state, index, item) {

    state.curListIndex = index;
  }
}

export default new Vuex.Store({
  state, mutations
})
