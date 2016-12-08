'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var state = require('../initialState');
var fs = require('fs');
var path = require('path');
var reactDocs = require('react-docgen');
var Parser = require("simple-text-parser");
var parser = new Parser();

const makeParser = (filepath) => {
  let foundProps = [];

}

const addParserRule = (filePath) => {
  let foundProps = []
  parser.addRule(/(props(.\w+))/ig, (tag) => {
    let propName = tag.split('.');
    propName.splice(0,1);
    if ( foundProps.indexOf(propName.join('.')) !== -1 ){
      return;
    }
    foundProps.push(propName.join('.'));
  });
}


let foundProps = {};
const extractProps = (filePath) => {
  const fileString = fs.readFileSync(filePath, 'utf8');
  let matchedProps = fileString.match(/props(.[a-zA-Z]+)([^(\(|}| |\[|;|,)])+/g);
  if (matchedProps === null){
    return [];
  }
  matchedProps = matchedProps.map((prop) => {
    let newProp = prop;
    let parsedProp = newProp.split('.');
    parsedProp.shift();
    parsedProp.join('.');
    return parsedProp.join('.');
  });
  return matchedProps.filter(function(item, pos, self) {
    return self.indexOf(item) === pos;
  })
}

module.exports = yeoman.Base.extend({
  prompting: function () {
    this.log(yosay('Creating components index.js'));
  },

  writing: function () {
    var components;
    try {
      components = fs.readdirSync(state.COMPONENTS_PATH);
      var indexFileIndex = components.indexOf('index.js');
      if (indexFileIndex > -1){
        components.splice(indexFileIndex, 1);
      }
      var indexFileIndex = components.indexOf('.DS_Store');
      if (indexFileIndex > -1){
        components.splice(indexFileIndex, 1);
      }

    }
    catch(err){
      console.log("ERROR while reading from directory ", err);
      components = [];
    }
    const a = (path)=>{
      // console.log("EXTRACTING PROPS FROM ", path);
      extractProps(path);
    }
    let propsArray = components.map((component) => {
      return extractProps(state.COMPONENTS_PATH+component);
    });
    console.log(propsArray);
    this.fs.copyTpl(
      this.templatePath('index.template.js'),
      this.destinationPath(state.TESTS_PATH+'index.test.js'),
      { components: components, props: propsArray }
    );

  }
});
