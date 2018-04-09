import React from 'react';
import translate from '../../../translate/translate';
import { connect } from 'react-redux';
import {
  encryptPassphrase,
  loadPinList,
  triggerToaster,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';

const SEED_TRIM_TIMEOUT = 5000;

// TODO: add delete btn

class SeedEncryptPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      seedInputVisibility: false,
      trimPassphraseTimer: null,
      seedExtraSpaces: false,
      wifkeysPassphrase: '',
      encryptKey: '',
      encryptKeyConfirm: '',
    };
    this.defaultState = JSON.parse(JSON.stringify(this.state));
    this.encryptSeed = this.encryptSeed.bind(this);
    this.toggleSeedInputVisibility = this.toggleSeedInputVisibility.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.Dashboard &&
        props.Dashboard.activeSection !== 'settings') {
      this.setState(this.defaultState);

      // reset input vals
      this.refs.wifkeysPassphrase.value = '';
      this.refs.wifkeysPassphraseTextarea.value = '';
      this.refs.encryptKey.value = '';
      this.refs.encryptKeyConfirm.value = '';
    }
  }

  encryptSeed() {
    if (this.state.encryptKey !== this.state.encryptKeyConfirm) {
      Store.dispatch(
        triggerToaster(
          'Encryption keys don\'t match',
          'Seed encrypt',
          'error'
        )
      );
    } else {
      if (!this.state.encryptKey ||
          !this.state.encryptKeyConfirm) {
        Store.dispatch(
          triggerToaster(
            'Encryption key/confirmation field is empty',
            'Seed encrypt',
            'error'
          )
        );
      } else if (this.state.encryptKey === this.state.encryptKeyConfirm) {
        const seedEncryptionKeyEntropy = mainWindow.checkStringEntropy(this.state.encryptKey);

        if (!seedEncryptionKeyEntropy) {
          Store.dispatch(
            triggerToaster(
              'Encryption key/password is weak, please choose a stronger password',
              'Weak password detected',
              'error'
            )
          );
        } else {
          encryptPassphrase(this.state.wifkeysPassphrase, this.state.encryptKey)
          .then((res) => {
            if (res.msg === 'success') {
              Store.dispatch(loadPinList());
            }
          });
        }
      }
    }
  }

  toggleSeedInputVisibility() {
    this.setState({
      seedInputVisibility: !this.state.seedInputVisibility,
    });
  }

  updateInput(e) {
    const newValue = e.target.value;

    clearTimeout(this.state.trimPassphraseTimer);

    const _trimPassphraseTimer = setTimeout(() => {
      if (newValue[0] === ' ' ||
          newValue[newValue.length - 1] === ' ') {
        this.setState({
          seedExtraSpaces: true,
        });
      } else {
        this.setState({
          seedExtraSpaces: false,
        });
      }
    }, SEED_TRIM_TIMEOUT);

    if (e.target.name === 'wifkeysPassphrase') {
      this.resizeLoginTextarea();
    }

    this.setState({
      trimPassphraseTimer: _trimPassphraseTimer,
      [e.target.name === 'wifkeysPassphraseTextarea' ? 'wifkeysPassphrase' : e.target.name]: newValue,
    });
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
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div className="padding-bottom-20">This section allows you to encrypt a seed with a password and store it locally.</div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <div
              className="wifkeys-form"
              autoComplete="off">
              <div className="form-group form-material floating">
                <input
                  type="password"
                  className={ !this.state.seedInputVisibility ? 'form-control' : 'hide' }
                  autoComplete="off"
                  name="wifkeysPassphrase"
                  ref="wifkeysPassphrase"
                  id="wifkeysPassphrase"
                  onChange={ this.updateInput }
                  value={ this.state.wifkeysPassphrase } />
                <textarea
                  className={ this.state.seedInputVisibility ? 'form-control' : 'hide' }
                  autoComplete="off"
                  id="wifkeysPassphraseTextarea"
                  ref="wifkeysPassphraseTextarea"
                  name="wifkeysPassphraseTextarea"
                  onChange={ this.updateInput }
                  value={ this.state.wifkeysPassphrase }></textarea>
                <i
                  className={ 'seed-toggle fa fa-eye' + (!this.state.seedInputVisibility ? '-slash' : '') }
                  onClick={ this.toggleSeedInputVisibility }></i>
                <label
                  className="floating-label"
                  htmlFor="wifkeysPassphrase">{ translate('INDEX.PASSPHRASE') } / WIF</label>
                <div className="form-group form-material floating text-left margin-top-60">
                  <input
                    type="password"
                    name="encryptKey"
                    ref="encryptKey"
                    className="form-control"
                    onChange={ this.updateInput }
                    autoComplete="off"
                    value={ this.state.encryptKey || '' } />
                  <label
                    className="floating-label"
                    htmlFor="encryptKey">Seed encrypt key</label>
                </div>
                <div className="form-group form-material floating text-left margin-top-60 margin-bottom-40">
                  <input
                    type="password"
                    name="encryptKeyConfirm"
                    ref="encryptKeyConfirm"
                    className="form-control"
                    onChange={ this.updateInput }
                    autoComplete="off"
                    value={ this.state.encryptKeyConfirm || '' } />
                  <label
                    className="floating-label"
                    htmlFor="encryptKeyConfirm">Seed encrypt key confirm</label>
                </div>
                { this.state.seedExtraSpaces &&
                  <span>
                    <i className="icon fa-warning seed-extra-spaces-warning"
                      data-tip="Your seed contains leading/trailing space characters"
                      data-html={ true }></i>
                    <ReactTooltip
                      effect="solid"
                      className="text-left" />
                  </span>
                }
              </div>
              <div className="col-sm-12 col-xs-12 text-align-center">
                <button
                  type="button"
                  className="btn btn-primary waves-effect waves-light margin-bottom-5"
                  disabled={
                    !this.state.wifkeysPassphrase ||
                    !this.state.encryptKey ||
                    !this.state.encryptKeyConfirm
                  }
                  onClick={ this.encryptSeed }>Encrypt</button>
              </div>
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

export default connect(mapStateToProps)(SeedEncryptPanel);