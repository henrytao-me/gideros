var _ = require('lodash');
var path = require('path');

var utils = require(path.resolve('./lib/utils'));

describe("lib/utils.js", function() {

  describe('isInclude', function() {
    it('should not include file', function() {
      expect(utils.isInclude('sample/abc/xyz.abc', '.csv$', null)).toEqual(false);
      expect(utils.isInclude('sample/abc/xyz.csv', '.csv$', '.csv$')).toEqual(false);
      expect(utils.isInclude('.sample/abc/xyz.csv', null, '^\\.[^\\.]*')).toEqual(false);
      expect(utils.isInclude('.sample', null, '^\\.[^\\.]*')).toEqual(false);
    });

    it('should include file', function() {
      expect(utils.isInclude('sample/abc/xyz.csv', null, null)).toEqual(true);
      expect(utils.isInclude('sample/abc/xyz.csv', null, '.abc$')).toEqual(true);
      expect(utils.isInclude('sample/abc/xyz.csv', '.csv$', null)).toEqual(true);
      expect(utils.isInclude('sample/abc/xyz.csv', '.csv$', '.abc$')).toEqual(true);
      expect(utils.isInclude('sample/abc/xyz.csv', null, '^\\.[^\\.]*')).toEqual(true);
      expect(utils.isInclude('../../gideros/MashballsClone/classes/sample.lua', null, '/^\\\\.[^\\\\.]*|.gproj$|LICENSE|README.md|^texturepacks/sources/|^texturepacks/LevelScene/')).toEqual(true);
    });
  });

});
