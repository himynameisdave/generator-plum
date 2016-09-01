const fs = require('fs-extra');
const path = require('path');
const yeoman  = require('yeoman-generator');
const chalk = require('chalk');
const prompts = require('../../utils/prompts.js');
const _prompts = require('../../utils/_prompts.js');

module.exports = yeoman.Base.extend({
  type: 'export',
  location: 'exports',
  stylesheets: ['export'],

  //  If a name arg happens to be passed in, this pulls it into this generator
  //  Coming from the `app` generator
  initializing() {
    this.argument('name', {
      required: false,
      type: String
    });
  },

  //  Prompt for name if none exists
  prompting() {
    const done = this.async();
    if (!this.name) {
      _prompts.askName.call(this, this.type)
      .then(answerName => {
        this.name = answerName;
        done();
      })
      .catch(e => {
        console.warn(e);
        done();
      });
    } else { done(); }
  },
  //  TODO: if this is going to be used in every subgenny, break into module
  writing() {
    //  Stores the language the user wants to use (Sass or Less)
    const lang = this.config.get('language');
    if (!lang) {
      //  If we have no language, we should send them through the main app generator
      this.composeWith('plum');
      return;
    }
    //  Iterate over the stylesheets and copy the template to the new file destination
    this.stylesheets.map(file => {
      fs.copySync(
        path.join(__dirname, '/templates/', `_${file}`), // read
        path.resolve(process.cwd(), `${this.location}/${this.name}.${lang}`) // write
      );
      return console.log(chalk.yellow(`Created file ${this.location}/${this.name}.${lang}`));
    });
  },
  end() {
    const done = this.async();
    prompts.runGenerator.call(this, (answer) => {
      if (answer) {
        prompts.listGenerators.call(this, (answer) => {
          this.composeWith(`plum:${answer}`);
          done();
        });
      } else { done(); }
    });
  }
});
