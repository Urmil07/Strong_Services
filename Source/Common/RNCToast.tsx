import {useAppSelector} from '@ReduxHook';
import React, {useCallback, useEffect} from 'react';
import {useToast} from 'react-native-toast-notifications';

const RNCToast = () => {
  const toast = useToast();

  const {ToggleToast} = useAppSelector(({AppReducer}) => AppReducer);
  console.log('ToggleToast', ToggleToast);

  useEffect(() => {
    toast.show('Task finished successfully ');
  }, []);

  return <></>;
};

export default RNCToast;
