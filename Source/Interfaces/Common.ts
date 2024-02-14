import {FieldInputProps, FieldMetaProps, FormikProps} from 'formik';
import {ViewProps} from 'react-native';

export interface FormValues {
  EntryId: string;
  EntryPwd: string;
  AccountID: string;
  LoginType: string;
}

export interface CustomDropDownProps {
  Data: any[];
  value: string | number;
  style?: any;
  placeholderStyle?: any;
  selectedTextStyle?: any;
  inputSearchStyle?: any;
  iconStyle?: any;
  itemTextStyle?: any;
  dropdownPosition?: 'auto' | 'bottom' | 'top' | undefined;
  containerStyle?: any;
  itemContainerStyle?: any;
  placeholder: string;
  searchPlaceholder?: string;
  onChange: (value: string) => void;
  search?: boolean;
  maxHeight?: number;
  renderInputSearch?:
    | ((onSearch: (text: string) => void) => JSX.Element | null | undefined)
    | undefined;
  activeColor?: string;
  disable?: boolean;
}

export interface DropDownPropsOptional<V = any> extends CustomDropDownProps {
  field?: FieldInputProps<V>;
  form?: FormikProps<V>;
  meta?: FieldMetaProps<V>;
}

export interface ExtraTextProps {
  children?: any;
  numOfLines?: number;
  size?: number;
  family?: string;
  weight?: any;
  align?: 'left' | 'auto' | 'right' | 'center' | 'justify' | undefined;
  color?: string;
  pTop?: number;
  pBottom?: number;
  pLeft?: number;
  pRight?: number;
  pHorizontal?: number;
  pVertical?: number;
  spacing?: number;
  letterSpacing?: number;
}

export interface LoaderProps extends ViewProps {
  LoderViewStyle?: any;
  LoaderFontStyle?: any;
  size?: number;
  visible: boolean;
}

export interface CustomViewProps extends ViewProps {
  isLoading?: boolean;
  ContainerStyle?: any;
  children?: any;
}
