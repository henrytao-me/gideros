var _ = require('lodash');
var fs = require('fs');
var path = require('path');

module.exports = {

  isInclude: function(file, includeRegex, excludeRegex) {
    if (excludeRegex && (new RegExp(excludeRegex)).test(file)) {
      return false;
    }
    if (includeRegex && !(new RegExp(includeRegex)).test(file)) {
      return false;
    }
    return true;
  },

  getGiderosConfig: function(dir, def) {
    var res = {};
    try {
      res = JSON.parse(fs.readFileSync(path.join(dir, '.gideros'), {
        encoding: 'utf8'
      }));
      _.each(res, function(value, key) {
        if (_.isArray(value)) {
          res[key] = value.join('|');
        }
      });
    } catch (ex) {
      console.log('Error', ex);
    }
    return _.extend({}, def, res);
  }

};
