var hound = require('hound');
var path = require('path');

var config = require('./lib/config');
var utils = require('./lib/utils');
var Compiler = require('./lib/compiler');

function compile() {
  Compiler.compile(config);
}

function notification(file, type) {
  console.log([new Date().toISOString(), 'File', file, 'was', type].join(' '));
}

watcher = hound.watch(config.watchDir);
watcher.on('create', function(file, stats) {
	if (utils.isIgnore(file, config.includeRegex, config.excludeRegex)) {
		return;
	}
  notification(file, 'created');
  compile();

}).on('delete', function(file) {
	if (utils.isIgnore(file, config.includeRegex, config.excludeRegex)) {
		return;
	}
  notification(file, 'deleted');
  compile();
});

console.log('================================================================');
console.log('Gideros Node');
console.log('================================================================');
console.log([new Date().toISOString(), 'Start watching', config.watchDir, '[' + config.projectName + ']'].join(' '));
compile();
