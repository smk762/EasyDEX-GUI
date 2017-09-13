import React from 'react';
import { translate } from '../../../translate/translate';
import { connect } from 'react-redux';
import {
  encryptWallet,
  settingsWifkeyState,
} from '../../../actions/actionCreators';
import Store from '../../../store';

class ExportKeysPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      exportWifKeysRaw: false,
      seedInputVisibility: false,
      trimPassphraseTimer: null,
      wifkeysPassphrase: '',
    };
    this.exportWifKeys = this.exportWifKeys.bind(this);
    this.exportWifKeysRaw = this.exportWifKeysRaw.bind(this);
    this.toggleSeedInputVisibility = this.toggleSeedInputVisibility.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  exportWifKeys() {
    Store.dispatch(
      encryptWallet(
        this.state.wifkeysPassphrase,
        settingsWifkeyState,
        this.props.ActiveCoin.coin
      )
    );
  }

  exportWifKeysRaw() {
    this.setState(Object.assign({}, this.state, {
      exportWifKeysRaw: !this.state.exportWifKeysRaw,
    }));
  }

  toggleSeedInputVisibility() {
    this.setState({
      seedInputVisibility: !this.state.seedInputVisibility,
    });
  }

  renderExportWifKeysRaw() {
    const _wifKeysResponse = this.props.Settings.wifkey;

    if (_wifKeysResponse &&
        this.state.exportWifKeysRaw) {
      return (
        <div className="padding-bottom-30 padding-top-30">
          { JSON.stringify(_wifKeysResponse, null, '\t') }
        </div>
      );
    } else {
      return null;
    }
  }

  renderWifKeys() {
    let items = [];

    if (this.props.Settings.wifkey) {
      const _wifKeys = this.props.Settings.wifkey;

      for (let i = 0; i < 2; i++) {
        items.push(
          <tr key={ `wif-export-table-header-${i}` }>
            <td className="padding-bottom-10 padding-top-10">
              <strong>{ i === 0 ? translate('SETTINGS.ADDRESS_LIST') : translate('SETTINGS.WIF_KEY_LIST') }</strong>
            </td>
            <td className="padding-bottom-10 padding-top-10"></td>
          </tr>
        );

        for (let _key in _wifKeys) {
          if ((i === 0 && _key.length === 3 && _key !== 'tag') ||
              (i === 1 && _key.indexOf('wif') > -1)) {
            items.push(
              <tr key={ _key }>
                <td>{ _key }</td>
                <td className="padding-left-15">{ _wifKeys[_key] }</td>
              </tr>
            );
          }
        }
      }

      return items;
    } else {
      return null;
    }
  }

  updateInput(e) {
    if (e.target.name === 'wifkeysPassphrase') {
      // remove any empty chars from the start/end of the string
      const newValue = e.target.value;

      clearTimeout(this.state.trimPassphraseTimer);

      const _trimPassphraseTimer = setTimeout(() => {
        this.setState({
          wifkeysPassphrase: newValue ? newValue.trim() : '', // hardcoded field name
        });
      }, 2000);

      this.resizeLoginTextarea();

      this.setState({
        trimPassphraseTimer: _trimPassphraseTimer,
        [e.target.name]: newValue,
      });
    } else {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
  }

  resizeLoginTextarea() {
    // auto-size textarea
    setTimeout(() => {
      if (this.state.seedInputVisibility) {
        document.querySelector('#wifkeysPassphraseTextarea').style.height = '1px';
        document.querySelector('#wifkeysPassphraseTextarea').style.height = `${(15 + document.querySelector('#wifkeysPassphraseTextarea').scrollHeight)}px`;
      }
    }, 100);
  }

  renderLB(_translationID) {
    const _translationComponents = translate(_translationID).split('<br>');

    return _translationComponents.map((_translation) =>
      <span key={ `settings-label-${Math.random(0, 9) * 10}` }>
        { _translation }
        <br />
      </span>
    );
  }

  render() {
    return (
      <div className="panel-body">
        <div>
          <div className="padding-bottom-20">{ this.renderLB('INDEX.ONLY_ACTIVE_WIF_KEYS') }</div>
          <div className="padding-bottom-20">
            <i>{ this.renderLB('SETTINGS.EXPORT_KEYS_NOTE') }</i>
          </div>
          <strong>
            <i>{ translate('INDEX.PLEASE_KEEP_KEYS_SAFE') }</i>
          </strong>
        </div>
        <div className="col-sm-12"></div>
        <form
          className="wifkeys-form"
          method="post"
          action="javascript:"
          autoComplete="off">
          <div className="form-group form-material floating">
            <input
              type="password"
              className={ !this.state.seedInputVisibility ? 'form-control' : 'hide' }
              name="wifkeysPassphrase"
              id="wifkeysPassphrase"
              onChange={ this.updateInput }
              value={ this.state.wifkeysPassphrase } />
            <textarea
              className={ this.state.seedInputVisibility ? 'form-control' : 'hide' }
              id="wifkeysPassphraseTextarea"
              name="wifkeysPassphrase"
              onChange={ this.updateInput }
              value={ this.state.wifkeysPassphrase }></textarea>
            <i
              className={ 'seed-toggle fa fa-eye' + (!this.state.seedInputVisibility ? '-slash' : '') }
              onClick={ this.toggleSeedInputVisibility }></i>
            <label
              className="floating-label"
              htmlFor="wifkeysPassphrase">{ translate('INDEX.PASSPHRASE') }</label>
          </div>
          <div className="col-sm-12 col-xs-12 text-align-center">
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light"
              onClick={ this.exportWifKeys }>{ translate('INDEX.GET_WIF_KEYS') }</button>
          </div>
        </form>

        <div className="col-sm-12 padding-top-15">
          <div className="row">
            <table className="table">
              { this.renderWifKeys() }
            </table>
            <div className={ this.props.wifkey ? 'col-sm-12 col-xs-12 text-align-center' : 'hide' }>
              <button
                type="button"
                className="btn btn-primary waves-effect waves-light"
                onClick={ this.exportWifKeysRaw }>{ this.state.exportWifKeysRaw ? 'Hide' : 'Show' } raw data</button>
            </div>
            <div className={ this.state.exportWifKeysRaw ? 'col-sm-12 col-xs-12 text-align-center' : 'hide' }>
              { this.renderExportWifKeysRaw() }
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
    },
    Settings: state.Settings,
  };
};

export default connect(mapStateToProps)(ExportKeysPanel);