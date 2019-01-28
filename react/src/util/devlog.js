const devlog = (msg) => {
  const mainWindow = window.require('electron').remote.getGlobal('app');

  if (mainWindow.appConfig.dev ||
      mainWindow.argv.indexOf('devmode') > -1) {
    console.warn(msg);
  }
}

export default devlog;