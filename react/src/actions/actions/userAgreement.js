import { triggerToaster } from '../actionCreators';
import Config, {
  token,
  agamaPort,
} from '../../config';
import Store from '../../store';
import urlParams from '../../util/url';
import fetchType from '../../util/fetchType';
import translate from '../../translate/translate';

export const acceptUserAgreement = () => {
  return dispatch => {
    const _urlParams = {
      token,
      accepted: true,
    };
    return fetch(
      `http://127.0.0.1:${agamaPort}/api/useragreement/${urlParams(_urlParams)}`,
      fetchType.get
    )
    .catch((error) => {
      console.log(error);
      Store.dispatch(
        triggerToaster(
          translate('API.acceptUserAgreement') + ' (code: acceptUserAgreement)',
          translate('TOASTR.ERROR'),
          'error'
        )
      );
    })
    .then(response => response.json())
    //.then(json => json);
  };
}