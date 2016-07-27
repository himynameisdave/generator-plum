const purple = require('chalk').magenta;
const version = require('../package.json').version;

module.exports = () => purple(
  '\n  ------------------------\n' +
  '       generator-plum     \n' +
  `           v${version}         \n` +
  '  ------------------------\n'
);
