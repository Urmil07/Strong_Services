import {Button, Dialog, PaperProvider, Portal} from 'react-native-paper';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {Colors} from '@Constants';
import {RNCText} from 'Common';
import normalize from 'react-native-normalize';

interface ShortingDilogProp {
  visible: boolean;
  handleMenu: () => void;
}

const ShortingDilog: FC<ShortingDilogProp> = ({visible, handleMenu}) => {
  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={handleMenu}
        style={{
          backgroundColor: Colors.header,
          width: normalize(250),
          alignSelf: 'center',
          borderRadius: 8,
        }}>
        <Dialog.Content>
          <RNCText></RNCText>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default ShortingDilog;

const styles = StyleSheet.create({});
