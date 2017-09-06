import React from 'react';
import { translate } from '../../../translate/translate';
import { connect } from 'react-redux';

class WalletBackupTab extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="panel-body">Wallet Backup section to be updated soon.</div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    Settings: state.Settings,      
  };

};

export default connect(mapStateToProps)(WalletBackupTab);