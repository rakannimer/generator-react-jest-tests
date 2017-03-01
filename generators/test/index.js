'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var fs = require('fs');
var read = require('fs-readdir-recursive');
var reactDocs = require('react-docgen');

const _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

const filenameFromPath = filePath => {
  const filePathNoExtension = filePath.split('.js');
  const filePathNoExtensionArray = filePathNoExtension[0].split('/');
  const filename = filePathNoExtensionArray[filePathNoExtensionArray.length - 1];
  return filename;
};

const extractDefaultProps = (filePath, currentFilePath) => {
  // const filePathNoExtension = filePath.split('.js');
  // const filePathNoExtensionArray = filePathNoExtension[0].split('/');
  const filename = filenameFromPath(filePath); // filePathNoExtensionArray[filePathNoExtensionArray.length - 1];
  console.log({filename});
  const fileString = fs.readFileSync(filePath, 'utf8');
  var componentInfo = reactDocs.parse(fileString);
  const componentProps = [];
  if (componentInfo.props) {
    const props = Object.keys(componentInfo.props);
    for (let i = 0; i < props.length; i += 1) {
      const propName = props[i];
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
      componentProps.push({propName, propType, propDefaultValue, currentFilePath});
    }
  } else {
    console.log('Component doesn\'t need props, will render as is');
  }
  console.log({filePath, componentProps, filename, currentFilePath});
  return {filePath, componentProps, filename, currentFilePath};
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
    const filePaths = read(this.props.COMPONENTS_PATH);
    const metadata = [];
    for (let i = 0; i < filePaths.length; i += 1) {
      const currentFilePath = filePaths[i];
      console.log({currentFilePath});
      const completeFilePath = this.props.COMPONENTS_PATH + currentFilePath;
      try {
        const componentInfo = extractDefaultProps(completeFilePath, currentFilePath);
        metadata.push(componentInfo);
      } catch (err) {
        console.warn('Error parsing ' + currentFilePath);
      }
    }
    for (let i = 0; i < metadata.length; i += 1) {
      const compMetaData = metadata[i];
      console.log({compMetaData});
      console.warn('writing tests : ' + JSON.stringify(compMetaData, 2, 2));
      this.fs.copyTpl(
        this.templatePath('index.template.js'),
        this.destinationPath('./__tests__/' + compMetaData.filename + '.test.js'),
        _extends({}, compMetaData, {componentsPath: this.props.COMPONENTS_PATH})
      );
    }
  }
});
