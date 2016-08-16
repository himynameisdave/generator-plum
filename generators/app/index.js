/**
  *    Top level `app` generator
  *    This is the generator that is hit when the user runs
  */
const yeoman  = require('yeoman-generator');
const chalk   = require('chalk');
const banner  = require('../../utils/banner');
const prompts = require('../../utils/_prompts');
const update  = require('../../utils/update');
const cssDirWarn = require('../../utils/cssDirWarn');
const defaultConfig = {
  language: 'sass',
  testing: false,
  localConfigs: false
};


module.exports = yeoman.generators.Base.extend({
  //  Wrap methods in prompting so they run before other Yeoman lifecycle methods
  prompting: {
    //  Check if we need to update the generator and notify the user if they are out of date
    update,
    //  Display the banner for the generator
    banner() {
      this.log(banner());
    },
    cssDirWarn,
    //  Will create a `yo-rc.json` file if none exists
    initConfig() {
      //  Sets defaults in case they aren't created
      this.config.defaults(defaultConfig);
      this.config.save();
    },
    //  Prompt the user for language, testing, and localConfigs
    prompting() {
      const done = this.async();
      //  Prompt for what language to use
      prompts.language.apply(this)
        .then(ans => {
          this.config.set('language', ans.toLowerCase());
      //  Prompt for if user wants testing
          return prompts.testing.apply(this);
        })
        .then(ans => {
          this.config.set('testing', ans);
      //  Prompt for if user wants localConfigs
          return prompts.localConfigs.apply(this);
        })
        .then(ans => {
          this.config.set('localConfigs', ans);
          this.config.save();
          done();
        })
        .catch(e => {
          console.warn(e);
          done();
        });
    },
  },
  writing() {
    this.log(chalk.green(`\nPlum initialized in ${process.cwd()}:`));
  },
  install() {
    //  TODO: maybe a prompt for what they wanna name their default export?
    this.composeWith('plum:export', { args: ['default'] });
  }
});
