import React from 'react';
import { translate } from '../../translate/translate';

class DexLogin extends React.Component {
  constructor() {
    super();
    this.state = {
      isNewPassphrase: false,
    };
  }

  render() {
    return (
      <div className="login">
        <div className="Placeholder-bg">
          <span></span>
        </div>
        <section className="Placeholder-tagline">
          <i className="Placeholder-logo">
            <svg version="1.0" viewBox="0 0 800.000000 600.000000" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="gradient">
                  <stop offset="0%" stopColor="#9300FF"></stop>
                  <stop offset="49%" stopColor="#5272E2"></stop>
                  <stop offset="95%" stopColor="#4C84FF"></stop>
                </linearGradient>
              </defs>
              <g transform="translate(-100.000000,800.000000) scale(0.100000,-0.100000)" fill="url(#gradient)" stroke="none">
                <path d="M5310 3550 l0 -120 -38 0 c-56 0 -186 -35 -242 -66 -258 -141 -359 -466 -228 -734 41 -85 151 -196 235 -239 115 -58 268 -77 378 -47 230 61 382 289 346 517 -6 35 -11 67 -11 72 0 4 -63 7 -140 7 l-139 0 24 -46 c32 -60 34 -147 5 -203 -47 -93 -162 -148 -252 -122 -174 51 -230 261 -101 383 59 57 70 58 463 58 l360 0 0 30 c0 52 -30 179 -56 237 -34 78 -104 172 -171 233 -100 89 -274 159 -395 160 l-38 0 0 -120z m334 -154 c76 -32 106 -136 59 -202 -30 -42 -86 -68 -132 -60 -134 21 -162 197 -40 258 41 22 69 22 113 4z"></path>
              </g>
            </svg>
          </i>
          <h1 className="Placeholder-text">
            Barter <strong>DEX</strong>
          </h1>
          <section className="form">
            <div className="login-newpassphrase">
              <button className="Clipboard action lefttext normaltext dark">
                <span>Generate a new passphrase</span>
                <i className="Clipboard-icon">
                  <svg id="Layer_1" style={{ enableBackground: 'new 0 0 512 512' }} version="1.1" viewBox="0 0 512 512">
                    <g>
                      <polygon points="304,96 288,96 288,176 368,176 368,160 304,160"></polygon>
                      <path d="M325.3,64H160v48h-48v336h240v-48h48V139L325.3,64z M336,432H128V128h32v272h176V432z M384,384H176V80h142.7l65.3,65.6V384 z"></path>
                    </g>
                  </svg>
                </i>
              </button>
            </div>
            <textarea name="form-field-name" placeholder="Enter here your passphrase" style={{ fontSize: '18px', minWidth: '260px' }}></textarea>
            { !this.state.isNewPassphrase &&
              <button disabled="" className="login-button withBorder action centered primary">
                <span>Login</span>
                <i>
                  <svg id="Layer_1" style={{ enableBackground: 'new 0 0 512 512' }} version="1.1" viewBox="0 0 512 512">
                    <polygon points="160,115.4 180.7,96 352,256 180.7,416 160,396.7 310.5,256 "></polygon>
                  </svg>
                </i>
              </button>
            }
            { this.state.isNewPassphrase &&
              <button className="action align-left danger login-passphrase-notice">
                <span>
                  <strong>
                    Backup your passpharase, <br /><u>it can't be retrieved!</u>
                  </strong>
                </span>
                <i>
                  <svg id="Layer_1" style={{ enableBackground: 'new 0 0 512 512' }} version="1.1" viewBox="0 0 512 512">
                    <g>
                      <path d="M223.9,329.7c-2.4,2.4-5.8,4.4-8.8,4.4s-6.4-2.1-8.9-4.5l-56-56l17.8-17.8l47.2,47.2l124.8-125.7l17.5,18.1L223.9,329.7z"></path>
                    </g>
                  </svg>
                </i>
              </button>
            }
          </section>
          <footer><small>version 1.3.5</small></footer>
        </section>
      </div>
    );
  }
}

export default DexLogin;