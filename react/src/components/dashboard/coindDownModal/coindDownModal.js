import React from 'react';
import { toggleCoindDownModal } from '../../../actions/actionCreators';
import Store from '../../../store';

import CoindDownModalRender from './coindDownModal.render';

class CoindDownModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: false,
      debugLogCrash: null,
    };
    this.dismiss = this.dismiss.bind(this);
  }

  dismiss() {
    Store.dispatch(toggleCoindDownModal(false));
  }

  componentWillReceiveProps(props) {
    const coindDownModalProps = props ? props.Dashboard : null;

    if (coindDownModalProps &&
        coindDownModalProps.displayCoindDownModal !== this.state.display) {
      this.setState(Object.assign({}, this.state, {
        display: coindDownModalProps.displayCoindDownModal,
      }));

      setTimeout(() => {
        this.setState(Object.assign({}, this.state, {
          display: coindDownModalProps.displayCoindDownModal,
        }));
      }, 100);
    }
  }

  render() {
    if (this.state.display) {
      return CoindDownModalRender.call(this);
    }

    return null;
  }
}

export default CoindDownModal;
