const fs = require('fs-extra');
const path = require('path');
const yeoman  = require('yeoman-generator');
const prompts = require('../../utils/prompts.js');
const _prompts = require('../../utils/_prompts.js');

module.exports = yeoman.generators.Base.extend({
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
      .catch(console.warn)
    } else { done(); }
  },

//  TODO: maybe remove this...
  configuring: function () {
    this.filePaths = this.stylesheets.map(function(file) {
      return {
        dest: this.location + '/' + this.name + '.scss',
        src: '_' + file + '.scss'
      };
    }.bind(this));
  },


  writing() {
//  TODO: if this is going to be used in every subgenny, break into module
    //  Stores the language the user wants to use (Sass or Less)
    const lang = this.config.get('language');
    if (!lang) {
      //  If we have no language, we should send them through the main app generator
      this.composeWith('plum');
      return;
    }


    const reader = (read, write) => {
      const paths = {
        read: path.join(__dirname, '/templates/', read),
        write: path.resolve(process.cwd(), write)
      };
      console.log(`\n\n${paths.read}\n\n${paths.write}\n\n`);
      fs.copySync(paths.read, paths.write);
    };

    //  the actual extension to be used based on the language
    const ext = lang === 'less' ? '.less' : '.scss';
    //  TODO: this could be reduced to a single .map
    this.stylesheets.map(file => ({
      dest: `${this.location}/${this.name}${ext}`,
      src: `_${file}${ext}`
    })).map(path => {

      reader(path.src, path.dest);

      this.fs.copy(
        this.templatePath(path.src),
        this.destinationPath(path.dest)
      )
    });
  },
  end: function () {
    var done = this.async();

    prompts.runGenerator.call(this, function(answer) {
      if(answer) {
        prompts.listGenerators.call(this, function(answer) {
          this.composeWith('plum:' + answer);
          done();
        }.bind(this));
      } else {
        done();
      }
    }.bind(this));
  }
});
