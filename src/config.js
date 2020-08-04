
window.config = {
  isOut: false,
  env: {
    lyric: {
      dev: '/api2/',
      prod: 'http://gecimi.com/api/lyric/'
    },
    lrc: {
      dev: '/api3/',
      prod: 'http://s.gecimi.com/lrc/'
    },
  }
}

let isDev = process.env.NODE_ENV === 'development'
export let apis = {
  lyric: isDev ? '/api2/' : 'http://gecimi.com/api/lyric/',
  lrc: isDev ? '/api3/' : 'http://s.gecimi.com/lrc/',
}