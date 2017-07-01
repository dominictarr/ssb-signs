var Reduce      = require('flumeview-reduce')
var isBlob = require('ssb-ref').isBlob

exports.name = 'signs'
exports.version = '1.0.0'
exports.manifest = {
  get: 'async'
}

exports.init = function (sbot) {

  var view = sbot._flumeUse('signs', Reduce(1, function (m, mentions) {
    m = m || {}
    mentions.forEach(function (mention) {
      m[mention.target] = m[mention.target] || {}
      m[mention.target][mention.source] = mention.signifier
    })
    return m
  }, function (data) {
    var out = []
    if(Array.isArray(data.value.content.mentions))
      data.value.content.mentions.filter(function (e) {
        return e.name && 'string' == typeof e.name && e.link
      }).forEach(function (e) {
        out.push({source: data.value.author, signifier: e.name || e.image, target: e.link})
      })
    else if(data.value.content.type == 'about') {
      if(data.value.content.name)
        out.push({source: data.value.author, signifier: data.value.content.name, target: data.value.content.about})
      if(data.value.content.image)
        out.push({
          source: data.value.author,
          signifier: 
            ( isBlob(data.value.content.image) ?
              data.value.content.image :
              data.value.content.link ),
          target: data.value.content.about})

    }
    return out
  }))

  return {
    get: view.get
  }
}




