
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
  isAll: true,
  isSortMode: false,
  isMultiMode: false,
  isAlbumMode: false,
  isSingerMode: false,
  curSinger: '',
  isFromList: false,
  curAlbum: {
    list: [],
  },
  settings: {},
  musicDirectory: '/storage/emulated/0/netease/cloudmusic/music/',

  allSongs: [],
  allAlbums: [],
  allSingers: [],

  allAlbums2: [],

  groupList: [],

  curGroupIndex: 0,
  curGroup: {},

  imageData: '',

  bgOpacity: .5,
  rankList: [],
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
[03:23.53]在挂电话的刚才s
[03:27.67]坚持学单纯的小孩
[03:32.59]我舍不得离开
[03:37.42]`,
}

const actions = {
  getAllAlbums() {
    return new Promise(function (resolve) {
      window.DB.exec('SELECT * FROM albums', null, (data)=> {
        resolve(data);
      })
    })
  }
}
const mutations = {
  setImage(state, data) {
    state.imageData = data

    localStorage.setItem('imageData', data);
  },
  getImage(state) {
    let data = localStorage.getItem('imageData');

    if (data) {
      state.imageData = data;
    }
  },

  getRank(state) {
    let data = localStorage.getItem('rankList');

    if (data) {
      state.rankList = JSON.parse(data);
    }
  },

  getAllSongs(state) {

    window.DB.exec('SELECT * FROM songs', null, (data)=> {
      state.allSongs = data;
    })

  },
  getSinger(state, name) {
    state.curSinger = name;
    window.DB.exec(`SELECT * FROM songs LEFT JOIN singers on
     songs.singer_id=singers.id WHERE singers.name=?
     group by songs.id`, [name], (data)=> {
    state.singerSongs = [];

    for (let i = 0; i < data.length; i++) {
      let item = data[i]

      state.singerSongs.push({
        name: item.filename
      })
      }
      state.isSingerMode = true;
      state.isAlbumMode = false;
    })

  },
  getAlbum(state, name) {
    state.curSinger = name;
    state.isAlbumMode = true;
    state.isSingerMode = false;

    window.DB.exec(`SELECT * FROM songs LEFT JOIN albums on
     songs.album_id=albums.id WHERE albums.title=?
     group by songs.id`, [name], (data)=> {

    state.curAlbum.list = [];

    for (let i = 0; i < data.length; i++) {
      let item = data[i]

      state.curAlbum.list.push({
        name: item.filename
      })

      Vue.set(state.curAlbum, 'title', name)

    }
    })

  },

  getAllSingers(state) {

    window.DB.exec('SELECT * FROM singers', null, (data)=> {
      state.allSingers = data;
    })

  },

  getAllAlbums(state) {

    window.DB.exec('SELECT id, title FROM albums', null, (data)=> {
      state.allAlbums = data;
    })

  },



  setAlbum(state, data) {
    state.isAlbumMode = true;
    state.isSingerMode = false;

    state.curAlbum.list = [];

    for (let i = 0; i < data.list.length; i++) {
      let item = data.list[i]

      state.curAlbum.list.push({
        name: item.filename
      })

      Vue.set(state.curAlbum, 'title', data.title)

    }

  },
  getPlayList(state) {
     let list = localStorage.getItem('playlist');

     if (list) {
       state.playlist = JSON.parse(list);
     }
  },
  getGroup(state) {
     let list = localStorage.getItem('groupList');

     if (list) {
       state.groupList = JSON.parse(list);
     }

     if (state.groupList.length === 0 || state.groupList[0].playlist)
     state.groupList.unshift({
       name: '默认分类'
     })
  },

  addPlayList(state, [name, groupIndex]) {
    let newItem = {
      name: name,
      list: []
    }
   groupIndex -= 0;
    if (groupIndex === 0) {

      state.playlist.push(newItem);

      localStorage.setItem('playlist', JSON.stringify(state.playlist));
    } else {
      state.groupList[groupIndex].playlist.push(newItem);

      localStorage.setItem('groupList', JSON.stringify(state.groupList));
    }

  },
  addGroup(state, name) {
    let newItem = {
      name: name,
      playlist: []
    }

    state.groupList.push(newItem);

    localStorage.setItem('groupList', JSON.stringify(state.groupList));
  },

 savePlayList(state) {


    localStorage.setItem('playlist', JSON.stringify(state.playlist));
  },
 saveGroupList(state) {


    localStorage.setItem('groupList', JSON.stringify(state.groupList));
  },

  getSettings(state) {
     let settings = localStorage.getItem('settings');

     if (settings) {
       state.settings = JSON.parse(settings);

       state.curGroupIndex = state.settings.curGroupIndex || 0

       state.curListIndex = state.settings.curListIndex || -1;

       state.bgOpacity = state.settings.bgOpacity || .5;
       state.settings.rankTimeout = state.settings.rankTimeout || 15;

     }

  },

 saveSettings(state, settings) {


    localStorage.setItem('settings', JSON.stringify(state.settings));
  },

 removeSong(state, item) {

    let list = (state.curGroupIndex - 0 === 0) ? state.playlist[state.curListIndex].list : state.groupList[state.curGroupIndex].playlist[state.curListIndex].list;

    for (let index = 0; index < list.length; index++) {
      const element = list[index];

      if (element.name === item) {
        list.splice(index, 1);
        break;
      }
    }


    localStorage.setItem('playlist', JSON.stringify(state.playlist));
     localStorage.setItem('groupList', JSON.stringify(state.groupList));
  },
 removeGroup(state, index) {
    state.groupList.splice(index, 1);
    state.curGroupIndex = 0;

    state.settings.curGroupIndex = state.curGroupIndex;

    localStorage.setItem('groupList', JSON.stringify(state.groupList));
  },

  removePlayList(state, [index, curGroupIndex]) {

    index = index || state.curListIndex;
    curGroupIndex = curGroupIndex || state.curGroupIndex
    curGroupIndex -= 0;
    if (curGroupIndex === 0) {
      state.playlist.splice(index, 1)
      mutations.savePlayList(state)
    } else {
      state.groupList[curGroupIndex].playlist.splice(index, 1);
      mutations.saveGroupList(state)
    }

    if (curGroupIndex === state.curGroupIndex) {
      state.curListIndex = -1;
    }

    state.settings.curListIndex = state.curListIndex;

    mutations.saveSettings(state);

  },
  renamePlayList(state, name) {
    // alert(name)
    state.playlist[state.curListIndex].name = name;

    localStorage.setItem('playlist', JSON.stringify(state.playlist));
  },
  renameGroup(state, {newName, index}) {
    // alert(name)
    state.groupList[index].name = newName;

    localStorage.setItem('groupList', JSON.stringify(state.groupList));
  },

  addItemToList(state, {curGroupIndex, index, item}) {

    let checkExist = (list, item)=> {
      let exist = false;
      for (let i = 0; i < list.length; i++) {
        let e = list[i];

        if (e.name === item) {
          exist = true;
          break;
        }
      }

      return exist;
    }

    let _list;

    if ((curGroupIndex - 0) === 0) {
      // alert(index)
      _list = state.playlist[index].list;


       // alert(3)
      if (checkExist(_list, item)) {
        alert('歌曲已存在')
        return;
      }
      _list.push({
        name: item,
      });

      localStorage.setItem('playlist', JSON.stringify(state.playlist));
    } else {
      _list = state.groupList[curGroupIndex].playlist[index].list;


      if (checkExist(_list, item)) {
        alert('歌曲已存在')
        return;
      }
      _list.push({
        name: item,
      });

      localStorage.setItem('groupList', JSON.stringify(state.groupList));

      // alert(233)
    }
  },
  changeList(state, index, item) {
    state.isAlbumMode = false;
    state.isSingerMode = false;
    state.curListIndex = index;

    state.settings.curListIndex = index;

    mutations.saveSettings(state, state.settings);

    state.isAll = true;
  },
  changeCurListGroup(state, {index, item}) {
    state.curGroupIndex = index;
    state.curListIndex = - 1;

    state.settings.curGroupIndex = index;
    state.settings.curListIndex = -1;

    mutations.saveSettings(state, state.settings);

    state.curGroup = item;
  },
  moveCurList(state, {index}) {
    let origin;
    let originList;

   // alert(1)
    if (state.curGroupIndex === 0) {
      origin = state.playlist[state.curListIndex]
      originList = state.playlist;
    } else {
      origin = state.groupList[state.curGroupIndex].playlist[state.curListIndex]
      originList = state.groupList[state.curGroupIndex].playlist;
    }

    if (index === 0) {
      state.playlist.push(origin);
      originList.splice(state.curListIndex, 1)

    } else {
      state.groupList[index].playlist.push(origin)

      originList.splice(state.curListIndex, 1)

    }
      mutations.savePlayList(state);
      mutations.saveGroupList(state);
    state.curListIndex = - 1;

  },
  changeListRandom(state, index) {

    state.curListIndex = index;
    state.isAll = false;
  },

  setLyric(state, lyric) {

    state.lyric = lyric;
  },

  addRank(state, obj) {
    let find = false;

    for (let i = 0; i < state.rankList.length; i++) {
      let item = state.rankList[i];

      if (item.name == obj.name) {
        item.count++;
        find = true;
        break;
      }
    }

    if (find === false) {
      state.rankList.push({
        name: obj.name,
        count: 1
      })

      state.rankList = state.rankList.sort((a, b) => {
        return b.count - a.count;
      })
    }

    localStorage.setItem('rankList', JSON.stringify(state.rankList));
  }

}

export default new Vuex.Store({
  state, mutations,  actions,
})
