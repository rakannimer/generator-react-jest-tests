var state = require('../generators/initialState');
var actionNameCreator = {
  readActionsFromUserland: function(){
    try {
      var file = require("html-wiring").readFileAsString(state.CONSTANTS_PATH+"ACTION_NAMES.json");
      var parsedActions = JSON.parse(file);
      return parsedActions;
    }
    catch(err){
      console.warn("Error reading constants : ", err);
      return {};
    }
  },
  actionsToPrettyString: function(actionNames){
    var actionNamesArray = Object.keys(actionNames).map(function(actionName){return actionName});
    var actionNamesString = actionNamesArray.reduce(function(prev, current){
      return prev+" \n"+"******   "+current+" ";
    },"")
    return actionNamesString;
  },

  addActions: function(newActions){
    var oldActions = this.readActionsFromUserland();
    var updatedActions = {};

    Object.keys(oldActions).forEach(function (actionName){
      updatedActions[actionName] = actionName;
    })

    newActions.forEach(function(newActionName){
      updatedActions[newActionName] = newActionName;
    })
    return updatedActions;
  },
  writeActions: function(generator, actions){
    var file = require("html-wiring").writeFileFromString( JSON.stringify(actions, 2, 2), state.CONSTANTS_PATH+"ACTION_NAMES.json");

  },
  logActions: function(){
    var actionNames = this.readActionsFromUserland(this);
    var actionNamesString = this.actionsToPrettyString(actionNames);
    console.log(
        "I found the following actions: "+actionNamesString
    );

  }
};

module.exports = actionNameCreator;
