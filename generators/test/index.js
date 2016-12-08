'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var state = require('../initialState');
var fs = require('fs');
var path = require('path');
var read = require('fs-readdir-recursive');
var metadata = require('react-component-metadata');
var reactDocs = require('react-docgen');

const _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i]; for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  } return target;
};

let foundProps = {};
const extractProps = filePath => {
  const fileString = fs.readFileSync(filePath, 'utf8');
  let matchedProps = fileString.match(/props(.[a-zA-Z]+)([^(\(|}| |\[|;|,)])+/g);
  if (matchedProps === null) {
    return [];
  }
  matchedProps = matchedProps.map(prop => {
    let newProp = prop;
    let parsedProp = newProp.split('.');
    parsedProp.shift();
    parsedProp.join('.');
    return parsedProp.join('.');
  });
  return matchedProps.filter(function (item, pos, self) {
    return self.indexOf(item) === pos;
  });
};

const filenameFromPath = filePath => {
  const filePathNoExtension = filePath.split('.js');
  const filePathNoExtensionArray = filePathNoExtension[0].split('/');
  const filename = filePathNoExtensionArray[filePathNoExtensionArray.length - 1];
  return filename;
};

const extractDefaultProps = filePath => {
  // const filePathNoExtension = filePath.split('.js');
  // const filePathNoExtensionArray = filePathNoExtension[0].split('/');
  const filename = filenameFromPath(filePath); // filePathNoExtensionArray[filePathNoExtensionArray.length - 1];
  console.log({filename});
  const fileString = fs.readFileSync(filePath, 'utf8');
  var componentInfo = reactDocs.parse(fileString);
  const componentProps = [];
  if (componentInfo.props) {
    const props = Object.keys(componentInfo.props);
    // console.log(componentInfo.fil)
    for (let i = 0; i < props.length; i += 1) {
      const propName = props[i];
      // const propType = componentInfo.props[propName].type.name;

      let propType;
      if (componentInfo.props[propName].type) {
        propType = componentInfo.props[propName].type.name;
      } else {
        console.log('Prop Type NOT FOUND : ', componentInfo.props[propName]);
      }
      let propDefaultValue;
      if (componentInfo.props[propName].defaultValue) {
        //eslint-disable-next-line
        propDefaultValue = eval(componentInfo.props[propName].defaultValue.value); // ? componentInfo.props[currentProp] : '-1';
      } else {
        console.log('DEFAULT VALUE NOT FOUND : ', componentInfo.props[propName]);
      }
      componentProps.push({propName, propType, propDefaultValue});
    }
  } else {
    console.log('Component doesn\'t need props, will render as is');
  }
  return {filePath, componentProps, filename};
};

module.exports = yeoman.Base.extend({
  prompting: function () {
    this.log(yosay('Let\'s create tests'));
    var prompts = [
      {
        type: 'input',
        name: 'COMPONENTS_PATH',
        message: 'Give me the path to components please !',
        default: './mobile-client/components/PreSocial/'
      }
    ];
    if (this.options.isNested) {
      this.props = this.options.props;
    } else {
      return this.prompt(prompts).then(function (props) {
        this.props = props;
      }.bind(this));
    }
  },

  writing: function () {
    // console.log(JSON.stringify(this.props.COMPONENTS_PATH, 2, 2));
    const filePaths = read(this.props.COMPONENTS_PATH);
    const metadata = [];
    for (let i = 0; i < filePaths.length; i += 1) {
      const currentFilePath = filePaths[i];
      const completeFilePath = this.props.COMPONENTS_PATH + currentFilePath;
      // const propsArray = extractProps(completeFilePath);
      const componentInfo = extractDefaultProps(completeFilePath);
      metadata.push(componentInfo);
      // i > 2 ? process.exit() : null;
      // const propsArray = extractProps(state.COMPONENTS_PATH + this.props.COMPONENT_NAME + '.js');
    }
    // console.warn({metadata});
    for (let i = 0; i < metadata.length; i += 1) {
      const compMetaData = metadata[i];
      console.warn('writing tests : ' + JSON.stringify(compMetaData, 2, 2));
      this.fs.copyTpl(
        this.templatePath('index.template.js'),
        this.destinationPath('./__tests__/' + compMetaData.filename + '.test.js'),
        _extends({}, compMetaData, {componentsPath: this.props.COMPONENTS_PATH})
        // {...compMetaData, componentsPath: this.props.COMPONENTS_PATH}
      );
    }
    // let propsArray = extractProps(state.COMPONENTS_PATH + this.props.COMPONENT_NAME + '.js');
    // this.fs.copyTpl(
    //   this.templatePath('index.template.js'),
    //   // this.destinationPath(state.TESTS_PATH+components[1].split('.')[0]+'TESTING.test.js'),
    //   this.destinationPath(state.TESTS_PATH + this.props.COMPONENT_NAME + '.test.js'),
    //   // {components: [components[1]], props: [propsArray[1]]}
    //   {components: [this.props.COMPONENT_NAME + '.js'], props: [propsArray]}
    // );
  }
});
