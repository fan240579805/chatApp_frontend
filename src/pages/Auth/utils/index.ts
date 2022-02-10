import {useInputValidate, validateType} from './validtaeHook';
import {successLogin, failedLogin} from './loginCallback';

interface utilsType {
  useInputValidate: () => validateType;
  successLogin: (navagation: any) => void;
  failedLogin: () => void;
}
export default <utilsType>{
  useInputValidate,
  successLogin,
  failedLogin,
};
