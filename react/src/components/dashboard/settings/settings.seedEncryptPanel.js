import React from 'react';
import translate from '../../../translate/translate';
import { connect } from 'react-redux';
import {
  encryptPassphrase,
  loadPinList,
  modifyPin,
  changePin,
  triggerToaster,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import mainWindow, { staticVar } from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';

const SEED_TRIM_TIMEOUT = 5000;

class SeedEncryptPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      encryptKey: '',
      encryptKeyConfirm: '',
      action: null,
      actionRenameFname: '',
    };
    this.defaultState = JSON.parse(JSON.stringify(this.state));
    this.encryptSeed = this.encryptSeed.bind(this);
    this.triggerAction = this.triggerAction.bind(this);
    this.cancelAction = this.cancelAction.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  cancelAction() {
    this.setState({
      action: null,
      actionRenameFname: '',
      encryptKey: null,
      encryptKeyConfirm: null,
      encryptKeyOld: null,
    });
  }

  triggerAction(id, type) {
    this.setState({
      action: {
        id,
        type,
      },
      encryptKey: null,
      encryptKeyConfirm: null,
      encryptKeyOld: null,
    });
  }

  confirmAction(id, type) {
    if (type === 'delete') {
      modifyPin(this.props.Login.pinList[id], true)
      .then((res) => {
        if (res.msg === 'success') {
          this.setState({
            action: null,
            actionRenameFname: '',
          });
          Store.dispatch(
            triggerToaster(
              translate('SETTINGS.PIN_REMOVED', this.props.Login.pinList[id]),
              translate('LOGIN.SEED_ENCRYPT'),
              'success'
            )
          );
          Store.dispatch(loadPinList());
        } else {
          Store.dispatch(
            triggerToaster(
              res.result,
              translate('LOGIN.SEED_ENCRYPT'),
              'error'
            )
          );
        }
      });
    } else if (type === 'changepw') {
      const stringEntropy = mainWindow.checkStringEntropy(this.state.customWalletSeed);

      if (this.state.encryptKey !== this.state.encryptKeyConfirm) {
        Store.dispatch(
          triggerToaster(
            translate('LOGIN.ENCRYPTION_KEYS_DONT_MATCH'),
            translate('LOGIN.SEED_ENCRYPT'),
            'error'
          )
        );
      } else {
        if (!this.state.encryptKey ||
            !this.state.encryptKeyConfirm) {
          Store.dispatch(
            triggerToaster(
              translate('LOGIN.ENCRYPTION_KEY_EMPTY'),
              translate('LOGIN.SEED_ENCRYPT'),
              'error'
            )
          );
        } else if (this.state.encryptKey === this.state.encryptKeyConfirm) {
          const seedEncryptionKeyEntropy = mainWindow.checkStringEntropy(this.state.encryptKey);

          if (!seedEncryptionKeyEntropy) {
            Store.dispatch(
              triggerToaster(
                translate('LOGIN.SEED_ENCRYPTION_WEAK_PW'),
                translate('LOGIN.WEAK_PW'),
                'error'
              )
            );
          } else {
            changePin(
              this.state.encryptKeyOld,
              this.state.encryptKey,
              this.props.Login.pinList[id]
            )
            .then((res) => {
              if (res.msg === 'success') {
                Store.dispatch(
                  triggerToaster(
                    translate('INDEX.PASSPHRASE_SUCCESSFULLY_CHANGED_PIN', this.props.Login.pinList[id]),
                    translate('KMD_NATIVE.SUCCESS'),
                    'success'
                  )
                );
                this.setState({
                  action: null,
                  actionRenameFname: '',
                  encryptKey: null,
                  encryptKeyConfirm: null,
                  encryptKeyOld: null,
                });
              }
            });
          }
        }
      }
    } else {
      const _customPinFilenameTest = /^[0-9a-zA-Z-_]+$/g;

      if (this.state.actionRenameFname &&
          _customPinFilenameTest.test(this.state.actionRenameFname)) {
        modifyPin(
          this.props.Login.pinList[id],
          null,
          this.state.actionRenameFname
        )
        .then((res) => {
          if (res.msg === 'success') {
            this.setState({
              action: null,
              actionRenameFname: '',
            });
            Store.dispatch(
              triggerToaster(
                translate('SETTINGS.PIN_RENAMED', this.props.Login.pinList[id]),
                translate('LOGIN.SEED_ENCRYPT'),
                'success'
              )
            );
            Store.dispatch(loadPinList());
          } else {
            Store.dispatch(
              triggerToaster(
                res.result,
                translate('LOGIN.SEED_ENCRYPT'),
                'error'
              )
            );
          }
        });
      } else {
        Store.dispatch(
          triggerToaster(
            translate('LOGIN.CUSTOM_PIN_FNAME_INFO'),
            translate('LOGIN.ERR_SEED_STORAGE'),
            'error'
          )
        );
      }
    }
  }

  componentWillReceiveProps(props) {
    if (props.Dashboard &&
        props.Dashboard.activeSection !== 'settings') {
      this.setState(this.defaultState);
    }
  }

  encryptSeed() {
    if (this.state.encryptKey !== this.state.encryptKeyConfirm) {
      Store.dispatch(
        triggerToaster(
          translate('LOGIN.ENCRYPTION_KEYS_DONT_MATCH'),
          translate('LOGIN.SEED_ENCRYPT'),
          'error'
        )
      );
    } else {
      if (!this.state.encryptKey ||
          !this.state.encryptKeyConfirm) {
        Store.dispatch(
          triggerToaster(
            translate('LOGIN.ENCRYPTION_KEY_EMPTY'),
            translate('LOGIN.SEED_ENCRYPT'),
            'error'
          )
        );
      } else if (this.state.encryptKey === this.state.encryptKeyConfirm) {
        const seedEncryptionKeyEntropy = mainWindow.checkStringEntropy(this.state.encryptKey);

        if (!seedEncryptionKeyEntropy) {
          Store.dispatch(
            triggerToaster(
              translate('LOGIN.SEED_ENCRYPTION_WEAK_PW'),
              translate('LOGIN.WEAK_PW'),
              'error'
            )
          );
        } else {
          encryptPassphrase(
            this.state.wifkeysPassphrase,
            this.state.encryptKey
          )
          .then((res) => {
            if (res.msg === 'success') {
              Store.dispatch(loadPinList());
            }
          });
        }
      }
    }
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  renderPinsList() {
    const _pins = this.props.Login.pinList;
    let _items = [];

    for (let i = 0; i < _pins.length; i++) {
      if (!this.state.action || (this.state.action && this.state.action.id !== i)) {
        _items.push(
          <tr key={ `pins-list-item-${i}` }>
            <td>
              <i
                onClick={ () => this.triggerAction(i) }
                className="icon fa-pencil-square margin-right-20"></i>
              <i
                onClick={ () => this.triggerAction(i, 'delete') }
                className="icon fa-trash"></i>
            </td>
            <td className="selectable">{ _pins[i] }</td>
            { this.props.Settings.appInfo &&
              this.props.Settings.appInfo.dirs &&
              this.props.Settings.appInfo.dirs.agamaDir &&
              <td className="selectable">
              { this.props.Settings.appInfo.dirs.agamaDir }/shepherd/pin/{ _pins[i] }.pin
              </td>
            }
          </tr>
        );
      } else {
        _items.push(
          <tr key={ `pins-list-item-${i}` }>
            <td colSpan="3">
            { this.state.action.type === 'delete' &&
              <div className="margin-bottom-10 margin-top-10">
                { translate('SETTINGS.PIN_REMOVE_CONFIRM', _pins[i] + '.pin') }
                <i
                  onClick={ () => this.confirmAction(i, 'delete') }
                  className="icon fa-check margin-left-20 margin-right-20"></i>
                <i
                  onClick={ () => this.cancelAction() }
                  className="icon fa-close"></i>
              </div>
            }
            { !this.state.action.type &&
              <div className="pin-modify-block">
                <div className="margin-bottom-20">
                  <strong>{ translate('SETTINGS.RENAME_PIN') }</strong>
                </div>
                <div className="margin-bottom-10">
                  { translate('SETTINGS.OLD_PIN_NAME') }: <span className="selectable">{ _pins[i] }</span>
                </div>
                <div className="margin-bottom-10">
                  <input
                    type="text"
                    name="actionRenameFname"
                    ref="actionRenameFname"
                    className="form-control inline"
                    onChange={ this.updateInput }
                    autoComplete="off"
                    placeholder={ translate('SETTINGS.NEW_PIN_NAME') }
                    value={ this.state.actionRenameFname || '' } />
                  <i
                    onClick={ () => this.confirmAction(i) }
                    className="icon fa-check margin-left-20 margin-right-20 inline"></i>
                  <i
                    onClick={ () => this.cancelAction() }
                    className="icon fa-close inline"></i>
                </div>
              </div>
            }
            { !this.state.action.type &&
              <div className="pin-modify-block padding-bottom-20">
                <hr />
                <div className="margin-bottom-10">
                  <strong>{ translate('SETTINGS.CHANGE_PIN') }</strong>
                </div>
                <div className="margin-bottom-10">
                  <input
                    type="password"
                    name="encryptKeyOld"
                    ref="encryptKeyOld"
                    className="form-control inline"
                    onChange={ this.updateInput }
                    autoComplete="off"
                    placeholder={ translate('LOGIN.SEED_ENCRYPT_KEY_OLD') }
                    value={ this.state.encryptKeyOld || '' } />
                </div>
                <div className="margin-bottom-10">
                  <input
                    type="password"
                    name="encryptKey"
                    ref="encryptKey"
                    className="form-control inline"
                    onChange={ this.updateInput }
                    autoComplete="off"
                    placeholder={ translate('LOGIN.SEED_ENCRYPT_KEY_NEW') }
                    value={ this.state.encryptKey || '' } />
                </div>
                <div className="margin-bottom-10">
                  <input
                    type="password"
                    name="encryptKeyConfirm"
                    ref="encryptKeyConfirm"
                    className="form-control inline"
                    onChange={ this.updateInput }
                    autoComplete="off"
                    placeholder={ translate('LOGIN.SEED_ENCRYPT_KEY_CONFIRM_NEW') }
                    value={ this.state.encryptKeyConfirm || '' } />
                  <i
                    onClick={ () => this.confirmAction(i, 'changepw') }
                    className="icon fa-check margin-left-20 margin-right-20 inline"></i>
                  <i
                    onClick={ () => this.cancelAction() }
                    className="icon fa-close inline"></i>
                </div>
              </div>
            }
            </td>
          </tr>
        );
      }
    }

    return (
      <table className="table table-hover dataTable table-striped pins-list-table">
        <thead>
          <tr>
            <th></th>
            <th>{ translate('SETTINGS.PIN_NAME') }</th>
            <th>{ translate('SETTINGS.LOCATION') }</th>
          </tr>
        </thead>
        <tbody>
        { _items }
        </tbody>
        <tfoot>
          <tr>
            <th></th>
            <th>{ translate('SETTINGS.PIN_NAME') }</th>
            <th>{ translate('SETTINGS.LOCATION') }</th>
          </tr>
        </tfoot>
      </table>
    );
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12">
            <div className="padding-bottom-20">
              { translate('SETTINGS.THIS_SECTION_ALLOWS_YOU_TO_ENCRYPT') }
            </div>
          </div>
        </div>
        { this.props.Login.pinList.length > 0 &&
          <div className="row">
            <div className="col-sm-12">
              { this.renderPinsList() }
            </div>
          </div>
        }
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    ActiveCoin: {
      coin: state.ActiveCoin.coin,
    },
    Login: state.Login,
    Settings: state.Settings,
  };
};

export default connect(mapStateToProps)(SeedEncryptPanel);