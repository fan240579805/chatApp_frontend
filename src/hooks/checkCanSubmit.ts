import {useEffect, useState} from 'react';

export const useCheckSubmit = (inputArr: string[]) => {
  const [canSubmit, setCanSubmit] = useState(false);

  const checkCanSubmit = () => {
    return inputArr.every(str => str !== '');
  };
  useEffect(() => {
    if (checkCanSubmit()) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, inputArr);

  return [canSubmit];
};
