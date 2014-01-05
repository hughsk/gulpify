var gulpify = require('./')

var File = require('gulp-util').File
var concat = require('concat-stream')
var test = require('tape')
var path = require('path')
var fs = require('fs')

var fixdir = path.resolve(__dirname, 'fixtures')

test('sanity check', function(t) {
  t.plan(4)

  var contents = fs.readFileSync(path.resolve(fixdir, 'sanity-check.js'))
  var file = createFileStream('sanity-check.js')
  var stream = gulpify('bundle.js')
  var bundleStarted = false
  var files = 0

  stream.on('bundle', function() {
    bundleStarted = true
  })

  stream.on('file', function() {
    t.ok(bundleStarted, '"bundle" emitted first')
    t.equal(++files, 1, 'one file event')
  })

  stream.pipe(concat(function(files) {
    t.equal(files.length, 1, 'one file emitted')

    var bundle = String(files[0].contents).trim()
    var original = String(contents).trim()

    t.notEqual(bundle, original)
  }))

  stream.write(file)
  stream.end()
})

function createFileStream(src) {
  var abs = path.resolve(fixdir, 'sanity-check.js')
  return new File({
      path: abs
    , cwd: __dirname
    , base: fixdir
    , contents: fs.readFileSync(abs)
  })
}
