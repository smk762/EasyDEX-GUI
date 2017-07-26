import React from 'react';
import { translate } from '../../../translate/translate';
import { formatValue } from '../../../util/formatValue';
import Config from '../../../config';

const WalletsBalanceRender = function() {
  return (
    <div id="wallet-widgets">
      <div className="col-xs-12">
        <div className={ this.isFullMode() && !this.isFullySynced() ? 'col-xs-12' : 'col-xs-12 hide' }>
          <div className="alert alert-info alert-dismissible">
            <h4>{ translate('INDEX.ACTIVATING_WALLET_RT') }</h4>
            <p>{ translate('INDEX.IGUANA_FULL_MODE_SYNC_P1') }</p>
            <p>{ translate('INDEX.IGUANA_FULL_MODE_SYNC_P2') }</p>
            <p className="font-weight-600">{ this.renderLB('INDEX.IGUANA_FULL_MODE_SYNC_P3') }</p>
          </div>

          <div className="alert alert-info alert-dismissible hide">
            <h4>{ translate('INDEX.FETCHING_COIN_DATA') }</h4>
            <p>{ translate('INDEX.IGUANA_FULL_MODE_SYNC_P1') }</p>
            <p>{ translate('INDEX.IGUANA_FULL_MODE_SYNC_P2') }</p>
            <p className="font-weight-600">{ this.renderLB('INDEX.IGUANA_FULL_MODE_SYNC_P3') }</p>
          </div>
        </div>

        <div className={ this.isNativeMode() ? 'col-lg-3 col-xs-12' : this.isBasiliskMode() ? 'col-lg-4 col-xs-12' : 'col-lg-12 col-xs-12'}>
          <div className="widget widget-shadow">
            <div className="widget-content">
              <div className="padding-20 padding-top-10">
                <div className="clearfix">
                  <div className="pull-left padding-vertical-10">
                    <i className="icon fa-eye font-size-24 vertical-align-bottom margin-right-5"></i>
                    { this.isNativeMode() ? translate('INDEX.TRANSPARENT_BALANCE') : translate('INDEX.BALANCE') }
                  </div>
                  <span
                    className="pull-right padding-top-10 font-size-22"
                    title={ Config.roundValues ? this.renderBalance('main') : null }>
                    { this.isNativeMode() ?
                      this.props.ActiveCoin.balance.transparent ? this.props.ActiveCoin.balance.transparent : '-'
                      :
                      <span>
                        { Config.roundValues ? formatValue('round', this.renderBalance('main'), -6) : this.renderBalance('main') } { this.props.ActiveCoin.coin }
                      </span>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        { this.isNativeMode() &&
          <div className="col-lg-3 col-xs-12">
            <div className="widget widget-shadow">
              <div className="padding-20 padding-top-10">
                <div className="clearfix">
                  <div className="pull-left padding-vertical-10">
                    <i className="icon fa-eye-slash font-size-24 vertical-align-bottom margin-right-5"></i>
                    { translate('INDEX.Z_BALANCE') }
                  </div>
                  <span
                    className="pull-right padding-top-10 font-size-22"
                    title={ Config.roundValues ? this.props.ActiveCoin.balance.private : null }>
                    { this.props.ActiveCoin.balance.private ? (Config.roundValues ? formatValue('round', this.props.ActiveCoin.balance.private, -6) : this.props.ActiveCoin.balance.private) : '-' }
                  </span>
                </div>
              </div>
            </div>
          </div>
        }

        <div className={ this.isNativeMode() ? 'col-lg-3 col-xs-12' :
          this.isBasiliskMode() ? 'col-lg-4 col-xs-12' : 'col-lg-4 col-xs-12 hide' }>
          <div className="widget widget-shadow">
            <div className="widget-content">
              <div className="padding-20 padding-top-10">
                <div className="clearfix">
                  <div className="pull-left padding-vertical-10">
                    <i className="icon fa-money font-size-24 vertical-align-bottom margin-right-5"></i>
                    { translate('INDEX.INTEREST_EARNED') }
                  </div>
                  <span
                    className="pull-right padding-top-10 font-size-22"
                    title={ Config.roundValues ? this.renderBalance('interest') : null }>
                    { this.isNativeMode() ?
                      this.props.Dashboard.progress
                      && this.props.Dashboard.progress.interest ? this.props.Dashboard.progress.interest : '-'
                      :
                      <span>
                        { Config.roundValues ? formatValue('round', this.renderBalance('interest'), -6) : this.renderBalance('interest') } { this.props.ActiveCoin.coin }
                      </span>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={ this.isNativeMode() ? 'col-lg-3 col-xs-12' :
          this.isBasiliskMode() ? 'col-lg-4 col-xs-12' : 'col-lg-4 col-xs-12 hide' }>
          <div className="widget widget-shadow">
            <div className="widget-content">
              <div className="padding-20 padding-top-10">
                <div className="clearfix">
                  <div className="pull-left padding-vertical-10">
                    <i className="icon fa-bullseye font-size-24 vertical-align-bottom margin-right-5"></i>
                    { translate('INDEX.TOTAL_BALANCE') }
                  </div>
                  <span
                    className="pull-right padding-top-10 font-size-22"
                    title={ Config.roundValues ? this.renderBalance('total') : null }>
                    { this.isNativeMode() ?
                      this.props.ActiveCoin.balance.total ? this.props.ActiveCoin.balance.total : '-'
                      :
                      <span>
                        { Config.roundValues ? formatValue('round', this.renderBalance('total'), -6) : this.renderBalance('total') } { this.props.ActiveCoin.coin }
                      </span>
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletsBalanceRender;