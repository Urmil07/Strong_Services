import {LogBox, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Routes} from '@/Navigation';
import {Provider} from 'react-redux';
import Store from '@/Redux/Store';
import {PaperProvider} from 'react-native-paper';

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

const styles = StyleSheet.create({});
