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

// const pkg     = require('../../package.json');

//  TODO: break off later
const doPrompt = (promptType) => {
  return ans => {
    console.log("prompt over, heres ans", ans);
    this.config.set('promptType');
  };
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
      this.config.save();
    },
    //  Prompt the user for language, testing, and localConfigs
    prompting() {
      const done = this.async();
      prompts.language.apply(this)
        .then(ans => {
          console.log("prompt over, heres ans", ans);
          // this.config.set();
          return prompts.testing.apply(this);
        })
        .then(ans => {
          // this.config.set();
          return prompts.localConfigs.apply(this);
        })
        .catch(e => {
          console.warn(e);
        })
        .then(() => {
          done();
        });
    },
  },
  writing: {
    app: function () {

      console.log("yo momma");



      // this.fs.copy(this.templatePath('_yo-rc.json'), this.destinationPath('.yo-rc.json'));

      this.config.save();


      this.log(chalk.green('Plum application initialized in ' + process.cwd() + '.'));
    }
  },

  install: function () {
    this.composeWith('plum:export', {args: ['default']});
  }
});
