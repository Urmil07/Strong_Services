import {LogBox} from 'react-native';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import React from 'react';
import {Routes} from '@/Navigation';
import Store from '@/Redux/Store';
LogBox.ignoreAllLogs();

const App = () => {
  return (
    <Provider store={Store}>
      <PaperProvider>
        <Routes />
      </PaperProvider>
    </Provider>
  );
};

export default App;
