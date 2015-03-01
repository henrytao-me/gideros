var _ = require('lodash');
var fs = require('fs');
var q = require('q');
var path = require('path');
var recursive = require('recursive-readdir');
var xml2js = require('xml2js');

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
    var xml = builder.buildObject(data);
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
  var deferred = q.defer();
  recursive(this.config.watchDir, function(err, files) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(files);
    }
  });
  return deferred.promise.then(function(files) {
    var res = [];
    _.each(files, function(f) {
      if (path.extname(f) !== '.lua') {
        return;
      }
      res.push(f);
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

// excludeFromExecution
Compiler.prototype.compile = function() {
  return q.all([this.getFiles(), this.getGiderosConfigData()]).then(function(res) {
    var data = res[1];
    var diskFiles = res[0];
    var giderosFiles = this.getGiderosFilesFromData(data['project']);

    console.log(data['project']['folder']);
    console.log(data['project']['file']);
    console.log(giderosFiles);

    

    // check dependency


  }.bind(this)).catch(function(err) {
    console.log(err);
  });
};

Compiler.compile = function(config) {
  return new Compiler(config);
};

module.exports = Compiler;
