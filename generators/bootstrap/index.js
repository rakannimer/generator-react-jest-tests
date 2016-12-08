'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var state = require('../initialState');
var fs = require('fs');
var path = require('path');

const mkdirp = require('mkdirp-promise/lib/node4')

module.exports = yeoman.Base.extend({

  initializing: function(){
    console.log(yosay("Let's bootstrap this app !"));
  },
  prompting: function () {
    //console.log(yosay("Let's bootstrap this app !"));
  },

  writing: function () {
    mkdirp('./components')
    mkdirp('./containers');
    mkdirp('./reducers');
    mkdirp('./sagas');
    mkdirp('./middlewares');
    mkdirp('./store');
  },
  end : function () {

  },
});
