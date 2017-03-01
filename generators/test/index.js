'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var fs = require('fs');
var read = require('fs-readdir-recursive');
var reactDocs = require('react-docgen');
var debug = require('debug');
const prettier = require('prettier');

const log = debug('generator-react-jest-tests:log');
const error = debug('generator-react-jest-tests:error');

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
  log('filenameFromPath ', filePath);
  const filePathNoExtension = filePath.split('.js');
  const filePathNoExtensionArray = filePathNoExtension[0].split('/');
  const filename = filePathNoExtensionArray[filePathNoExtensionArray.length - 1];
  return filename;
};

const generateFakeProp = ({propName, name, value}) => {
  log('generateFakeProp ', {propName, name, value});
  const isShape = typeof (value) === 'object';
  if (isShape) {
    const fakeShape = {};
    Object.keys(value).forEach(shapeChildName => {
      const fakeProp = generateFakeProp({propName, name: shapeChildName, value: value[shapeChildName].name});
      const fakePropName = fakeProp.name;
      const fakePropValue = fakeProp.value;
      fakeShape[fakePropName] = fakePropValue;
    });
    return {propName, name, value: fakeShape};
  }
  switch (value) {
    case 'number':
      return {name, value: 42};
    case 'string':
      return {name, value: 'defaultString'};
    case 'bool':
      return {name, value: true};
    case 'array':
      return {name, value: []};
    default:
      switch (name) {
        case 'func':
          return {name, value: '() => {}'};
        case 'number':
          return {name, value: 42};
        case 'string':
          return {name, value: 'defaultString'};
        case 'bool':
          return {name, value: true};
        case 'array':
          return {name, value: []};
        default:
          return {name, value: 'unrecognizedType ' + name + ' ' + value + ', consider reporting error to react-jest-test-generator.'};
      }

  }
  // return {name, value};
};

const extractDefaultProps = (filePath, currentFilePath) => {
  log('extractDefaultProps ', {filePath, currentFilePath});
  const filename = filenameFromPath(filePath); // filePathNoExtensionArray[filePathNoExtensionArray.length - 1];
  const fileString = fs.readFileSync(filePath, 'utf8');
  try {
    var componentInfo = reactDocs.parse(fileString);
  } catch (err) {
    console.log('caught error ;)');
    throw new Error(err);
  }
  const componentProps = [];
  const componentHasProps = componentInfo.props ? componentInfo.props : false;
  if (!componentHasProps) {
    error('No props found in ', filename, ' at ', filePath);
    return {filePath, componentProps, filename, currentFilePath};
  }

  const propNames = Object.keys(componentInfo.props);
  for (let i = 0; i < propNames.length; i += 1) {
    const propName = propNames[i];
    let propType;
    if (componentInfo.props[propName].type) {
      propType = componentInfo.props[propName].type.name;
    } else {
      error('propType not set for ' + propName + ' in ' + filename + ' at ' + currentFilePath + ' consider setting it in propTypes');
      propType = 'string';
    }
    let propDefaultValue;
    const hasDefaultvalue = componentInfo.props[propName].defaultValue ? componentInfo.props[propName].defaultValue : false;
    if (hasDefaultvalue) {
      //eslint-disable-next-line
      error(componentInfo.props[propName].defaultValue);
      propDefaultValue = componentInfo.props[propName].defaultValue.value; // ? componentInfo.props[currentProp] : '-1';
      error({propName, propType, propDefaultValue});
    } else {
      error('defaultProps value not set for ' + propName + ' in ' + filename + ' at ' + currentFilePath + ' consider setting it  in defaultProps');
      error('!!! Will try to generate fake data this might cause unexpected results !!!');
      const {type, required, description} = componentInfo.props[propName];
      // const {name, value} = type;
      const {name, value} = type;
      const fakeProp = generateFakeProp({propName, name, value});
      propDefaultValue = fakeProp.value;
      log('Generated ', fakeProp, 'returning it as ', {propName, propType, propDefaultValue, currentFilePath});
    }
    componentProps.push({propName, propType, propDefaultValue, currentFilePath});
    // process.exit();
  }
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
      const completeFilePath = this.props.COMPONENTS_PATH + currentFilePath;
      try {
        const componentInfo = extractDefaultProps(completeFilePath, currentFilePath);
        metadata.push(componentInfo);
      } catch (err) {
        error('Couldnt extractDefaultProps from ' + currentFilePath + ' at ' + completeFilePath);
        error(err);
        // process.exit();
      }
    }
    for (let i = 0; i < metadata.length; i += 1) {
      const compMetaData = metadata[i];
      const testPath = './__tests__/' + compMetaData.filename + '.test.js';
      this.fs.copyTpl(
        this.templatePath('index.template.js'),
        this.destinationPath(testPath),
        _extends({}, compMetaData, {componentsPath: this.props.COMPONENTS_PATH})
      );
      try {
        const generatedTestCode = this.fs.read(testPath);
        const formattedTestCode = prettier.format(generatedTestCode, {
          singleQuote: true,
          trailingComma: 'all'
        });
        this.fs.write(testPath, formattedTestCode);
      } catch (err) {
        error('Couldnt lint generated code :( from ' + compMetaData);
      }
    }
  }
});
