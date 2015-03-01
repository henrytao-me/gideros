var _ = require('lodash');
var fs = require('fs');
var q = require('q');
var path = require('path');
var recursive = require('recursive-readdir');
var xml2js = require('xml2js');

var utils = require('./utils');

var Compiler = function() {
  this.init.apply(this, arguments);
};

Compiler.prototype.init = function(config) {
  this.config = config;
  this.compile();
};

Compiler.prototype.getGiderosConfigFile = function() {
  return path.join(this.config.watchDir, this.config.projectName + '.gproj');
};

Compiler.prototype.getGiderosConfigData = function() {
  var parseString = xml2js.parseString;
  var deferred = q.defer();
  fs.readFile(this.getGiderosConfigFile(), function(err, data) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(data);
    }
  });
  return deferred.promise.then(function(data) {
    var deferred = q.defer();
    parseString(data, function(err, result) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(result);
      }
    });
    return deferred.promise;
  });
};

Compiler.prototype.setGiderosConfigData = function(data) {
  var deferred = q.defer();
  try {
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(data).replace(/<?.*?>/, '');
    fs.writeFile(this.getGiderosConfigFile(), xml, function(err) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve();
      }
    });
  } catch (ex) {
    deferred.reject(ex);
  }
  return deferred.promise;
};

Compiler.prototype.getFiles = function() {
  var self = this;
  var deferred = q.defer();
  recursive(self.config.watchDir, ['.git'], function(err, files) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(files);
    }
  });
  return deferred.promise.then(function(files) {
    var res = [];
    var reg = null;
    _.each(files, function(f) {
      reg = new RegExp('^' + path.resolve(self.config.watchDir) + path.sep);
      res.push(path.resolve(f).replace(reg, ''));
    });
    return res;
  });
};

Compiler.prototype.getGiderosFilesFromData = function(data, parent) {
  var self = this;
  var res = {};
  parent = parent || '';
  _.each(data.file, function(f) {
    res[path.join(parent, path.basename(f['$']['source']))] = f['$'];
  });
  _.each(data.folder, function(f) {
    _.each(self.getGiderosFilesFromData(f, f['$']['name']), function(v, p) {
      res[p] = v;
    });
  });
  return res;
};

Compiler.prototype.buildGiderosJsonTree = function(files) {
  var res = {
    folder: [],
    file: []
  };
  var tree = {};
  var tmp = null;
  var deep = null;
  var d = null;
  _.each(files, function(f) {
    tmp = f.split(path.sep);
    deep = res;
    _.each(tmp, function(name, index) {
      if (index < tmp.length - 1) {
        deep.folder = deep.folder || [];
        d = _.filter(deep.folder, function(d) {
          return d.$.name === name;
        })[0];
        if (!d) {
          d = {
            $: {
              name: name
            }
          };
          deep.folder.push(d);
        }
        deep = d;
      } else {
        deep.file = deep.file || [];
        deep.file.push({
          $: {
            source: f
          }
        });
      }
    });
  });
  return res;
};

Compiler.prototype.compile = function() {
  var self = this;
  return q.all([self.getFiles(), self.getGiderosConfigData()]).then(function(res) {
    var data = res[1];
    var diskFiles = res[0];
    var includeFiles = _.filter(diskFiles, function(f) {
      return utils.isInclude(f, self.config.includeRegex, self.config.excludeRegex);
    });

    // build new folder and file
    var tree = self.buildGiderosJsonTree(includeFiles);
    data['project']['folder'] = tree.folder;
    data['project']['file'] = tree.file;

    // filter dependency
    var dependencies = [];
    _.each(data['project']['dependency'], function(d) {
      if (_.indexOf(includeFiles, d['$']['from']) < 0 || _.indexOf(includeFiles, d['$']['to']) < 0) {
        return;
      }
      dependencies.push(d);
    });
    data['project']['dependency'] = dependencies;

    // save new gideros data
    self.setGiderosConfigData(data);

    return true;
  }).catch(function(err) {
    console.log(err);
    return false;
  });
};

Compiler.compile = function(config) {
  return new Compiler(config);
};

module.exports = Compiler;
