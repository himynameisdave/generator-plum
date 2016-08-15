/***
  *     Used to notify the user if they are not in a directory named CSS
  */
const chalk = require('chalk').red;

module.exports = () => {
  const currentDir = process.cwd().split('/')
    .filter((el, i, arr) => (i + 1) === arr.length).pop();
  const tests = [ 'css', '/css', 'style', '/style' ];
  if (tests.some(test => currentDir.indexOf(test) > -1)) {
    return true;
  } else {
    console.log(chalk(`**FYI this generator is usually run from a '/css' or '/styles' directory**\n`));
    return false;
  }
};
