import {useState} from 'react';
import {validateEmail} from './tool';

export type validateType = [(text: string, type?: string) => void, string, boolean];

export function useInputValidate(): validateType {
  const [WrongText, setWrongText] = useState('');
  const [isWrong, setIsWrong] = useState(false);
  const inputValidate = (text: string, type: string | undefined) => {
    if (text.length >= 22) {
      setWrongText('用户名或密码不能超过22字哦');
      setIsWrong(true);
    } else if (type == 'email') {
      if (validateEmail(text)) {
        setIsWrong(false);
        setWrongText('');
      } else {
        setWrongText('请输入合法的邮箱');
        setIsWrong(true);
      }
    } else if (text.length < 22 && text.length !== 0) {
      setWrongText('');
      setIsWrong(false);
    } else if (text.length === 0) {
      setWrongText('不能为空哦');
      setIsWrong(true);
    }
  };
  return [inputValidate, WrongText, isWrong];
}
