const mainWindow = window.require('electron').remote.getGlobal('app');
export const electrumServers = JSON.parse(JSON.stringify(mainWindow.electrumServers));
export const mainWindowNonCached = window.require('electron').remote.getCurrentWindow();

console.warn(mainWindowNonCached);

export default mainWindow;