// ex: node index.js /sample/dir/to/gideros-app -p gideros-app -i ... -e ...

var _ = require('lodash');
var path = require('path');
var chokidar = require('chokidar');

var config = require('./lib/config');
var utils = require('./lib/utils');
var Compiler = require('./lib/compiler');

function compile() {
  Compiler.compile(config);
}

function isConfigChanged(file) {
  if (path.resolve(file) === path.resolve(config.watchDir, '.gideros')) {
    config = _.extend(config, utils.getGiderosConfig(config.watchDir, config.DEF));
    return true;
  }
  return false;
}

function notification(file, type) {
  file = path.join(file, '');
  console.log([new Date().toISOString(), 'File', file, 'was', type].join(' '));
}

var isReady = false;
var watcher = chokidar.watch(config.watchDir);
watcher
  .on('add', function(file) {
    if (!isReady) {
      return;
    }
    if (!utils.isInclude(file, config.includeRegex, config.excludeRegex) && !isConfigChanged(file)) {
      return;
    }
    notification(file, 'created');
    compile();
  })
  .on('change', function(file) {
    if (!isReady) {
      return;
    }
    if (isConfigChanged(file)) {
      notification(file, 'changed');
      compile();
    }
  })
  .on('unlink', function(file) {
    if (!isReady) {
      return;
    }
    if (!utils.isInclude(file, config.includeRegex, config.excludeRegex) && !isConfigChanged(file)) {
      return;
    }
    notification(file, 'deleted');
    compile();
  })
  .on('error', function(error) {
    console.log('Error happened', error);
  })
  .on('ready', function() {
    isReady = true;
    console.log('================================================================');
    console.log('Gideros Node');
    console.log(JSON.stringify(config, null, '  '));
    console.log('================================================================');
    console.log([new Date().toISOString(), 'Start watching'].join(' '));
    compile();
  });
