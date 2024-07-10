import {FetchMethod, URL} from '@Constants';
import {Functions, logger} from '@Utils';
import {TableData, getDBConnection} from '@/DB/database';
import {setLoading, setToast} from './Appaction';

import {create} from 'zustand';

export const useLoginStore = create(() => {});

export const Estronglogin = async ({
  EntryId,
  EntryPwd,
  AccountID,
}: {
  EntryId: string;
  EntryPwd: string;
  AccountID?: string;
}) => {
  try {
    setLoading(true);

    const response = await FetchMethod.POST_FORMDATA({
      EndPoint: URL.Estronglogin,
      Params: {
        entryemail: EntryId,
        entrypwd: EntryPwd,
        accid: AccountID || '',
      },
    });
    console.log('response API', response);
    if (response.status !== 200) {
      setToast({
        toast: true,
        toastMessage: 'Something went wrong! Estronglogin',
      });
      setLoading(false);
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

    setLoading(false);

    return response;
  } catch (error) {
    console.log('Estronglogin error ~~>', error);
    setToast({
      toast: true,
      toastMessage: 'Something went wrong! Estronglogin',
    });
    setLoading(false);
  }
};

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

export const createMstTable = async () => {
  const db = await getDBConnection();
  const query = `CREATE TABLE IF NOT EXISTS tableMst (id INTEGER PRIMARY KEY, tableName TEXT, updated_at TEXT)`;
  const creteTblData = await db.executeSql(query);

  const insertData = TableData().flatMap(item => item.table_name);

  db.transaction(tx => {
    tx.executeSql(`DELETE FROM tableMst`);
    const query = `INSERT INTO tableMst (tableName) VALUES (?)`;
    insertData.map(item => {
      tx.executeSql(query, [item])
        .then(([result]) => {
          // console.log('Table name inserted successfully:', result);
        })
        .catch(error => {
          logger.error('Error inserting table name:', error);
        });
    });
  });
  logger.log('insertData', insertData);
};
