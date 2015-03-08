var minimist = require('minimist');
var path = require('path');

var utils = require('./utils');

var INCLUDE_REGEX = null;
var EXCLUDE_REGEX = '^\\\\.[^\\\\.]*|.gproj$|LICENSE|README.md';

var argv = minimist(process.argv.slice(2));
var gideros = utils.getGiderosConfig(argv._[0], {
  includeRegex: INCLUDE_REGEX,
  excludeRegex: EXCLUDE_REGEX
});

module.exports = {
  DEF: {
    includeRegex: INCLUDE_REGEX,
    excludeRegex: EXCLUDE_REGEX
  },
  watchDir: argv._[0],
  projectName: argv.p || path.basename(path.resolve(argv._[0] || '')),
  includeRegex: argv.i || gideros.includeRegex || INCLUDE_REGEX,
  excludeRegex: argv.e || gideros.excludeRegex || EXCLUDE_REGEX
};
