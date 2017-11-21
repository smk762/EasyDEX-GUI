import React from 'react';
import { translate } from '../../../translate/translate';
import {
  shepherdClearCoindFolder,
  triggerToaster
} from '../../../actions/actionCreators';
import { coindList } from '../../../util/coinHelper';
import Store from '../../../store';

class CoindClearDataDirPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      coin: 'none',
      keepWalletDat: true,
      loading: false,
      displayYesNo: false,
    };
    this.removeCoindData = this.removeCoindData.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.toggleKeepWalletDat = this.toggleKeepWalletDat.bind(this);
    this.displayYesNo = this.displayYesNo.bind(this);
  }

  displayYesNo() {
    this.setState({
      displayYesNo: !this.state.displayYesNo,
    });
  }

  removeCoindData() {
    const _coin = this.state.coin;

    this.setState({
      loading: true,
      displayYesNo: false,
    });

    setTimeout(() => {
      shepherdClearCoindFolder(_coin, this.state.keepWalletDat ? this.state.keepWalletDat : null)
      .then((res) => {
        if (res.msg === 'success') {
          this.setState({
            keepWalletDat: true,
            loading: false,
          });

          Store.dispatch(
            triggerToaster(
              `${_coin} data folder is cleared`,
              translate('TOASTR.WALLET_NOTIFICATION'),
              'success'
            )
          );
        } else {
          Store.dispatch(
            triggerToaster(
              `Unable to clear ${_coin}`,
              translate('TOASTR.WALLET_NOTIFICATION'),
              'error'
            )
          );
        }
      });
    }, 100);
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  toggleKeepWalletDat() {
    this.setState(Object.assign({}, this.state, {
      keepWalletDat: !this.state.keepWalletDat,
    }));
  }

  renderCoinListSelectorOptions() {
    let _items = [];
    let _nativeCoins = coindList();

    _items.push(
      <option
        key={ `coind-clear-data-coins-none` }
        value="none">Pick a coin</option>
    );
    for (let i = 0; i < _nativeCoins.length; i++) {
      if (_nativeCoins[i] !== 'CHIPS') {
        _items.push(
          <option
            key={ `coind-clear-data-coins-${ _nativeCoins[i] }` }
            value={ `${_nativeCoins[i]}` }>{ `${_nativeCoins[i]}` }</option>
        );
      }
    }

    return _items;
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="col-sm-12 padding-bottom-10">
            <h4 className="col-red">
              <i className="fa fa-warning"></i> Warning: the following form will wipe out all native coin data!<br />Don't touch anything if you're not sure what you're doing.
            </h4>
            <div>
              <div className="col-sm-4 no-padding-left text-center">
                <select
                  className="form-control form-material margin-top-20 margin-bottom-10"
                  name="coin"
                  value={ this.state.coin }
                  onChange={ (event) => this.updateInput(event) }
                  autoFocus>
                  { this.renderCoinListSelectorOptions() }
                </select>
                <span className="pointer toggle margin-top-20 block text-left">
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="settings-app-debug-toggle"
                      value={ this.state.keepWalletDat }
                      checked={ this.state.keepWalletDat } />
                    <div
                      className="slider"
                      onClick={ this.toggleKeepWalletDat }></div>
                  </label>
                  <span
                    className="title"
                    onClick={ this.toggleKeepWalletDat }>Keep wallet.dat</span>
                </span>
                { !this.state.displayYesNo &&
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light margin-top-20"
                    disabled={ this.state.loading || this.state.coin === 'none' }
                    onClick={ this.displayYesNo }>{ this.state.loading ? `Deleting ${this.state.coin} data...` : 'Delete' }</button>
                }
                { this.state.displayYesNo &&
                  <div className="margin-top-20">Are you sure you want to clear {this.state.coin} data folder?</div>
                }
                { this.state.displayYesNo &&
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light margin-top-20 margin-right-20"
                    onClick={ this.removeCoindData }>Yes</button>
                }
                { this.state.displayYesNo &&
                  <button
                    type="button"
                    className="btn btn-primary waves-effect waves-light margin-top-20"
                    onClick={ this.displayYesNo }>No</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default CoindClearDataDirPanel;