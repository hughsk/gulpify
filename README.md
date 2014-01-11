# gulpify [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/gulpify&title=gulpify&description=hughsk/gulpify%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![deprecated](http://hughsk.github.io/stability-badges/dist/deprecated.svg)](http://github.com/hughsk/stability-badges) #

> **This module is deprecated in favor of
[vinyl-source-stream](http://github.com/hughsk/vinyl-source-stream). If you'd
like to use a plugin, you can still use
[gulp-browserify](http://github.com/deepak1556/gulp-browserify).**

A simple but flexible [browserify](http://browserify.org/) plugin for
[Gulp v3](http://github.com/gulpjs/gulp). Mostly just to see how gulp
and its ecosystem works.

## Usage ##

[![gulpify](https://nodei.co/npm/gulpify.png?mini=true)](https://nodei.co/npm/gulpify)

First, install `gulpify` as a development dependency:

``` bash
npm install --save-dev gulpify
```

Then, add it to your `gulpfile.js`:

``` javascript
var browserify = require('gulpify')
var gulp = require('gulp')

gulp.task('bundle', function() {
  gulp.src('index.js')
    .pipe(browserify('bundle.js'))
    .pipe(gulp.dest('./dist/'))
})
```

Most of the methods normally supported by `browserify` are available on this
gulp stream, and you can pass in an options object directly to it too:

``` javascript
var browserify = require('gulpify')
var gulp = require('gulp')

gulp.task('bundle', function() {
  var bundler = browserify('bundle.js', {
      cwd: __dirname + '/some/folder'
    , noParse: true
  })

  bundler
    .transform('coffeeify')
    .transform('decomponentify')
    .transform('envify')
    .ignore(require.resolve('express'))

  bundler.on('file', function(file) {
    console.log('parsed file: ' + file)
  })

  bundler.on('bundle', function() {
    console.log('starting browserify bundle')
  })

  bundler.on('end', function() {
    console.log('finished browserify bundle')
  })

  gulp.src('index.js')
    .pipe(bundler)
    .pipe(gulp.dest('./dist/'))
})
```

Also note that right now **streaming files are not supported**, i.e. you cannot
use the following in your pipeline:

``` javascript
gulp.src('file.js', { buffer: false })
```

## API ##

### `stream = gulpify(fileName, options={})` ###

#### `fileName` ####

Type: `String`

The file name of the resulting bundle - much like
[gulp-concat](http://github.com/wearefractal/gulp-concat) expects.

#### `options` ####

Type: `Object`
Default: `{ cwd: firstFile.cwd }`

Exactly the same as if you were to pass the options object directly to
browserify, however `options.cwd` will default to the first file's own
`cwd` property unless you specify it yourself.

### `stream[method](args...)` ###

A number of methods that are normally exposed on `browserify`'s bundler
instance are also usable directly on the gulpify stream, e.g.:

``` javascript
var stream = gulpify('bundle.js').transform('brfs')
```

Currently, the following methods are available:

* `add(file)`
* `require(file, options={})`
* `external(file)`
* `ignore(file)`
* `exclude(file)`
* `transform(options={}, tr)`

You should consult the [browserify documentation](http://github.com/substack/node-browserify) for information on how to use
these methods.

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/gulpify/blob/master/LICENSE.md) for details.
