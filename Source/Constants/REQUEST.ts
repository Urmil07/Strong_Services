import {Functions, logger} from '@/Utils';

import Axios from 'axios';
import NetInfo from '@react-native-community/netinfo';
import {REQUESTProp} from '@/Interfaces/API';
import URL from './URL';

const REQUEST = async ({
  Method,
  EndPoint,
  Params,
  IsformData = false,
  NeedToken = false,
}: REQUESTProp) => {
  const Device = await NetInfo.fetch();
  if (Device && Device.isConnected) {
    return ApiCalling({
      Method,
      EndPoint,
      Params,
      IsformData,
      NeedToken,
    });
  } else {
    Functions.ALERT({
      Title: 'No connection',
      Text: 'Please check your internet connection.',
    });
    return;
    // return alert('Please check your internet connection.');
  }
};

const ApiCalling = async ({
  Method,
  EndPoint,
  Params,
  IsformData,
  NeedToken,
}: REQUESTProp) => {
  const user = await Functions.getUser();
  const Headers = Header(NeedToken, user?.token, IsformData);
  const options = {
    method: Method,
    headers: Headers,
    data: Params,
    url: URL.BaseUrl + EndPoint,
  };
  logger.log('options', options);
  const response = await Axios(options);
  return response.data;
};

const Header = (
  NeedToken: boolean | undefined,
  Token: any,
  IsformData: boolean | undefined = false,
) => {
  let apiHeaders: any = {
    Accept: '*/*',
    'Content-Type': IsformData ? 'multipart/form-data' : 'application/json',
  };
  if (NeedToken) {
    apiHeaders = {...apiHeaders, Authorization: `Bearer ${Token}`};
  }
  return apiHeaders;
};
export default REQUEST;
