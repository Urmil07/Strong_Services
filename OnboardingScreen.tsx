import Animated, {
  BounceInRight,
  BounceOutLeft,
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import {Colors, FontFamily, Images} from '@Constants';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useState} from 'react';

import FastImage from 'react-native-fast-image';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {Functions} from '@Utils';
import normalize from 'react-native-normalize';
import {setOnBoarding} from '@Actions';

const onboardingSteps = [
  {
    icon: Images.AccountingSystem,
    title: 'Reports',
    description:
      'Stay informed with detailed reports that give you a clear overview of your financial status.',
  },
  {
    icon: Images.Cargo,
    title: 'Order',
    description:
      'Streamline your business operations with our order management system.',
    // 'Streamline your business operations with our order management system. Create, track, and manage orders efficiently, ensuring smooth transactions and satisfied customers.',
  },
  {
    icon: Images.Money,
    title: 'Collection',
    description:
      'Effortlessly collect payments from your customers with our integrated collection system.',
    // 'Effortlessly collect payments from your customers with our integrated collection system. Send invoices, receive payments, and manage your cash flow in one place.',
  },
];

const OnboardingScreen = () => {
  const [screenIndex, setScreenIndex] = useState(0);
  const data = onboardingSteps[screenIndex];

  const onContinue = () => {
    const isLastScreen = screenIndex === onboardingSteps.length - 1;
    if (isLastScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex + 1);
    }
  };

  const onBack = () => {
    const isFirstScreen = screenIndex === 0;
    if (isFirstScreen) {
      endOnboarding();
    } else {
      setScreenIndex(screenIndex - 1);
    }
  };

  const endOnboarding = async () => {
    setScreenIndex(0);

    Functions.setAppData({OnBoarding: false});
    setOnBoarding(false);

    // router.back();
  };
  const swipes = Gesture.Simultaneous(
    Gesture.Fling().direction(Directions.LEFT).onEnd(onContinue),
    Gesture.Fling().direction(Directions.RIGHT).onEnd(onBack),
  );

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.stepIndicatorContainer}>
        {onboardingSteps.map((step, index) => (
          <View
            key={index}
            style={[
              styles.stepIndicator,
              {backgroundColor: index === screenIndex ? '#15141A' : 'grey'},
              // {backgroundColor: index === screenIndex ? '#CEF202' : 'grey'},
            ]}
          />
        ))}
      </View>

      <GestureDetector gesture={swipes}>
        <View style={styles.pageContent} key={screenIndex}>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            {/* <FontAwesome5
              style={styles.image}
              name={data.icon}
              size={150}
              color="#CEF202"
            /> */}

            <FastImage
              source={data.icon}
              style={[
                styles.image,
                {height: normalize(180), width: normalize(180)},
              ]}
              resizeMode={FastImage.resizeMode.contain}
            />
          </Animated.View>

          <View style={styles.footer}>
            <Animated.Text
              entering={SlideInRight}
              exiting={SlideOutLeft}
              style={styles.title}>
              {data.title}
            </Animated.Text>
            <Animated.Text
              entering={SlideInRight.delay(50)}
              exiting={SlideOutLeft}
              style={styles.description}>
              {data.description}
            </Animated.Text>

            <View style={styles.buttonsRow}>
              <Pressable onPress={endOnboarding}>
                <Text style={styles.buttonText}>Skip</Text>
              </Pressable>

              <Pressable onPress={onContinue} style={styles.button}>
                <Text style={styles.buttonText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </GestureDetector>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  page: {
    // alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    // backgroundColor: '#15141A',
    backgroundColor: Colors.header,
  },
  pageContent: {
    padding: 20,
    flex: 1,
  },
  image: {
    alignSelf: 'center',
    margin: 20,
    marginTop: 70,
  },
  title: {
    color: '#FDFDFD',
    fontSize: 48,
    fontFamily: FontFamily.Bold,
    letterSpacing: 1.3,
    marginVertical: 10,
  },
  description: {
    // color: 'gray',
    // color: '#15141A',
    color: '#F0F0F0',
    fontSize: 20,
    fontFamily: FontFamily.Medium,
    lineHeight: 28,
  },
  footer: {
    marginTop: 'auto',
  },

  buttonsRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    backgroundColor: '#302E38',
    borderRadius: 50,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: '#FDFDFD',
    fontFamily: FontFamily.SemiBold,
    fontSize: 16,
    padding: 15,
    paddingHorizontal: 25,
  },

  // steps
  stepIndicatorContainer: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 15,
  },
  stepIndicator: {
    flex: 1,
    height: 3,
    backgroundColor: 'gray',
    borderRadius: 10,
  },
});
