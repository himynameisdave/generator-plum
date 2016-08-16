// const fs = require('fs');
// const path = require('path');
const pkg = require('../package.json');
//  List of generators based on the files list in our package.json
const generatorsList = pkg.files.filter(file => file !== 'app' && file !== 'base');


//  Each prompt is called using .apply which passes in the `this` context (reffering to the generator)
const prompts = {
  language() {
    return new Promise((res, rej) => {
      this.prompt({
        type: 'list',
        name: 'language',
        message: 'Do you want to use Sass or Less?',
        choices: ['Sass', 'Less']
      }, answer => {
        if (!answer) rej(new Error('Error with language prompt!'));
        res(answer.language);
      });
    });
  },
  testing() {
    return new Promise((res, rej) => {
      this.prompt({
        type: 'confirm',
        name: 'testing',
        message: 'Would you like to add visual regression testing, using CasperJS?',
        default: false
      }, answer => {
        if (!answer) rej(new Error('Error with testing prompt!'));
        res(answer.testing);
      });
    });
  },
  localConfigs() {
    return new Promise((res, rej) => {
      this.prompt({
        type: 'confirm',
        name: 'localConfigs',
        message: 'Would you like to have local configs for your modules/units/pages etc. ?',
        default: false
      }, answer => {
        if (!answer) rej(new Error('Error with localConfigs prompt!'));
        res(answer.localConfigs);
      });
    });
  },
  listGenerators() {
    return new Promise((res, rej) => {
      this.prompt({
        type: 'list',
        name: 'generator',
        message: 'Which generator would you like to run?',
        choices: generatorsList
      }, answer => {
        if (!answer) rej(new Error('Error with listGenerators prompt!'));
        res(answer);
      });
    });
  },
  askName(type) {
    return new Promise((res, rej) => {
      this.prompt({
        type: 'question',
        name: 'name',
        message: `What would you like to name this ${type}?`,
      }, answer => {
        if (!answer) rej(new Error('Error with askName prompt!'));
        res(answer);
      });
    });
  }
};

module.exports = prompts;
