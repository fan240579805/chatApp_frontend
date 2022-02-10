import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainRouter from './src/router/MainRouter';
import useLoginStatus from './src/hooks/loginStatusHook';

const App = () => {
  const [LoginStatus, setLoginStatus, passCTX, Context] = useLoginStatus();

  return (
    <NavigationContainer>
      <Context.Provider value={passCTX}>
        <MainRouter LoginStatus={LoginStatus} setLoginStatus={setLoginStatus} />
      </Context.Provider>
    </NavigationContainer>
  );
};

export default App;
