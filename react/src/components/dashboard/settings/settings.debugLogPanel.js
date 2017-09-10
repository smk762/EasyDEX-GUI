import React from 'react';
import { connect } from 'react-redux';
import { translate } from '../../../translate/translate';
import Config from '../../../config';
import {
  getDebugLog,
} from '../../../actions/actionCreators';
import Store from '../../../store';

class DebugLogPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      debugLinesCount: 10,
      debugTarget: 'iguana',
      nativeOnly: Config.iguanaLessMode,
    };
    this.readDebugLog = this.readDebugLog.bind(this);
    this.updateInput = this.updateInput.bind(this);
  }

  readDebugLog() {
    Store.dispatch(
      getDebugLog(
        this.state.debugTarget,
        this.state.debugLinesCount
      )
    );
  }

  renderDebugLogData() {
    if (this.props.Settings.debugLog) {
      const _debugLogDataRows = this.props.Settings.debugLog.split('\n');

      if (_debugLogDataRows &&
          _debugLogDataRows.length) {
        return _debugLogDataRows.map((_row) =>
          <div
            key={ `settings-debuglog-${Math.random(0, 9) * 10}` }
            className="padding-bottom-5">{ _row }</div>
        );
      } else {
        return (
          <span>{ translate('INDEX.EMPTY_DEBUG_LOG') }</span>
        );
      }
    } else {
      return null;
    }
  }

  updateInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  render() {
    return (
      <div className="panel-body">
        <p>{ translate('INDEX.DEBUG_LOG_DESC') }</p>
        <div className="col-sm-12"></div>
        <form
          className="read-debug-log-import-form"
          method="post"
          action="javascript:"
          autoComplete="off">
          <div className="form-group form-material floating">
            <input
              type="text"
              className="form-control"
              name="debugLinesCount"
              id="readDebugLogLines"
              value={ this.state.debugLinesCount }
              onChange={ this.updateInput } />
            <label
              className="floating-label"
              htmlFor="readDebugLogLines">{ translate('INDEX.DEBUG_LOG_LINES') }</label>
          </div>
          <div className="form-group form-material floating">
            <select
              className="form-control form-material"
              name="debugTarget"
              id="settingsDelectDebugLogOptions"
              onChange={ this.updateInput }>
              <option value="iguana" className={ this.state.nativeOnly ? 'hide' : '' }>Iguana</option>
              <option value="komodo">Komodo</option>
            </select>
            <label
              className="floating-label"
              htmlFor="settingsDelectDebugLogOptions">{ translate('INDEX.TARGET') }</label>
          </div>
          <div className="col-sm-12 col-xs-12 text-align-center">
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light"
              onClick={ this.readDebugLog }>{ translate('INDEX.LOAD_DEBUG_LOG') }</button>
          </div>
          <div className="col-sm-12 col-xs-12 text-align-left">
            <div className="padding-top-40 padding-bottom-20 horizontal-padding-0">{ this.renderDebugLogData() }</div>
          </div>
        </form>
      </div>
);
  };
}

const mapStateToProps = (state) => {
  return {
    Settings: state.Settings
  };
};

export default connect(mapStateToProps)(DebugLogPanel);
