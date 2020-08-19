var object;

if (window.isConnected) {
  object = window.frame1 = window.frames[0];
} else {
  object = window;
}

window.s = JSON.stringify

window.JSON2 = JSON;

window.formatTime = function(total) {
  let min = Math.floor(total / 60);

  let second = Math.floor(total % 60);

  return min + ":" + second;
}
const COMMANDS = {

    getCover: function(p) {

      plus.io.resolveLocalFileSystemURL(p, function(entry) {

            entry.file(function(file) {


              plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(fs) {
                fs.root.getFile(p, {
                  create: false
                }, function(entry) {

                  entry.file((file) => {

                    var reader = new plus.io.FileReader();
                    reader.onloadend = function(e) {
                      let arr = e.target.result

                      try {

                        // alert(list.length);
                        object.postMessage({
                          data: arr,
                          type: 'cover',
                          name: 'getCover'
                        }, '*')

                      } catch (e) {
                        alert(e)
                      }
                    }

                    reader.readAsDataURL(file);
                  })
                })
              })
            })
          })

        },
        getList: function() {


          let list = []



          plus.io.resolveLocalFileSystemURL("/storage/emulated/0/netease/cloudmusic/music", function(entry) {
            var r = entry.createReader()

            r.readEntries(function(result) {

              // alert(result.length)
              for (var i = 0; i < result.length; i++) {
                list.push(result[i])
              }



              try {

                // alert(list.length);
                object.postMessage({
                  data: list,
                  type: 'list',
                  name: 'getList'
                }, '*')

              } catch (e) {
                alert(e)
              }
            })
          })

        },
        pause(file) {


          try {
            let self = window

            if (self.player) {
              self.player.pause()
            }

          } catch (e) {
            alert(e)
          }

        },
        resume(file) {


          try {
            let self = window

            if (self.player) {
              self.player.resume()
            }

          } catch (e) {
            alert(e)
          }

        },

        play(file, isFromStart) {


          try {
            let self = window;
            if (self.player) {
              self.player.stop()
            }
            window.player = self.player = plus.audio.createPlayer(file);



            window.player.addEventListener('canplay', () => {
              let length = self.player.getDuration();

              // alert(length)
              if (!isFromStart) {
                var pos = Math.random() * (length - 15);

                self.player.seekTo(pos);
              }


              self.player.play();


              try {

                // alert(list.length);
                object.postMessage({
                  data: {
                    length: length,
                    pos: pos,
                  },
                  type: 'play',
                  name: 'play'
                }, '*')

              } catch (e) {
                alert(e)
              }
            })







          } catch (e) {
            alert(e)
          }

        },
        seek(pos) {

          try {

            self.player.seekTo(pos);




          } catch (e) {
            alert(e)
          }



        },

        saveFavorite(list) {
          // alert(JSON2.stringify)
          localStorage.setItem('favoriteList', JSON2.stringify(list))

          object.postMessage({
            data: [],
            name: 'saveFavorite',
          }, '*')

        },
        getFavorite() {

          let result = localStorage.getItem('favoriteList') || ''

          if (result) {
            result = JSON.parse(result);
          }

          result = result || []
          object.postMessage({
            data: result,
            name: 'getFavorite',
          }, '*')
        },
        isPaused() {


          try {
            let self = this

            // let result = self.player.isPaused();
            // alert( window.player.isp)
            frame1.postMessage({
              data: result
            }, '*')
          } catch (e) {
            alert(e)
          }

        },

        quit() {
          location = './index.html'
        },

    }

    window.isConnected = false

    let host = 'http://192.168.31.174:8080';

    if (window.config.isOut) {
      host = "http://192.168.1.116:8084"
    }
    setTimeout(function() {
      //
      $.ajax({
        url: host,
        async: false,
        //
        success: function(res) {
          if (self == top && !location.host) {
            // location = './iframe.html'
          } else {
            isConnected = true;
          }
        }
      })
    }, 500)


    window.successCallback = {}
    window.callplus = function(command, params, success) {
      let paramsStr = JSON.stringify(params);

      // if (params.length) {
      // 	paramsStr = params.join(',');
      // }
      try {
        let str = `var params = ${paramsStr};var ${command} = ` + COMMANDS[command].toString() +
          ` ;${command}.apply(null, params)`

        var parent = isConnected ? window.parent : window;

        window.successCallback[command] = success;

        if (isConnected) {
          parent.postMessage(str, '*')
        } else {
          parent.postMessage(eval(str), '*');
        }




      } catch (e) {
        alert(e)
      }
    }

    window.addEventListener('message', function(e) {
      try {
        var set = e.data;

        if (!set) {
          return;
        }


        if (set.type == "webpackWarnings") {
          return;
        }
        // alert(set.plus)
        if (set.type == 'list') {
          // $Mp3List.list = set.data.slice(0,100)
          let list = set.data.sort(function() {
            return Math.random() - 0.5
          })

          $Mp3List.allList = list;

          $Mp3List.list = list.slice(0, 50)
        }

        if (window.successCallback[set.name]) {
          window.successCallback[set.name](set);
        }
      } catch (e) {
        alert(e)
      }
    })
