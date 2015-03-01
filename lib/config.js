var minimist = require('minimist');
var path = require('path');

// ex: node index.js /sample/dir/to/gideros-app -p gideros-app -i ... -e ...
var argv = minimist(process.argv.slice(2));

module.exports = {
  watchDir: argv._[0],
  projectName: argv.p || path.basename(argv._[0] || ''),
  includeRegex: argv.i || null,
  excludeRegex: argv.e || null
};
