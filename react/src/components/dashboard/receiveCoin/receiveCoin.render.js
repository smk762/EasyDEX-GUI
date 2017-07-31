import React from 'react';
import { translate } from '../../../translate/translate';
import QRModal from '../qrModal/qrModal';

export const AddressActionsBasiliskModeRender = function(address) {
  return (
    <td>
      <span className="label label-default">
        <i className="icon fa-eye"></i> { translate('IAPI.PUBLIC_SM') }
      </span>
      <button
        className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
        title={ translate('INDEX.COPY_TO_CLIPBOARD') }
        onClick={ () => this._copyCoinAddress(address) }>
          <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
      </button>
      <span
        className="label label-default margin-left-10 action"
        title={ translate('INDEX.CHECK') }
        onClick={ () => this._checkAddressBasilisk(address) }>
          <i className="icon fa-database"></i>
      </span>
      <span
        className="label label-default margin-left-10 action"
        title={ translate('INDEX.VALIDATE') }
        onClick={ () => this._validateAddressBasilisk(address) }>
          <i className="icon fa-info-circle"></i>
      </span>
      <QRModal
        content={address}
      />
    </td>
  );
};

export const AddressActionsNonBasiliskModeRender = function(address, type) {
  return (
    <td>
      <span className={ 'label label-' + (type === 'public' ? 'default' : 'dark') }>
        <i className={ 'icon fa-eye' + (type === 'public' ? '' : '-slash') }></i>
        { type === 'public' ? translate('IAPI.PUBLIC_SM') : translate('KMD_NATIVE.PRIVATE') }
      </span>
      <button
        className="btn btn-default btn-xs clipboard-edexaddr margin-left-10"
        onClick={ () => this._copyCoinAddress(address) }>
          <i className="icon wb-copy"></i> { translate('INDEX.COPY') }
      </button>
      <QRModal
        content={address}
      />
    </td>
  );
};

export const AddressItemRender = function(address, type) {
  return (
    <tr key={ address.address }>
      { this.renderAddressActions(address.address, type) }
      <td>{ type === 'public' ? address.address : `${address.address.substring(0, 34)}...` }</td>
      <td>{ address.amount }</td>
      {!this.isNativeMode() &&
        <td>{ address.interest ? address.interest : 'N/A' }</td>
      }
    </tr>
  );
};

export const ReceiveCoinRender = function() {
  return (
    <div>
      <div className="col-xs-12 margin-top-20">
        <div className="panel nav-tabs-horizontal">
          <div>
            <div className="col-xlg-12 col-lg-12 col-sm-12 col-xs-12">
              <div className="panel">
                <header className="panel-heading">
                  {this.isNativeMode() &&
                    <div className="panel-actions">
                      <div className={ 'dropdown' + (this.state.openDropMenu ? ' open' : '') }
                           onClick={ this.openDropMenu }>
                        <a className="dropdown-toggle white btn btn-warning">
                          <i className="icon md-arrows margin-right-10"></i> { translate('INDEX.GET_NEW_ADDRESS') }
                          <span className="caret"></span>
                        </a>
                        <ul
                          className="dropdown-menu dropdown-menu-right">
                          <li>
                            <a onClick={ () => this.getNewAddress('public') }>
                              <i className="icon fa-eye"></i> { translate('INDEX.TRANSPARENT_ADDRESS') }
                            </a>
                          </li>
                          <li>
                            <a onClick={ () => this.getNewAddress('private') }>
                              <i className="icon fa-eye-slash"></i> { translate('INDEX.PRIVATE_Z_ADDRESS') }
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  }
                  <h4 className="panel-title">{ translate('INDEX.RECEIVING_ADDRESS') }</h4>
                </header>
                <div className="panel-body">
                  <div className="text-right">
                    <div
                      className="toggle-label margin-right-15 pointer"
                      onClick={ this.toggleVisibleAddress }>
                      { translate('INDEX.TOGGLE_ZERO_ADDRESSES') }
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={ this.state.hideZeroAdresses } />
                      <div
                        className="slider"
                        onClick={ this.toggleVisibleAddress }></div>
                    </label>
                  </div>
                  <table className="table table-hover dataTable table-striped">
                    <thead>
                    { this.isNativeMode() ?
                      <tr>
                        <th>{ translate('INDEX.TYPE') }</th>
                        <th>{ translate('INDEX.ADDRESS') }</th>
                        <th>{ translate('INDEX.AMOUNT') }</th>
                      </tr>
                      :
                      <tr>
                        <th>{ translate('INDEX.TYPE') }</th>
                        <th>{ translate('INDEX.ADDRESS') }</th>
                        <th>{ translate('INDEX.BALANCE') }</th>
                        <th> {translate('INDEX.INTEREST') }</th>
                      </tr>
                    }
                    </thead>
                    <tbody>
                      { this.renderAddressList('public') }
                      { this.isNativeMode() && this.renderAddressList('private') }
                    </tbody>
                    <tfoot>
                    { this.isNativeMode() ?
                      <tr>
                        <th>{ translate('INDEX.TYPE') }</th>
                        <th>{ translate('INDEX.ADDRESS') }</th>
                        <th>{ translate('INDEX.AMOUNT') }</th>
                      </tr>
                      :
                      <tr>
                        <th>{ translate('INDEX.TYPE') }</th>
                        <th>{ translate('INDEX.ADDRESS') }</th>
                        <th>{ translate('INDEX.BALANCE') }</th>
                        <th>{ translate('INDEX.INTEREST') }</th>
                      </tr>
                    }
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

