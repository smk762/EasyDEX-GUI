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
        <tr>
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
      $('#debugOut').html(res + ' | ' + _configCopy.dataDir);
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
  }

  window.createWindow('open');
  window.hide();
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

  // run iguana-less mode with no daemons startup
  if (appConf &&
      appConf.iguanaLessMode) {
    // do something
  } else { // run normal mode with 2 iguana instances started prior loading GUI
    if (appConf &&
        !appConf.manualIguanaStart) {
      StartIguana();
    }

    var portcheck;

    function startcheck() {
      portcheck = setInterval(function() {
        Iguana_activehandle(appConf).then(function(result){
          console.log(result);

          if (result !== 'error') {
            stopcheck();

            if (appConf && appConf.useBasiliskInstance) {
              StartIguana_Cache();
            }

            $('#loading_status_text').text('Connecting to Basilisk Network...');
            EDEX_DEXgetinfoAll(appConf.skipBasiliskNetworkCheck, appConf.minNotaries, appConf);
          }
        })
      }, 2000);
    }

    function stopcheck() {
      clearInterval(portcheck);
    }

    startcheck();
  }
}

function IguanaAJAX(url, ajax_data, timeout) {
  return $.ajax({
    data: JSON.stringify(ajax_data),
    url: url,
    type: 'POST',
    dataType: 'json',
    timeout: timeout ? timeout : 120000
    //beforeSend: showLoadingImgFn
  })
  .fail(function(xhr, textStatus, error) {
    // handle request failures
  });
}

function Iguana_activehandle(appConf) {
  return new Promise((resolve) => {
    var ajax_data = {
          'agent': 'SuperNET',
          'method': 'activehandle'
        },
        AjaxOutputData = IguanaAJAX('http://127.0.0.1:' + appConf.iguanaCorePort, ajax_data).done(function(data) {
          //$('#loading_status_text').text('Retrieving active handle...');
          //console.log(AjaxOutputData.responseText);
          AjaxOutputData = JSON.parse(AjaxOutputData.responseText)
          //console.log(AjaxOutputData);
          resolve(AjaxOutputData);
        })
        .fail(function(xhr, textStatus, error) {
         // $('#loading_status_text').text('Retrieving active handle error!');
          // handle request failures
          console.log(xhr.statusText);
          if ( xhr.readyState == 0 ) {
          }
          console.log(textStatus);
          console.log(error);
        });
  });
}
//Iguana_activehandle().then(function(result){
    //console.log(result)
//})

function StartIguana() {
  var ajax_data = { 'herd': 'iguana'};

  console.log(ajax_data);
  $('#agamaModeStatus').text('Starting main iguana instance...');

  $.ajax({
    type: 'POST',
    data: JSON.stringify(ajax_data),
    url: 'http://127.0.0.1:17777/shepherd/herd',
    dataType: 'xml/html/script/json', // expected format for response
    contentType: 'application/json', // send as JSON
    success: function(data, textStatus, jqXHR) {
      var AjaxOutputData = JSON.parse(data);
      console.log('== ActiveHandle Data OutPut ==');
      console.log(AjaxOutputData);
    },
    error: function(xhr, textStatus, error) {
      console.log(xhr.statusText);
      if ( xhr.readyState == 0 ) {
      }
      console.log(textStatus);
      console.log(error);
    }
  });
}

function StartIguana_Cache() {
  $('#agamaModeStatus').text('Starting basilisk iguana instance...');

  var ajax_data = {
    'mode': 'basilisk',
    'coin': 'all'
  };
  var start_iguana_cache= $.ajax({
      type: 'POST',
      data: JSON.stringify(ajax_data),
      url: 'http://127.0.0.1:17777/shepherd/forks',
      contentType: 'application/json', // send as JSON
    })
  start_iguana_cache.done(function(data) {
    _data = JSON.parse(data);
    console.log(_data.result);
    sessionStorage.setItem('IguanaCachePort', _data.result);
  });
}

function EDEX_DEXgetinfoAll(skip, minNotaries, appConf) {
  const remote = require('electron').remote;
  var window = remote.getCurrentWindow();

  if (!skip) {
    var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
        ajax_data = {
          'userpass': tmpIguanaRPCAuth,
          'agent': 'dpow',
          'method': 'notarychains'
        },
        tmp_index = 0,
        tmp_index_failed = 0,
        get_dex_notarychains = IguanaAJAX('http://127.0.0.1:' + appConf.iguanaCorePort, ajax_data, 10000).done(function(data) {
          get_dex_notarychains = JSON.parse(get_dex_notarychains.responseText);
          if (minNotaries > get_dex_notarychains.length) { // if config value exceeds total num of notaries
            minNotaries = get_dex_notarychains.length;
          }
          get_dex_notarychains = get_dex_notarychains.splice(0, minNotaries);

          $.each(get_dex_notarychains, function( coin_index, coin_value ) {
            console.log(coin_index + ': ' + coin_value);
            var tmpIguanaRPCAuth = 'tmpIgRPCUser@' + sessionStorage.getItem('IguanaRPCAuth'),
                ajax_data = {
                  'userpass': tmpIguanaRPCAuth,
                  'agent': 'dex',
                  'method': 'getinfo',
                  'symbol': coin_value
                };

            console.log(ajax_data);

            if (coin_value !== 'MESH' || coin_value !== 'CEAL') {
              var getinfo_each_chain = IguanaAJAX('http://127.0.0.1:' + appConf.iguanaCorePort, ajax_data, 10000).done(function(data) {
                getinfo_each_chain = JSON.parse(getinfo_each_chain.responseText);
                console.log(getinfo_each_chain);

                tmp_index++;
                $('#loading_sub_status_text').text('Connection status... ' + tmp_index + '/' + get_dex_notarychains.length + ': ' + coin_value);

                if (getinfo_each_chain.error === 'less than required responses') {
                  $('#loading_sub_status_output_text').text('Output: ' + getinfo_each_chain.error);
                } else {
                  $('#loading_sub_status_output_text').text('Output: Connected');
                }

                if ( tmp_index + tmp_index_failed === minNotaries ) {
                  console.log('min notaries connected');
                  window.createWindow('open');
                  window.hide();
                }
              })
              .fail(function(xhr, textStatus, error) {
                tmp_index_failed++;

                if ( tmp_index + tmp_index_failed === minNotaries ) {
                  console.log('min notaries connected');
                  window.createWindow('open');
                  window.hide();
                }

                // handle request failures
                console.log(xhr.statusText);
                if ( xhr.readyState == 0 ) {
                }
                console.log(textStatus);
                console.log(error);
              });
            }
          });
        });
  } else {
    window.createWindow('open');
    window.hide();
  }
}