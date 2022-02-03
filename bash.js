const inquirer = require('inquirer');
const exec = require('child_process').execSync;

inquirer
  .prompt([
    {
      type: 'list',
      name: 'createIcon',
      message: '是否重新生成iconfont组件',
      choices: ['no', 'yes'],
    },
    {
      type: 'list',
      name: 'env',
      message: '请选择启动命令',
      choices: ['dev:weapp --watch', 'dev:weapp'],
    },
  ])
  .then(({ createIcon, env }) => {
    const runStart = () => {
      if (env === 'dev:weapp --watch') {
        exec('npm run build:weapp -- --watch', { stdio: 'inherit' });
      }
      
      if (env === 'dev:weapp') {
        exec('npm run build:weapp --', { stdio: 'inherit' });
      }
    };

    if (createIcon === 'yes') {
      exec('npx iconfont-taro', { stdio: 'inherit' });
    }
    runStart();
  })
  .catch((error) => {
    if (error.signal === 'SIGINT') return;
    console.log(error)
  });
