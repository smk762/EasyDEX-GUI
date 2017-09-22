// TODO: merge into react app
let _configCopy;

function toggleDropdown() {
  const _dropdown = $('.dropdown-menu');

  if (_dropdown.hasClass('hide')) {
    _dropdown.removeClass('hide');
  } else {
    _dropdown.addClass('hide');
  }
}

function initSettingsForm() {
  const remote = require('electron').remote;
  let appConf = remote.getCurrentWindow().appConfig;
  let appConfSchema = remote.getCurrentWindow().appConfigSchema;
  _configCopy = Object.assign({}, appConf);

  let _htmlOut = '<table class="settings-table">';
  for (let key in appConf) {
    if (appConfSchema[key] &&
        appConfSchema[key].initDisplay) {
      _htmlOut = `
        ${_htmlOut}
        <tr id="${key}">
          <td class="left">
            ${appConfSchema[key].displayName}`;

      if (appConfSchema[key].info) {
        _htmlOut = `
          ${_htmlOut}
          <div
            class="settings-help"
            title="${appConfSchema[key].info}">
            <img src="../EasyDEX-GUI/assets/mainWindow/img/fa-question.png" />
          </div>`;
      }

      if (appConfSchema[key].type === 'number') {
        _htmlOut = `
          ${_htmlOut}
          </td>
          <td class="right">
            <input
              type="number"
              id="${key}"
              pattern="[0-9]*"
              onKeyup="handleInput('${key}')"
              value="${_configCopy[key]}" />
          </td>
        </tr>`;
      } else if (appConfSchema[key].type === 'string' || appConfSchema[key].type === 'folder') {
        _htmlOut = `
          ${_htmlOut}
          </td>
          <td class="right">
            <input
              type="text"
              id="${key}"
              onKeyup="handleInput('${key}')"
              value="${_configCopy[key]}" />
          </td>
        </tr>`;
      } else if (appConfSchema[key].type === 'boolean') {
        _htmlOut = `${_htmlOut}
          </td>
          <td class="right">
            <label
              class="switch"
              id="${key}"
              onClick="settingsToggle(\'${key}\')">
              ${(appConf[key] ? '<input type="checkbox" class="cb" checked />' : '<input type="checkbox" class="cb" />')}
              <div class="slider"></div>
            </label>
          </td>
        </tr>`;
      }
    }
  }

  _htmlOut = `
    ${_htmlOut}
    </table>`;

  $('#agamaConfigBlock').html(_htmlOut);
}

function hideToastImmediate() {
  $('#toast-container').addClass('hide');
}

function hideToast() {
  setTimeout(function() {
    $('#toast-container').addClass('hide');
  }, 5000);
}

function showToast(type, message) {
  $('#toast-container .toast').removeClass('toast-success').removeClass('toast-error');
  $('#toast-container .toast').addClass(`toast-${type}`);
  $('#toast-container .toast-message').html(message);
  $('#toast-container').removeClass('hide');
  hideToast();
}

function setDefaultAppSettings() {
  const remote = require('electron').remote;

  remote.getCurrentWindow().setDefaultAppSettings();
  remote.getCurrentWindow().appConfig = remote.getCurrentWindow().defaultAppSettings;
  initSettingsForm();
  showToast('success', 'App settings are reset to default');
}

function testBins(binName) {
  const remote = require('electron').remote;
  remote.getCurrentWindow().testBins(binName).
  then(function(res) {
    $('#debugOut').html(JSON.stringify(res, null, '\t'));
  });
}

function handleSaveSettings() {
  if (_configCopy.dataDir &&
      _configCopy.dataDir.length) {
    const remote = require('electron').remote;

    remote.getCurrentWindow().testLocation(_configCopy.dataDir)
    .then(function(res) {
      if (res === -1) {
        showToast('error', 'Komodo datadir path is invalid');
      } else if (res === false) {
        showToast('error', 'Komodo datadir path is not a directory');
      } else {
        // save settings
        remote.getCurrentWindow().updateAppSettings(_configCopy);
        remote.getCurrentWindow().appConfig = _configCopy;
        showToast('success', 'Settings saved');
      }
    });
  } else {
    // save settings
    const remote = require('electron').remote;

    remote.getCurrentWindow().updateAppSettings(_configCopy);
    remote.getCurrentWindow().appConfig = _configCopy;
    showToast('success', 'Settings saved');
  }
}

function handleInput(key) {
  const _value = $(`#${key}`).val();
  _configCopy[key] = _value;
}

function settingsToggle(key) {
  const _value = $(`#${key} .cb`).prop('checked');
  _configCopy[key] = _value;
}

function closeSettingsWindow() {
  const remote = require('electron').remote;
  const window = remote.getCurrentWindow();

  toggleDropdown();
  window.destroyAppSettingsWindow();
}

function reloadSettingsWindow() {
  const remote = require('electron').remote;
  const window = remote.getCurrentWindow();

  window.reloadSettingsWindow();
}

function openSettingsWindow() {
  const remote = require('electron').remote;
  const window = remote.getCurrentWindow();

  $('.dropdown-menu').addClass('hide');
  window.createAppSettingsWindow();
}

function startKMDPassive() {
  const remote = require('electron').remote;
  const window = remote.getCurrentWindow();

  $('.dropdown-menu').addClass('hide');
  disableModeButtons();

  window.startKMDNative('KMD', true);

  window.createWindow('open');
  window.hide();
}

function closeMainWindow(isKmdOnly, isCustom) {
  const remote = require('electron').remote;
  const window = remote.getCurrentWindow();

  $('.dropdown-menu').addClass('hide');
  disableModeButtons();

  if (!isCustom) {
    window.startKMDNative(isKmdOnly ? 'KMD' : null);

    setTimeout(function() {
      window.createWindow('open');
      window.hide();
    }, 3000);
  } else {
    window.createWindow('open');
    window.hide();
  }
}

function quitApp() {
  const remote = require('electron').remote;
  const window = remote.getCurrentWindow();

  window.forseCloseApp();
}

function disableModeButtons() {
  $('#nativeOnlyBtn').attr('disabled', true);
  $('#normalStartBtn').attr('disabled', true);
  $('#settingsBtn').attr('disabled', true);
  $('#nativeOnlyBtnCarret').attr('disabled', true);
}

function normalStart() {
  const remote = require('electron').remote;
  let appConf = remote.getCurrentWindow().appConfig;
  appConf.iguanaLessMode = false;

  $('.dropdown-menu').addClass('hide');
  disableModeButtons();
}