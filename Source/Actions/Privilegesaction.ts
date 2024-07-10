import {FetchMethod, URL} from '@Constants';
import {Functions, logger} from '@Utils';
import {setLoading, setToast} from './Appaction';

import {Datausermst} from '@/Interfaces/ReportInterface';
import {UserList} from 'App';
import {create} from 'zustand';
import {getDBConnection} from '@/DB/database';

interface Prop {
  UserList: Datausermst[];
  FilterUserList: Datausermst[];
  User: Datausermst | {};
}

export const usePrivilegesStore = create<Prop>(() => ({
  UserList: [],
  FilterUserList: [],
  User: {},
}));

export const getUserList = async () => {
  const db = await getDBConnection();

  // const UserDataSql = await db.executeSql(
  //   `SELECT * FROM users WHERE accrights IN ('Client', 'Agent') ORDER BY accrights,accname`,
  // );
  const UserDataSql = await db.executeSql(
    `SELECT * FROM users WHERE accrights IN ('Client', 'Agent') ORDER BY  CASE WHEN accrights = 'Agent' THEN 0 WHEN accrights = 'Client' THEN 1 ELSE 2  END, accname`,
  );

  const UserData = UserDataSql[0].rows.raw();
  // console.log('UserData', UserData);
  setUserList(UserData);
  setTimeout(() => {
    setLoading(false);
  }, 800);
};

export const getUserInfo = async ({accId}: {accId: any}) => {
  const db = await getDBConnection();
  const UserDataSql = await db.executeSql(
    `SELECT * FROM users WHERE accId=${accId}`,
  );

  const UserData = UserDataSql[0].rows.raw();
  // console.log('UserData', UserData[0]);
  setUser(UserData[0]);
};

export const setUserList = (UserList: Datausermst[] | []) =>
  usePrivilegesStore.setState({UserList, FilterUserList: UserList});

export const setFilterUserList = (FilterUserList: Datausermst[] | []) =>
  usePrivilegesStore.setState({FilterUserList});

export const setUser = (User: Datausermst | {}) =>
  usePrivilegesStore.setState({User});

interface ChangeUserPasswordProp {
  entryemail: string;
  oldpwd: string;
  newpwd: string;
  accrights: string;
  accId?: string;
  Type: 'Owner' | 'User';
  update?: boolean;
}
export const ChangeUserPassword = async ({
  Type,
  accrights,
  entryemail,
  oldpwd,
  newpwd,
  accId,
  update,
}: ChangeUserPasswordProp) => {
  try {
    const response = await FetchMethod.POST_FORMDATA({
      EndPoint: URL.EstrongUpdatepwd,
      Params: {
        entryemail: entryemail,
        accrights: accrights,
        oldpwd: oldpwd,
        newpwd: newpwd,
        accid: accId,
      },
    });

    // console.log('response', response);

    if (response.status !== 200) throw response.message;
    if (update) {
      const User = await Functions.getUser();
      await Functions.setUser({...User, userpwd: newpwd});
    }
    return true;
  } catch (error) {
    let message = 'Something went wrong!';
    if (typeof error === 'string' && error) message = error;
    if (error instanceof Error) message = error.message;
    logger.toast(message);
  } finally {
    // setLoading(false)
  }

  // https://strongservices.in/estrongservices.com/strong-rest-api/
};
