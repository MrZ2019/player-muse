<template>
  <div class="player">
    <div class="cover-box">
      <div class="top-box">
        <img :src="cover" alt="" @click="openCover" class="rotate" :class="{paused: isPause}">
        <mu-icon :size="36" :color="iconColor" :value="playIcon" @click="togglePlay" v-show="curIndex !== -1 || isPlay"></mu-icon>
        <mu-icon :size="28" :color="iconColor" value="child_care" @click="locate" v-show="curIndex !== -1"></mu-icon>
      </div>
      <div class="right-box">
        <div class="curr">{{curr}}</div>
        <mu-slider class="demo-slider" v-model="linear" @change="onSliderChange" :max="max" color='yellow'></mu-slider>
        <div class="total">{{total}}</div>
      </div>
    </div>
    <div class="lrc">{{curLrcLine}}</div>




    <mu-dialog width="360" transition="slide-bottom" :open="openFullscreen" @close="close">
      <div class="title">{{albumTitle}} - {{tags.artist}}</div>
      <div class="big-cover-box">
        <img :src="cover" alt="">
      </div>
    </mu-dialog>
  </div>
</template>

<script>
  import {
    mapState
  } from 'vuex'

  export default {
    data() {
      return {

        cover: '',
        albumTitle: '',
        tags: {},

        linear: 50,

        total: '',
        max: 100,
        curr: '',
        openFullscreen: false,
        playIcon: 'play_arrow',

        isPlay: false,
        enabled: true,
        lastTags: {},
        curLrcLine: '',
      }
    },
    watch: {
      search(val) {


      }
    },
    computed: {
      ...mapState(['settings','musicDirectory', 'lyricMap',
      ]),
      // curPlayList() {

      // },
      iconColor() {
        return this.$parent.$parent.themeColor;
      },

    },
    components: {
    },
    mounted() {

      this.iconColor = window.theme;

      let self = this

      window.$Player = self;

      self.db = window.DB;

    },
    filters: {
      limit(list) {
        return list.slice(0, 50)
      },
    },
    methods: {

      togglePlay() {
        this.play(this.name, this.curIndex);

      },
      locate() {
        this.$parent.$refs.mp3List.$el.querySelector('.active').scrollIntoView()
      },
      close() {
        this.openFullscreen = false;
      },
      openCover() {
        this.openFullscreen = true;
      },
      onSliderChange(isStart) {
        let self = this;
        this.linear = parseInt(this.linear - 0);
        // alert(this.linear)
        // clearTimeout(this.startSlideHandle);

        this.startSlideHandle = setTimeout(() => {
          if (isStart !== true)
          callplus('seek', [this.linear], function(data) {
            // alert(this.linear)
            window.myLrc.play();
            window.myLrc.seek(data.data.pos * 1000);

            if (self.isPause) {
              window.myLrc.pauseToggle()
            }
            
          })

          if (!self.isPause)
          this.startSlide();
        }, 1000)

      },
      startSlide() {
        this.stopSlide();
        this.sliderHandle = setInterval(() => {
          this.linear += 1;

          this.curr = window.formatTime(this.linear);

          if (this.curr === this.total) {
            this.stopSlide();
            this.isPause = true;
            this.linear = 0;
            this.curr = window.formatTime(this.linear);
            this.playIcon = 'play_arrow'

          }
        }, 1000)
      },
      stopSlide() {
        clearInterval(this.sliderHandle);
      },

      rankHandle() {
        this.curSongTimer++;

        if (this.curSongTimer >= this.settings.rankTimeout) {
          this.stopRankTimer();
        }
      },
      startRankTimer() {
        this.curSongTimer = 0;
        this.rankTimer = setInterval(this.rankHandle, 1000)
        this.isRankTimerStop = false;
      },
      resumeRankTimer() {
        this.rankTimer = setInterval(this.rankHandle, 1000)
      },
      pauseRankTimer() {
        clearInterval(this.rankTimer);
      },
      stopRankTimer() {
        clearInterval(this.rankTimer);
        this.isRankTimerStop = true;

        if (this.curSongTimer >= this.settings.rankTimeout) {
          this.$store.commit('addRank', {name: this.name})
        }

        this.curSongTimer = 0;
      },

      getLyricFromLocal(name, cb) {
        let self = this;
          let p = [name]

          getLyric(p);

          function getLyric(params) {

            // alert(params)

            self.db.exec(`SELECT * FROM lyric WHERE name=?`,
            params, (row)=> {
              console.log(row)
              
              setTimeout(() => {
                let data = row[0].content
                self.$store.commit('setLyric', data)

                if (window.myLrc) {
                   window.myLrc.stop();
                }
                window.myLrc = new Lrc(data, outputHandler);

//定义歌词输出处理程序
                  function outputHandler(line, extra){
                    self.curLrcLine = line;
                  }

                  cb && cb()
                
              }, 500)
            });
          }   
      },

      getLyric(name) {
        let self = this;
        try {
          let song = name.split('-');
          let singer = song[0];

          if (song[1]) {
            song = song[1].trim();
            let index = song.indexOf('.');
            song = song.slice(0, index)
          }


          this.$axios.get(this.$apis.lyric + song + '/' + singer).then((res) => {
            res = res.data;
            if (res.result[0]) {
              let s = res.result[0].lrc;

              let index = s.indexOf('/lrc/')

              let lrc = s.slice(index + 4);


              this.$axios.get(this.$apis.lrc + lrc).then((res) => {

                // this.$store.commit('setLyric', res.data)

                  let p = [name, res.data]

                  insertLyric(p);

                  function insertLyric(params) {

                    self.db.exec(`INSERT INTO lyric (name, content) VALUES( ?,?)`,
                    params, (data)=> {
                      window.$V.message2('歌词下载成功')
                      
                      setTimeout(() => {
                        self.$store.commit('getAllLyrics')

                        setTimeout(() => {
                          window.$Mp3List.$forceUpdate();
                        }, 500)
                        
                      }, 500)
                    });
                  }      


              }).catch((e) => {
                // alert(e)
              })

            }
          }).catch((e) => {
            // alert(e)
          })
        } catch (e) {
          alert(e)
        }
      },
      play(name, index, isFromStart, isReplay) {
        let self = this;

        if (!isReplay && index == this.curIndex && this.name == name) {

          if (this.isPause) {
            callplus('resume', [], function(isPaused) {})
            this.isPause = false;
            this.startSlide();

            if (!this.isRankTimerStop)
            this.resumeRankTimer();

            window.myLrc.pauseToggle();
          } else {
            callplus('pause', [], function(isPaused) {})

            this.isPause = true;
            this.stopSlide();

            if (!this.isRankTimerStop)
            this.pauseRankTimer();

            window.myLrc.pauseToggle();

          }

          this.playIcon = this.isPause ? 'play_arrow' : 'pause_arrow';
          return
        } else {
          this.stopRankTimer();

          this.startRankTimer();
        }



        self.isPlay = true;
        this.isPause = false;
        this.playIcon = this.isPause ? 'play_arrow' : 'pause_arrow';
        this.curIndex = index;
        this.name = name;
        this.settings.lastPlay = name;
        this.$store.commit('saveSettings', this.settings);
        var p = self.musicDirectory + name
        callplus('play', [self.musicDirectory + name, isFromStart], function(data) {
          let s = data.data.length;
          self.max = Math.ceil(s);
          self.linear = data.data.pos - 0;


          if (self.lyricMap[name]) {
            self.getLyricFromLocal(name, () => {

              window.myLrc.play();
              window.myLrc.seek(data.data.pos * 1000);
            })
          }          

          self.total = window.formatTime(s);

          self.onSliderChange(true)

          // alert()
        })

        // this.getLyric(name)


        callplus('getCover', [p], function(res) {
          displayCover(res.data)
        })

        function displayCover(str) {
          let arr = str.split(',');
          let data = window.atob(arr[1])
          let mime = arr[0].match(/:(.*?);/)[1]
          let ia = new Uint8Array(data.length)
          for (var i = 0; i < data.length; i++) {
            ia[i] = data.charCodeAt(i)
          }
          var blob = new Blob([ia], {
            type: mime
          })

          try {
            let url = name;
            ID3.loadTags(url, function() {
              var tags = ID3.getAllTags(url);
              self.tags = tags;
              self.albumTitle = tags.title;
              var image = tags.picture;
              if (image) {
                let base64 = window.getCover(image)
                self.cover = base64;
              }
            }, {
              tags: ["title", "artist", "album", "picture"],
              dataReader: ID3.FileAPIReader(new window.File([blob], name, {
                // type: file.type
              }))
            });
          } catch (e) {
            alert(e)
          }
        }


      }
    }
  }
</script>

<style lang='scss'>

  .cover-box {
      flex: 1;
      background-color: #fff;
      padding: 32px;

      .top-box {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .mu-icon {
        float: none
      }
      img {
        max-height: 100%;
        max-width: 100%;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }


  .big-cover-box img {
    width: 100%;
  }

  @keyframes rotate {
    from {
      transform: rotateZ(0deg);
    }
    to {
      transform: rotateZ(359deg);
    }
  }
  .rotate {
    animation: rotate 7s infinite;
    animation-timing-function: linear;
    // border: 2px solid;
  }

  .rotate.paused {
    animation-play-state:paused;
  }

  .lrc {
    text-align: center
  }
</style>
