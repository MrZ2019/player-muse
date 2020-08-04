
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
  allList: [],
  curListIndex: -1,
  msg: 'Hello',
  isAll: false,
  lyric: `[ti:你听得到]
[ar:周杰伦]
[al:叶惠美]
[00:03.00]
[00:06.00]周杰伦
[00:10.00]HandsomeCK制作
[00:14.00]
[00:17.71]有谁能比我知道
[00:22.43]你的温柔像羽毛
[00:26.48]秘密躺在我怀抱
[00:30.57]只有你能听得到
[00:34.85]还有没有人知道
[00:38.94]你的微笑像拥抱
[00:42.97]多想藏着你的好
[00:47.14]只有我看得到
[00:50.71]站在屋顶只对风说不想被左右
[00:58.22]本来讨厌下雨的天空
[01:02.40]直到听见有人说爱我
[01:07.18]坐在电影院的二楼看人群走过
[01:14.56]怎么那一天的我们
[01:18.70]都默默地微笑很久
[01:22.66]
[01:23.67]我想我是太过依赖
[01:28.32]在挂电话的刚才
[01:32.52]坚持学单纯的小孩
[01:36.65]静静看守这份爱
[01:40.71]知道不能太依赖
[01:44.82]怕你会把我宠坏
[01:48.89]你的香味一直徘徊
[01:53.63]我舍不得离开
[01:57.26]
[01:58.94]比我知道
[02:01.13]你的温柔像羽毛
[02:05.35]秘密躺在我怀抱
[02:09.44]@·#￥%……*&amp;amp;$
[02:13.61]还有没有人知道
[02:17.77]你的微笑像拥抱
[02:21.82]多想藏着你的好
[02:25.96]只有我看得到
[02:29.49]坐在电影院的二楼看人群走过
[02:37.02]怎么那一天的我们
[02:41.28]都默默地微笑很久
[02:45.01]
[02:46.04]我想我是太过依赖
[02:50.66]在挂电话的刚才
[02:54.75]坚持学单纯的小孩
[02:58.96]静静看守这份爱
[03:03.02]知道不能太依赖
[03:07.19]怕你会把我宠坏
[03:11.28]你的香味一直徘徊
[03:16.13]我舍不得离开
[03:18.99]我想我是太过依赖
[03:23.53]在挂电话的刚才
[03:27.67]坚持学单纯的小孩
[03:32.59]我舍不得离开
[03:37.42]`,
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

    state.isAll = true;
  },
  changeListRandom(state, index) {

    state.curListIndex = index;
    state.isAll = false;
  },

  setLyric(state, lyric) {
  
    state.lyric = lyric;
  }

}

export default new Vuex.Store({
  state, mutations
})
