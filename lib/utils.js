var _ = require('lodash');

module.exports = {

  isInclude: function(file, includeRegex, excludeRegex) {
    if (excludeRegex && (new RegExp(excludeRegex)).test(file)) {
      return false;
    }
    if (includeRegex && !(new RegExp(includeRegex)).test(file)) {
      return false;
    }
    return true;
  }

};
