let Config;
let _config = {
  iguanaCorePort: 7778,
  agamaPort: 17777,
  enableCacheApi: true,
  useBasiliskInstance: true,
  openAlias: false,
  debug: true,
  defaultLang: 'EN',
  cli: {
    passthru: true,
    default: true
  },
  iguanaLessMode: true,
};

try {
  Config = window.require('electron').remote.getCurrentWindow().appConfig;
} catch (e) {
  Config = _config;
}

export default Config;