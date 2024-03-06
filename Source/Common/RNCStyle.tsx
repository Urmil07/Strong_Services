import {Colors, FontFamily, FontSize} from '@/Constants';

import {StyleSheet} from 'react-native';
import normalize from 'react-native-normalize';

const RNCStyle = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  start: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  end: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    padding: normalize(6),
  },
  image100: {
    width: '100%',
    height: '100%',
  },
  image90: {
    width: '90%',
    height: '90%',
  },
  image80: {
    width: '80%',
    height: '80%',
  },
  image70: {
    width: '70%',
    height: '70%',
  },
  image60: {
    width: '60%',
    height: '60%',
  },
  image50: {
    width: '50%',
    height: '50%',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  flexRowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: {
    elevation: 3,
    shadowColor: '#171717',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  Btn: {
    // backgroundColor: Colors.btn,
    backgroundColor: Colors.header,
    borderRadius: 12,
    padding: normalize(13),
    justifyContent: 'center',
    alignItems: 'center',
  },
  BtnText: {
    color: Colors.WText,
    fontFamily: FontFamily.SemiBold,
    fontSize: FontSize.font16,
  },
  HeaderContainer: {
    height: normalize(25),
    width: '96%',
    alignSelf: 'center',
    borderRadius: normalize(5),
    padding: normalize(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: colors.primary,
  },
});

export default RNCStyle;
