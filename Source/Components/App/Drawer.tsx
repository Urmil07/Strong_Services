import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Colors, FontFamily, FontSize, Images} from '@Constants';
import {DeleteAllData, DeleteTable} from '@/DB/database';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from '@ReduxHook';

import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import {Functions} from '@Utils';
import {RNCText} from 'Common';
import {SetIsAuth} from 'Reducers';
import normalize from 'react-native-normalize';

type Props = {
  active: SharedValue<boolean>;
  translateX: SharedValue<number>;
  drawerWidth: SharedValue<number>;
};

const Drawer = ({active, translateX, drawerWidth}: Props) => {
  const dispatch = useAppDispatch();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  useAnimatedReaction(
    () => active.value,
    currentState => {
      if (currentState) {
        translateX.value = withTiming(0);
      } else {
        translateX.value = withTiming(-drawerWidth.value);
      }
    },
  );

  useAnimatedReaction(
    () => drawerWidth.value,
    () => {
      if (active.value) {
        active.value = false;
      }
    },
  );

  const backDropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-drawerWidth.value, 0],
      [0, 0.7],
      Extrapolation.CLAMP,
    );
    return {
      opacity: opacity,
      zIndex: translateX.value === -drawerWidth.value ? 0 : 1,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: -translateX.value}],
    };
  });

  const handleLogout = async () => {
    await Functions.setUser(null);
    await DeleteAllData();
    dispatch(SetIsAuth(true));
  };

  return (
    <>
      <Animated.View
        style={[styles.container, animatedStyle]}
        onLayout={e => {
          drawerWidth.value = e.nativeEvent.layout.width;
          translateX.value = -e.nativeEvent.layout.width;
        }}>
        <SafeAreaView style={{flex: 1}}>
          <View style={{flex: 1}} />
          <Pressable
            style={{
              backgroundColor: Colors.card,
              padding: normalize(8),
              borderRadius: 10,
              width: normalize(150),
              alignItems: 'center',
              justifyContent: 'flex-start',
              flexDirection: 'row',
              gap: 37,
            }}
            onPress={handleLogout}>
            <FontAwesome6Icon
              name="power-off"
              color={Colors.WText}
              size={normalize(20)}
            />
            <RNCText color={Colors.WText}>Logout</RNCText>
          </Pressable>
        </SafeAreaView>
      </Animated.View>
      <AnimatedPressable
        style={[styles.backDrop, backDropStyle]}
        onPress={() => {
          active.value = false;
        }}
      />
    </>
  );
};

export default Drawer;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: Colors.header,
    padding: normalize(5),
    borderTopLeftRadius: normalize(8),
    borderBottomLeftRadius: normalize(8),
    borderRadius: normalize(8),
    flex: 1,
  },
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});
