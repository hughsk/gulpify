var browserify = require('browserify')
var through = require('through')
var File = require('vinyl')
var path = require('path')

var slice = Array.prototype.slice

module.exports = gulpify

function gulpify(fileName, opts) {
  if (!opts) opts = {}

  var stream = through(handle, flush)
  var files = []
  var calls = []
  var firstFile

  ;['add'
  , 'require'
  , 'external'
  , 'ignore'
  , 'exclude'
  , 'transform'
  ].forEach(function(name) {
    stream[name] = function() {
      calls.push({ name: name, args: slice.call(arguments) })
      return stream
    }
  })

  return stream

  function handle(file) {
    if (file.isNull()) return
    if (file.isStream()) return stream.emit('error', new Error(
      'gulpify: Streaming files are not *currently* supported'
    ))
    if (!firstFile) {
      firstFile = file
      opts.cwd = opts.cwd || file.cwd
    }

    files.push(file.path)
  }

  function flush() {
    var br = browserify(opts)

    for (var i = 0; i < calls.length; i++) br[calls[i].name].apply(br, calls[i].args)
    for (var i = 0; i < files.length; i++) br.add(files[i])

    stream.emit('bundle', br)

    br.on('file', emit('file'))
    br.bundle(function(err, contents) {
      if (err) return stream.emit('error', err)

      var joinedPath = path.join(firstFile.base, fileName)
      var brFile = new File({
          contents: new Buffer(contents)
        , path: joinedPath
        , base: firstFile.base
        , cwd: firstFile.cwd
      })

      stream.queue(brFile)
      stream.queue(null)
    })
  }

  function emit(event) {
    return function() {
      return stream.emit(event, slice.call(arguments))
    }
  }
}
