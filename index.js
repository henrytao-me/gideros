// ex: node index.js /sample/dir/to/gideros-app -p gideros-app -i ... -e ...

var _ = require('lodash');
var hound = require('hound');
var path = require('path');

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

watcher = hound.watch(config.watchDir);
try {
  watcher.on('create', function(file, stats) {
    if (!utils.isInclude(file, config.includeRegex, config.excludeRegex) && !isConfigChanged(file)) {
      return;
    }
    notification(file, 'created');
    compile();

  }).on('change', function(file, stats) {
    if (isConfigChanged(file)) {
      notification(file, 'changed');
      compile();
    }

  }).on('delete', function(file) {
    if (!utils.isInclude(file, config.includeRegex, config.excludeRegex) && !isConfigChanged(file)) {
      return;
    }
    notification(file, 'deleted');
    compile();
  });
} catch (ex) {
  console.log('Error', ex);
}

console.log('================================================================');
console.log('Gideros Node');
console.log(JSON.stringify(config, null, '  '));
console.log('================================================================');
console.log([new Date().toISOString(), 'Start watching'].join(' '));
compile();
