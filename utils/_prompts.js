// const fs = require('fs');
// const path = require('path');
const pkg = require('../package.json');
//  List of generators based on the files list in our package.json
const generatorsList = pkg.files.filter(file => file !== 'app' && file !== 'base');


//  Each prompt is called using .apply which passes in the `this` context (reffering to the generator)
const prompts = {
  language() {
    return this.prompt({
      type: 'list',
      name: 'language',
      message: 'Do you want to use Sass or Less?',
      choices: ['Sass', 'Less']
    });
  },
  testing() {
    return this.prompt({
      type: 'confirm',
      name: 'testing',
      message: 'Would you like to add visual regression testing, using CasperJS?',
      default: false
    });
  },
  localConfigs() {
    return this.prompt({
      type: 'confirm',
      name: 'localConfigs',
      message: 'Would you like to have local configs for your modules/units/pages etc. ?',
      default: false
    });
  },
  listGenerators() {
    return this.prompt({
      type: 'list',
      name: 'generator',
      message: 'Which generator would you like to run?',
      choices: generatorsList
    });
  },
  askName(type) {
    return this.prompt({
      type: 'question',
      name: 'name',
      message: `What would you like to name this ${type}?`,
    });
  }
};

module.exports = prompts;
