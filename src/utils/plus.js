var object;

if (window.isConnected) {
  object = window.frame1 = window.frames[0];
} else {
  object = window;
}

// window.DB = openDatabase('MyData', '', 'My Database', 25 * 1024 * 1024);
import SqliteDB from './sqlite3'

window.DB = new SqliteDB('MyData', 50 * 1024 * 1024)

window.s = JSON.stringify

window.JSON2 = JSON;

window._clone = function(obj) {
  return JSON.parse(JSON.stringify(obj))
}


window.pickItems = function(list, max) {
  let result = list.sort(function() {
    return Math.random() - 0.5
  });

  return result.slice(0, max)
}
window.formatTime = function(total) {
  let min = Math.floor(total / 60);

  let second = Math.floor(total % 60);

  return min + ":" + second;
}
window.getImageColor = getImageColor;

function getImageColor(canvas, img) {

    
    try {
      canvas.width = img.width;
      canvas.height = img.height;

      var context = canvas.getContext("2d");

      context.drawImage(img, 0, 0,canvas.width,canvas.height);

      // 获取像素数据
      var data = context.getImageData(0, 0, img.width, img.height).data;
      console.log(data)
      var r=1,g=1,b=1;
      }
      catch(e) {
        alert(e)
      }

      // 取所有像素的平均值
      for (var row = 0; row < img.height; row++) {
          for (var col = 0; col < img.width; col++) {
      // console.log(data[((img.width * row) + col) * 4])
              if(row==0){
                  r += data[((img.width * row) + col)];
                  g += data[((img.width * row) + col) + 1];
                  b += data[((img.width * row) + col) + 2];
              }else{
                  r += data[((img.width * row) + col) * 4];
                  g += data[((img.width * row) + col) * 4 + 1];
                  b += data[((img.width * row) + col) * 4 + 2];
              }
          }
      }

      console.log(r,g,b)
      // 求取平均值
      r /= (img.width * img.height);
      g /= (img.width * img.height);
      b /= (img.width * img.height);

      // 将最终的值取整
      r = Math.round(r);
      g = Math.round(g);
      b = Math.round(b);
      console.log(r,g,b)
      return "rgb(" + r + "," + g + "," + b + ")";
  }

window.getSongTags = function(path, cb, tagsList=["title", "artist", "album", "picture"]) {

  callplus('getCover', [path], function(res) {
    let str = res.data;
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
      cb(tags);

    }, {
      tags: tagsList,
      dataReader: ID3.FileAPIReader(new window.File([blob], name, {
        // type: file.type
      }))
    });
  } catch (e) {
    alert(e)
  }
  })

}

window.getCover = function(image) {
  var base64String = "";
  for (var i = 0; i < image.data.length; i++) {
    base64String += String.fromCharCode(image.data[i]);
  }

  var base64 = "data:" + image.format + ";base64," + window.btoa(
    base64String);

    return base64;
}
const COMMANDS = {
    backup(data, name) {
      data = window.JSON.stringify(data)

      plus.io.resolveLocalFileSystemURL( "/storage/emulated/0/_pc/other/muse-backup/", function( entry ) {

        entry.getFile(name + '.txt', {create: true}, function(entry) {
          entry.createWriter( function ( writer ) {
          	// Write data to file.
          	writer.write( data );


            object.postMessage({
              name: 'backup'
            }, '*')
          }, function ( e ) {
          	alert( e.message );
          } );
        })
       });
    },
    getRestoreList() {

      plus.io.resolveLocalFileSystemURL( "/storage/emulated/0/_pc/other/muse-backup/", function( entry ) {
          var directoryReader = entry.createReader();
          directoryReader.readEntries( function( entries ){
            var i;
            let list = [];
            for( i=0; i < entries.length; i++ ) {
              list.push( entries[i].name );
            }

            object.postMessage({
              data: list,
              type: 'getRestoreList',
              name: 'getRestoreList'
            }, '*')
          }, function ( e ) {
            alert( "Read entries failed: " + e.message );
          } );

      });
    },

    restore(file) {
      // data = window.JSON.stringify(data)

      plus.io.resolveLocalFileSystemURL( "/storage/emulated/0/_pc/other/muse-backup/", function( entry ) {

        entry.getFile(file, {create: false}, function(entry) {
            let reader = new plus.io.FileReader();
            reader.onloadend = function ( e ) {

                  object.postMessage({
                    data: e.target.result,
                    type: 'restore',
                    name: 'restore'
                  }, '*')

            };
            reader.readAsText( entry );
          }, function ( e ) {
          	alert( e.message );
          } );
        })

    },
    removeRestore(file) {
      // data = window.JSON.stringify(data)

      plus.io.resolveLocalFileSystemURL( "/storage/emulated/0/_pc/other/muse-backup/", function( entry ) {

        entry.getFile(file, {create: false}, function(entry) {
            entry.remove(function(e) {
                  object.postMessage({
                    data: [],
                    type: 'removeRestore',
                    name: 'removeRestore'
                  }, '*')
            }, function(e) {
              alert(e.message)
            });
          }, function ( e ) {
          	alert( e.message );
          } );
        })

    },

    gallery() {
        plus.gallery.pick( function(path){
          plus.io.resolveLocalFileSystemURL(path, function(entry) {
            entry.file((file) => {
              var reader = new plus.io.FileReader();
              reader.onloadend = function(e) {


                try {

                  // alert(list.length);
                  object.postMessage({
                    data: e.target.result,
                    type: 'gallery',
                    name: 'gallery'
                  }, '*')

                } catch (e) {
                  alert(e)
                }

              }

              reader.readAsDataURL(file);

            });
          })
        }, function ( e ) {
          console.log( "取消选择图片" );
        }, {filter:"image"} );
    },
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
                var pos = parseInt(Math.random() * (length - 15));

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

              try {

                // alert(list.length);
                object.postMessage({
                  data: {
                    pos: pos,
                  },
                  type: 'seek',
                  name: 'seek'
                }, '*')

              } catch (e) {
                alert(e)
              }


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
          if (window.isConnected) {
            location = './index.html'
          } else {
            location = '../index.html'
          }

        },

    }

    window.isConnected = false

    let host = 'http://192.168.31.174:8080';

    if (window.config.isOut) {
      host = "http://192.168.1.119:8087"
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
    window.successCallbackMap = {}
    window.callplus = function(command, params, success, runCallback) {
      let paramsStr = JSON.stringify(params);

      // if (runCallback) {
      //   successCallbackMap[command] = true;
      // }

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

        // if (window.successCallbackMap[set.name]) {
        //   return window.successCallback[set.name](set);
        // }        


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

          if(set.name == 'backup') {
            // alert(window.successCallback[set.name])
          }
        if (window.successCallback[set.name]) {
          window.successCallback[set.name](set);
        }
      } catch (e) {
        alert(e)
      }
    })
