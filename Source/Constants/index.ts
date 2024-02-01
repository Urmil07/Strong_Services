import Colors from './Colors';
import FetchMethod from './FetchMethod';
import {FontSize, FontFamily} from './Fonts';
import Images from './Images';
import {NavigationRoutes} from './NavigationRoutes';
import {
  width,
  height,
  isIOS,
  isAndroid,
  normalize,
  isiPAD,
  isTablet,
  scale2,
  moderateScale,
} from './Responsive';
import URL from './URL';

const curruncyFormat = new Intl.NumberFormat('hi-IN', {
  style: 'currency',
  currency: 'INR',
});

export {
  NavigationRoutes,
  URL,
  width,
  height,
  isIOS,
  isAndroid,
  normalize,
  isiPAD,
  isTablet,
  scale2,
  moderateScale,
  FontSize,
  FontFamily,
  Colors,
  Images,
  FetchMethod,
};
