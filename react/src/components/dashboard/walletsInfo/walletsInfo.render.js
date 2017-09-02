import React from 'react';
import { translate } from '../../../translate/translate';
import ClaimInterestModal from '../claimInterestModal/claimInterestModal';

const WalletsInfoRender = function() {
  const _progress = this.props.ActiveCoin.progress;

  return (
    <div>
      <div className="col-xlg-6 col-md-4">
        <div className="panel">
          <div className="panel-heading">
            <h3 className="panel-title">{ translate('INDEX.WALLET_INFO') }</h3>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <tbody>
                <tr>
                  <td>{ translate('INDEX.WALLET_VERSION') }</td>
                  <td>
                    { _progress.walletversion }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.BALANCE') }</td>
                  <td>
                    { _progress.balance }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.UNCONFIRMED_BALANCE') }</td>
                  <td></td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.IMMATURE_BALANCE') }</td>
                  <td></td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.TOTAL_TX_COUNT') }</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        { this.props.ActiveCoin.coin === 'KMD' &&
          <div>
            <button
              type="button"
              className="btn btn-success waves-effect waves-light margin-top-20 btn-next"
              onClick={ () => this.openClaimInterestModal() }>{ translate('CLAIM_INTEREST.CLAIM_INTEREST') }</button>
            <ClaimInterestModal />
          </div>
        }
      </div>

      <div className="col-xlg-6 col-md-8">
        <div className="panel">
          <div className="panel-heading">
            <h3 className="panel-title">
              Komodo { translate('INDEX.INFO') }
            </h3>
          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <tbody>
                <tr>
                  <td>{ translate('INDEX.VERSION') }</td>
                  <td>
                    { _progress.KMDversion }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.PROTOCOL_VERSION') }</td>
                  <td>
                    { _progress.protocolversion }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.NOTARIZED') }</td>
                  <td>
                    { _progress.notarized }
                  </td>
                </tr>
                <tr>
                  <td>
                    { translate('INDEX.NOTARIZED') } { translate('INDEX.HASH') }
                  </td>
                  <td>
                    { _progress.notarizedhash ?
                      _progress.notarizedhash.substring(
                        0,
                        Math.floor(_progress.notarizedhash.length / 2)
                      ) +
                      '\t' +
                      _progress.notarizedhash.substring(
                        Math.floor(_progress.notarizedhash.length / 2),
                        _progress.notarizedhash.length
                      )
                      : ''
                    }
                  </td>
                </tr>
                <tr>
                  <td>
                    { translate('INDEX.NOTARIZED') } BTC
                  </td>
                  <td></td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.BLOCKS') }</td>
                  <td>
                    { _progress.blocks }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.CONNECTIONS') }</td>
                  <td>
                    { _progress.connections }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.DIFFICULTY') }</td>
                  <td>
                    { _progress.difficulty }
                  </td>
                </tr>
                <tr>
                  <td>Testnet</td>
                  <td>
                    { _progress.testnet }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.PAY_TX_FEE') }</td>
                  <td>
                    { _progress.paytxfee }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.RELAY_FEE') }</td>
                  <td>
                    { _progress.relayfee }
                  </td>
                </tr>
                <tr>
                  <td>{ translate('INDEX.ERRORS') }</td>
                  <td>
                    { _progress.errors }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsInfoRender;