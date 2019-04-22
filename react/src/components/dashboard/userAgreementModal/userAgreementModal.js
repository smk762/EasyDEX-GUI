import React from 'react';
import { connect } from 'react-redux';
import translate from '../../../translate/translate';
import {
  toggleUserAgreementModal,
  acceptUserAgreement,
} from '../../../actions/actionCreators';
import Store from '../../../store';
import UserAgreementModalRender from './userAgreementModal.render';
import Config from '../../../config';

class UserAgreementModal extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false,
      className: 'hide',
    };
    this.close = this.close.bind(this);
  }

  close() {
    this.setState(Object.assign({}, this.state, {
      className: 'show out',
    }));
    Store.dispatch(acceptUserAgreement());
    Config.userAgreement = true;

    setTimeout(() => {
      Store.dispatch(toggleUserAgreementModal(false));
    }, 300);
  }

  componentWillReceiveProps(nextProps) {
    const _main = nextProps.Main;

    if (_main.displayUserAgreementModal !== this.state.open) {
      this.setState(Object.assign({}, this.state, {
        className: _main.displayUserAgreementModal ? 'show fade' : 'show out',
      }));

      setTimeout(() => {
        this.setState(Object.assign({}, this.state, {
          className: _main.displayUserAgreementModal ? 'show in' : 'hide',
          open: _main.displayUserAgreementModal ? true : false,
        }));
      }, _main.displayUserAgreementModal ? 50 : 300);
    }
  }

  render() {
    return UserAgreementModalRender.call(this);
  }
}

const mapStateToProps = (state, props) => {
  return {
    Main: state.Main,
  };
};

export default connect(mapStateToProps)(UserAgreementModal);