import {Colors} from '@Constants';
import {create} from 'zustand';

interface Prop {
  loading: boolean;
  IsAuth: boolean;
  toast: boolean;
  toastDuration: number;
  toastMessage: string;
  toastColor: string;
  toastTextColor: string;
  UserRights: 'Owner' | 'Client' | 'Agent' | '';
  OnBoarding: boolean;
}

export const useAppStore = create<Prop>(() => ({
  loading: false,
  IsAuth: false,
  toast: false,
  toastDuration: 4000,
  toastMessage: '',
  toastColor: Colors.primary,
  toastTextColor: Colors.WText,
  UserRights: '',
  OnBoarding: true,
}));

export const setLoading = (loading: boolean) => useAppStore.setState({loading});
export const setIsAuth = (IsAuth: boolean) => useAppStore.setState({IsAuth});

export const isLoading = () => {
  return useAppStore.getState().loading;
};

interface SetToastProp {
  toast: boolean;
  toastDuration?: number;
  toastMessage?: string;
  toastColor?: string;
  toastTextColor?: string;
}

export const setToast = ({
  toast,
  toastColor,
  toastTextColor,
  toastDuration,
  toastMessage,
}: SetToastProp) =>
  useAppStore.setState({
    toast,
    toastDuration,
    toastColor,
    toastMessage,
    toastTextColor,
  });

export const setUserRights = (UserRights: 'Owner' | 'Client' | 'Agent' | '') =>
  useAppStore.setState({UserRights});

export const setOnBoarding = (OnBoarding: boolean) =>
  useAppStore.setState({OnBoarding});
