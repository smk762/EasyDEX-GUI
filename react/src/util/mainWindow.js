const mainWindow = window.require('electron').remote.getGlobal('app');
console.warn(mainWindow);
export default mainWindow;