import React from 'react';
import { translate } from '../../../translate/translate';
import {
  importPrivKey,
} from '../../../actions/actionCreators';
import Store from '../../../store';

class ImportKeysPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      importWifKey: '',
    };
    this.importWifKey = this.importWifKey.bind(this);
  }

  importWifKey() {
    Store.dispatch(importPrivKey(this.state.importWifKey));
  }

  updateInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    return (
      <div className="panel-body">
        <div>{ translate('INDEX.IMPORT_KEYS_DESC_P1') }</div><br/>
        <div>{ translate('INDEX.IMPORT_KEYS_DESC_P2') }</div><br/>
        <div>{ translate('INDEX.IMPORT_KEYS_DESC_P3') }</div><br/>
        <div>
          <strong>
            <i>{ translate('INDEX.PLEASE_KEEP_KEYS_SAFE') }</i>
          </strong>
        </div>
        <div className="col-sm-12"></div>
        <form
          className="wifkeys-import-form"
          method="post"
          action="javascript:"
          autoComplete="off">
          <div className="form-group form-material floating">
            <input
              type="text"
              className="form-control"
              name="importWifKey"
              id="importWifkey"
              onChange={ this.updateInput } />
            <label
              className="floating-label"
              htmlFor="importWifkey">{ translate('INDEX.INPUT_PRIV_KEY') }</label>
          </div>
          <div className="col-sm-12 col-xs-12 text-align-center">
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light"
              onClick={ this.importWifKey }>{ translate('INDEX.IMPORT_PRIV_KEY') }</button>
          </div>
        </form>
      </div>
);
  };
}

export default ImportKeysPanel;