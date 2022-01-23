const inquirer = require('inquirer');
const exec = require('child_process').execSync;

inquirer
  .prompt([
    {
      type: 'list',
      name: 'env',
      message: '请选择启动命令',
      choices: ['dev:weapp --watch', 'dev:weapp'],
    },
  ])
  .then(({ env }) => {
    const runStart = () => {
      if (env === 'dev:weapp --watch') {
        exec('npm run build:weapp -- --watch', { stdio: 'inherit' });
      }
      
      if (env === 'dev:weapp') {
        exec('npm run build:weapp --', { stdio: 'inherit' });
      }
    };
    runStart();
  })
  .catch((error) => {
    if (error.signal === 'SIGINT') return;
    console.log(error)
  });
