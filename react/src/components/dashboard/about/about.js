import React from "react";
import { translate } from '../../../translate/translate';

class About extends React.Component {
  render() {
    return (
      <div className="page margin-left-0">
        <div className="page-content">
          <h2>{ translate('ABOUT.ABOUT_AGAMA') }</h2>
          <p>{ translate('ABOUT.AGAMA_MODES') }</p>
          <ul>
            <li>
              <span className="font-weight-600">{ translate('INDEX.BASILISK_MODE') }</span>:&nbsp;
              { translate('ABOUT.BASILISK_MODE_DESC') }
            </li>
            <li>
              <span className="font-weight-600">{ translate('INDEX.FULL_MODE') }</span>:&nbsp;
              { translate('ABOUT.FULL_MODE_DESC') }
            </li>
            <li>
              <span className="font-weight-600">{ translate('INDEX.NATIVE_MODE') }</span>:&nbsp;
              { translate('ABOUT.NATIVE_MODE_DESC') }
            </li>
          </ul>

          { translate('ABOUT.AGAMA_CAPABILITIES') }
          <ul>
            <li>
              <span className="font-weight-600">BarterDEX</span>:&nbsp;
              { translate('ABOUT.BARTER_DEX_DESC') }&nbsp;
              <a href="https://supernet.org/en/technology/whitepapers/easydex-a-practical-native-dex" target="_blank">
                (BarterDEX – A Practical Native DEX)
              </a>
            </li>
            <li>
              <span className="font-weight-600">Atomic Exporer</span>: &nbsp;
              { translate('ABOUT.ATOMIC_EXPLORER_DESC') }
            </li>
          </ul>

          <span className="font-weight-600">{ translate('ABOUT.AGAMA_NOTE') }</span>

          <br/><br/>

          <div className="font-weight-600">{ translate('ABOUT.TESTERS') }</div>
          { translate('ABOUT.TESTERS_P1') } <a target="_blank" href="https://supernet.org/en/products/agama-wallet">{ translate('ABOUT.TESTERS_P2') }</a>.
          { translate('ABOUT.TESTERS_P3') } <a target="_blank" href="https://sprnt.slack.com/messages/C0HT9MH96/">#testing-agama</a> Slack channel.
          { translate('ABOUT.TESTERS_P4') }
          <br /><br />
          { translate('ABOUT.AGAMA_DAPPS') }
          <ul>
            <li>
              <span className="font-weight-600">Jumblr</span>: { translate('ABOUT.JUMBLR_DESC') }
            </li>
            <li>
              <span className="font-weight-600">BarterDEX</span>: { translate('ABOUT.BARTER_DEX_DESC_ALT') }
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default About;