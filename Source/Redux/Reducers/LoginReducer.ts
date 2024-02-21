import {FetchMethod, URL} from '@Constants';
import {Functions} from '@Utils';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

interface LoginReducerType {
  IsAuth: boolean;
  IsAuthenticated: boolean;
}

export const Estronglogin = createAsyncThunk(
  'Estronglogin',
  async ({
    EntryId,
    EntryPwd,
    AccountID,
  }: {
    EntryId: string;
    EntryPwd: string;
    AccountID?: string;
  }) => {
    try {
      const response = await FetchMethod.POST_FORMDATA({
        EndPoint: URL.Estronglogin,
        Params: {
          entryemail: EntryId,
          entrypwd: EntryPwd,
          accid: AccountID || '',
        },
      });
      console.log('response', response);
      if (response.status !== 200) {
        throw new Error(response.message);
      }
      // "entryName": "PATEL WEARHOUSE",
      // "entryemail": "patelwarehousing27@gmail.com",
      // "entrypwd": "3242",
      // "compdbname": "PWCOSDMAIN",
      // "entryrights": "Owner"

      // "entryName": "PATEL WEARHOUSE",
      // "entryemail": "patelwarehousing27@gmail.com",
      // "accid": "1121",
      // "accpwd": "123",
      // "compdbname": "PWCOSDMAIN",
      // "accrights": "Client",
      // "acctype": "SALES"

      await SetUser(response);

      return response;
    } catch (error) {
      console.log('Estronglogin error ~~>', error);
      throw new Error('Something went wrong');
    }
  },
);

const SetUser = async (response: any) => {
  return new Promise<string>(async (resolve, reject) => {
    let UserRights: string;

    if (response.data[0]?.entryrights == 'Owner') {
      const {
        compdbname,
        entryName,
        entryemail,
        entrypwd,
        entryrights,
      }: {
        entryName: string;
        entryemail: string;
        entrypwd: string;
        compdbname: string;
        entryrights: string;
      } = response.data[0]!;

      UserRights = entryrights;

      await Functions.setUser({
        entryName: entryName,
        entryemail: entryemail,
        compdbname: compdbname,
        userpwd: entrypwd,
        userrights: entryrights,
      });
    }

    if (response.data[0]?.acctype == 'SALES') {
      const {
        entryName,
        entryemail,
        accid,
        accpwd,
        compdbname,
        accrights,
        acctype,
      }: {
        entryName: string;
        entryemail: string;
        accid: string;
        accpwd: string;
        compdbname: string;
        accrights: string;
        acctype: string;
      } = response.data[0]!;

      UserRights = accrights;

      await Functions.setUser({
        entryName: entryName,
        entryemail: entryemail,
        accid: accid,
        userpwd: accpwd,
        compdbname: compdbname,
        userrights: accrights,
        acctype: acctype,
      });
    }
    resolve(UserRights!);
  });
};

const initialState: LoginReducerType = {
  IsAuth: true,
  IsAuthenticated: false,
};

const LoginReducer = createSlice({
  name: 'Login',
  initialState,
  reducers: {
    SetIsAuth: (state, action) => {
      state.IsAuth = action.payload;
    },
    SetIsAuthenticated: (state, action) => {
      state.IsAuthenticated = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(Estronglogin.fulfilled, (state, action) => {
      console.log('Estronglogin fulfilled >>>>>>>>>>>>>>>>>');
    });
  },
});

export const {SetIsAuth, SetIsAuthenticated} = LoginReducer.actions;

export default LoginReducer.reducer;
