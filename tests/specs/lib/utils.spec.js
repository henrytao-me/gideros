var _ = require('lodash');
var path = require('path');

var utils = require(path.resolve('./lib/utils'));

describe("lib/utils.js", function() {

  describe('filter', function() {
    it('should filter not number, not string, not boolean and NaN', function() {
      expect(utils.filter({
        a: null,
        b: undefined,
        c: 1,
        d: 'a',
        e: true,
        f: false,
        g: NaN,
        h: 1.5
      })).toEqual({
        c: 1,
        d: 'a',
        e: true,
        f: false,
        h: 1.5
      });
    });
  });

  describe('getAlias', function() {
    it('should get alias', function() {
      expect(utils.getAlias('abc/xyz')).toEqual('abc-xyz');
    });
  });

  describe('parseUrl', function() {
    it('should parse url', function() {
      var url = 'abc/xyz';
      expect(utils.parseUrl(url)).toEqual({
      	alias: 'abc-xyz',
        pathname: 'abc/xyz',
        hash: null,
        search: {},
        origin: url
      });

      url = 'abc/xyz#abc';
      expect(utils.parseUrl(url)).toEqual({
      	alias: 'abc-xyz',
        pathname: 'abc/xyz',
        hash: 'abc',
        search: {},
        origin: url
      });

      url = 'abc/xyz?prerender=true&force=true&a=1&b=2&c=abc';
      expect(utils.parseUrl(url)).toEqual({
      	alias: 'abc-xyz',
        pathname: 'abc/xyz',
        hash: null,
        search: {
          prerender: true,
          force: true,
          a: 1,
          b: 2,
          c: 'abc'
        },
        origin: url
      });
    });
  });

});
