import {Text, View} from 'react-native';
import React from 'react';
import RNCStyle from './RNCStyle';
import RNCLoader from './RNCLoader';
import {CustomViewProps} from '@/Interfaces/Common';

const RNCView = (props: CustomViewProps) => {
  const {isLoading = false, style, ContainerStyle, children} = props;

  return (
    <View style={[RNCStyle.container, style]}>
      {isLoading && <RNCLoader visible={isLoading} />}
      <View style={[RNCStyle.container, ContainerStyle]}>{children}</View>
    </View>
  );
};

export default RNCView;
