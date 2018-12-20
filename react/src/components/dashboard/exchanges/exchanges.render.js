import React from 'react';
import translate from '../../../translate/translate';
import mainWindow from '../../../util/mainWindow';
import ReactTooltip from 'react-tooltip';
import Config from '../../../config';

const ExchangesRender = function() {
  return (
    <section className="exchanges-main">
      <div className="page margin-left-0">
        <div className="page-content tools background--white">
          <div className="row">
            <div className="col-sm-12 no-padding-left padding-top-10">
              <div className="margin-top-20 exchanges-selector-main">
                <img
                  onClick={ () => this.toggleExchangeProvider('coinswitch') }
                  className={ `pointer${this.state.provider === 'coinswitch' ? ' active' : ''}` }
                  height="30px"
                  src="assets/images/exchanges/coinswitch.png" />
                <img
                  onClick={ () => this.toggleExchangeProvider('changelly') }
                  className={ `pointer${this.state.provider === 'changelly' ? ' active' : ''} margin-left-70` }
                  height="50px"
                  src="assets/images/exchanges/changelly.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExchangesRender;