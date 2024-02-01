import {Dimensions, Platform} from 'react-native';

const {height, width} = Dimensions.get('window');
const isIOS = Platform.OS == 'ios';
const isAndroid = Platform.OS == 'android';
const isiPAD = height / width < 1.6;
const isTablet = height / width < 1.6;

const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const scale2 = (size: number) => (width / guidelineBaseWidth) * size;

const moderateScale = (size: number, factor = 0.5) =>
  size + (scale2(size) - size) * factor;

function normalize(size: number, factor = 0.4) {
  const newSize = moderateScale(size, factor);
  return Math.round(newSize);
}

export {
  width,
  height,
  isIOS,
  isAndroid,
  normalize,
  isiPAD,
  isTablet,
  scale2,
  moderateScale,
};
