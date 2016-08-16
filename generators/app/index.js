/***
  *
  *       Top level `app` generator
  *
  *       This is the generator that is hit when the user runs
  *
  */
const yeoman  = require('yeoman-generator');
const chalk   = require('chalk');
const banner  = require('../../utils/banner');
const prompts = require('../../utils/_prompts');
const update  = require('../../utils/update');
const cssDirWarn = require('../../utils/cssDirWarn');

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
      this.config.save();
    },
    //  Prompt the user for language, testing, and localConfigs
    prompting() {
      const done = this.async();
      //  TODO: smells like a use case for Promise.all...
      prompts.language.apply(this)
        .then(ans => {
          this.config.set('language', ans.toLowerCase());
          return prompts.testing.apply(this);
        })
        .then(ans => {
          this.config.set('testing', ans);
          return prompts.localConfigs.apply(this);
        })
        .then(ans => {
          this.config.set('localConfigs', ans);
        })
        .catch(e => console.warn)
        .then(() => {
          this.config.save();
          done();
        });
    },
  },
  writing() {
    this.log(chalk.green(`Plum initialized in ${process.cwd()}:`));
  },
  install() {
    //  TODO: maybe a prompt for what they wanna name their default export?
    this.composeWith('plum:export', {args: ['default']});
  }
});
