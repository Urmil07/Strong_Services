import {Dimensions, StyleSheet, Text, View} from 'react-native';

import Carousel from 'react-native-reanimated-carousel';
import React from 'react';
import normalize from 'react-native-normalize';

const SampleScreen = () => {
  const width = Dimensions.get('window').width;
  return (
    <View style={{flex: 1}}>
      <View style={{padding: normalize(10), gap: 5}}>
        <View
          style={{
            flex: 1,
            // zIndex: 1000,
          }}>
          <Carousel
            loop
            width={width}
            height={width / 2}
            autoPlay={true}
            data={[...new Array(6).keys()]}
            scrollAnimationDuration={1000}
            onSnapToItem={index => console.log('current index:', index)}
            mode="parallax"
            style={{
              position: 'relative',
              // position: 'absolute',
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }}
            renderItem={({index}) => (
              <View
                style={{
                  flex: 1,
                  borderWidth: 1,
                  justifyContent: 'center',
                }}>
                <Text style={{textAlign: 'center', fontSize: 30}}>{index}</Text>
              </View>
            )}
          />
        </View>
      </View>
      <Text>SampleScreen</Text>
    </View>
  );
};

export default SampleScreen;

const styles = StyleSheet.create({});
