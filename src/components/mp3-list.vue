<template>
  <div class="container">
    <mu-list>
      <mu-list-item v-for="(i,index) in list" :class="{active: curIndex == index}">

        <span class="title" @click="play(i.name, index)">{{i.name}}
        </span>



        <mu-icon value="star" class="star" color="yellow" v-show="i.favorited" />

        <mu-icon-menu icon="more_vert" slot="right" @click.native="onOpen" :open="menuOpen">
          <mu-menu-item title="收藏" @click.native="favorite(i)" />
          <mu-menu-item title="菜单 2" />
          <mu-menu-item title="菜单 3" />
          <mu-menu-item title="菜单 4" />
          <mu-menu-item title="菜单 5" />
        </mu-icon-menu>
      </mu-list-item>

      <!-- 		 <mu-list-item v-for="i in 100" :class="{active: curIndex == i}"
		 @click="onClick(i)">{{i}}</mu-list-item>  -->



    </mu-list>

    <div class="cover-box">
      <img :src="cover" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        list: [],
        musicDirectory: '/storage/emulated/0/netease/cloudmusic/music/',

        curIndex: -1,

        menuOpen: false,

        favoriteList: [],
        cover: ''
      }
    },

    mounted() {

      window.Hub.$on('refresh', function() {
        self.refreshList()
      })
      window.Hub.$on('play-music', function() {
        self.refreshList()
      })
      if (window.player) {
        player.stop()
      }
      let self = this
      window.$Mp3List = self
      setTimeout(function() {

        self.refreshList()

        callplus('getFavorite', [], function(set) {
          self.favoriteList = set.data;
        })
      }, 1000)




    },

    methods: {
      favorite(item) {
        this.favoriteList.push(item.name);

        this.saveFavorite();
      },

      saveFavorite() {

        callplus('saveFavorite', [this.favoriteList], function() {
          window.Hub.$emit('star-getFavorite')
        })
      },
      refreshList: function() {
        callplus('getList', {
          url: self.musicDirectory
        }, function(data) {
          // alert(data.length)
		  
          self.list = data

          for (var i = 0; i < self.list.length; i++) {
            var item = self.list[i];

            if (this.favoriteList.indexOf(item) !== -1) {
              item.favorited = true;
            }
          }
        })
      },
      onOpen($event) {
        this.menuOpen = false;
        // $event.stopPropagation();
      },
      onClick(index) {
        this.curIndex = index
      },
      play(name, index, isFromStart) {
        let self = this;
        if (index == this.curIndex) {

          if (this.isPause) {
            callplus('resume', [], function(isPaused) {})
            this.isPause = false;
          } else {
            callplus('pause', [], function(isPaused) {})

            this.isPause = true;

          }

          return
        }

        callplus('play', [self.musicDirectory + name, isFromStart], function(data) {

        })

        self.isPlay = true;
        this.curIndex = index;
        var p = self.musicDirectory + name
        plus.io.resolveLocalFileSystemURL(p, function(entry) {
            // 可通过entry对象操作test.html文件
            entry.file(function(file) {

              //loadUrl(name, null, file)

              try {
                function errorHandler(err) {
                  alert(JSON.stringify(err))
                }
                plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
                    // 可通过fs进行文件操作

                    fs.root.getFile(p, {
                      create: false
                    }, function(entry) {

                      try {

                        entry.file((file) => {



                          plus.console.log("Read success");
                          // Get data




                          try {
                            var reader = new plus.io.FileReader();
                            reader.onloadend = function(e) {
                              let arr = e.target.result.split(',')
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
                                let url = file.urn || file.name
                                ID3.loadTags(url, function() {
                                  var tags = ID3.getAllTags(url);
                                  var image = tags.picture;
                                  if (image) {
                                    var base64String = "";
                                    for (var i = 0; i < image.data.length; i++) {
                                      base64String += String.fromCharCode(image.data[i]);
                                    }
                                    var base64 = "data:" + image.format + ";base64," + window.btoa(
                                      base64String);
                                    self.cover = base64;
                                  }
                                }, {
                                  tags: ["title", "artist", "album", "picture"],
                                  dataReader: ID3.FileAPIReader(new window.File([blob], file.name, {
                                    type: file.type
                                  }))
                                });
                              } catch (e) {
                                alert(e)

                              }


                            };
                            reader.readAsDataURL(file);
                          } catch (e) {
                            alert(e)
                          }





                        })

                      } catch (e) {
                        alert(e)
                      }
                    }, errorHandler);

                    // alert("Request file system success!");
                  },
                  function(e) {
                    alert("Request file system failed: " + e.message);
                  });
                // var reader = new plus.io.FileReader();
                //     reader.onload = function(e){
                //         // target.result 该属性表示目标对象的DataURL
                //         alert(e.target.result.length + 'abc');
                //     }
                //     // 传入一个参数对象即可得到基于该参数对象的文本内容
                //     reader.readAsText(file);
                // ID3.loadTags(file.urn || file.name, function() {
                //   alert(123)
                // }, {
                //   tags: ["title","artist","album","picture"],
                //   dataReader: ID3.FileAPIReader(file)
                // });
              } catch (e) {
                alert(e)
              }

            });
          },
          function(e) {
            alert("Resolve file URL failed: " + e.message);
          });


        function getObjectURL(file) {

          try {
            var url = null;
            if (window.createObjectURL != undefined) { // basic
              url = window.createObjectURL(file);
              console.info(url);
            } else if (window.URL != undefined) { // mozilla(firefox)
              url = window.URL.createObjectURL(file);
              console.info(url);
            } else if (window.webkitURL != undefined) { // webkit or chrome
              url = window.webkitURL.createObjectURL(file);
              console.info(url);
            }
            console.info("file:::::" + url);
          } catch (e) {
            alert(e)
          }
          return url;
        }

        function loadUrl(url, callback, reader) {
          try {

            var startDate = new Date().getTime();
            ID3.loadTags(url, function() {
              var endDate = new Date().getTime();

              if (typeof console !== "undefined") console.log("Time: " + ((endDate - startDate) / 1000) + "s");
              var tags = ID3.getAllTags(url);

              alert(tags.artist);
              //$("artist").textContent = tags.artist || "";

              if (callback) {
                callback();
              };
            }, {
              tags: ["artist", "title", "album", "year", "comment", "track", "genre", "lyrics", "picture"],
              dataReader: ID3.FileAPIReader(reader)
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
  .active .mu-item {
    background: #ccc;
    color: #fff;
  }

  .title {
    text-overflow: ellipsis;
    min-width: 70%;
    max-width: 90%;
    display: -webkit-inline-box;
    -webkit-line-clamp: 1;
    overflow: hidden;
    -webkit-box-orient: vertical;
  }

  .mu-list .mu-item {
    position: relative;
  }

  .mu-list .mu-menu {
    display: inline-block;
  }

  .mu-item .star {
    float: right;
    margin-top: -5px;
  }


  .container {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .mu-list {
      min-height: 60%;
      max-height: 60%;
    }

    .cover-box {
      flex: 1;
      background-color: #fff;
      padding: 32px;

      img {
        max-height: 100%;
        max-width: 100%;
      }
    }
  }
</style>
