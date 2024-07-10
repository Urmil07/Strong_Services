import {
  Datausermst,
  EstrongReportInterface,
} from '@/Interfaces/ReportInterface';
import {DeleteTable, Updatetblmst, getDBConnection} from '@/DB/database';
import {FetchMethod, URL} from '@Constants';
import {
  setFilterAgent,
  setFilterArea,
  setFilterBookname,
  setFilterCity,
  setFilterCompany,
  setFilterEndDate,
  setFilterMonth,
  setFilterStartDate,
  setFilterSubschedule,
  setOSData,
} from './Reportsaction';
import {setLoading, setToast} from './Appaction';

import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {create} from 'zustand';
import dayjs from 'dayjs';
import {logger} from '@Utils';

interface Prop {
  ActiveUser: Datausermst | undefined;
}
export const useHomeStore = create<Prop>(() => ({
  ActiveUser: undefined,
}));

export const EstrongReport = async ({
  EntryEmail,
  AccId = '',
}: {
  EntryEmail: string;
  AccId?: string;
}) => {
  try {
    setLoading(true);
    const db = await getDBConnection();
    const tblDataSql = await db.executeSql(
      'SELECT tableName,updated_at FROM tableMst',
    );
    const tblData = tblDataSql[0].rows.raw();
    const stgTblData = JSON.stringify(tblData);
    console.log('stgTblData', stgTblData);

    const response: EstrongReportInterface = await FetchMethod.POST_FORMDATA({
      // EndPoint: `${URL.EstrongReport}?entryemail=${EntryId}`,
      EndPoint: URL.EstrongReport,
      Params: {entryemail: EntryEmail, accid: AccId, jsonstr: stgTblData},
    });
    // logger.log('response', response);

    if (response.status !== 200) {
      setToast({
        toast: true,
        toastMessage: 'Something went wrong! EstrongReport',
      });
      setLoading(false);
    }

    // console.log('response', response);
    await AddFetchData(response, db);

    setLoading(false);
    // return response;
  } catch (error) {
    setToast({
      toast: true,
      toastMessage: 'Something went wrong! EstrongReport',
    });
    setLoading(false);
    console.log('EstrongReport error ~~>', error);
  }
};

const AddFetchData = (response: EstrongReportInterface, db: SQLiteDatabase) => {
  return new Promise<void>(async (resolve, reject) => {
    if (response.status === 200) {
      if (response.data_saleosmst && response.data_saleosmst.length > 0) {
        await DeleteTable('saleosmst');
        await db.transaction(tx => {
          const Rdata_saleos = response.data_saleosmst.map(data => {
            return new Promise<number>(async (resolve, reject) => {
              const {
                accid,
                accname,
                agentid,
                agentname,
                areaname,
                balamt,
                billamt,
                bookname,
                cityname,
                compcode,
                compid,
                compname,
                customeremail,
                days,
                entryemail,
                entryid,
                invdate,
                invnochr,
                mobile,
                prevrecamt,
                recamt,
                returnamt,
                runbalamt,
                saleosid,
              } = data;

              tx.executeSql(
                `INSERT INTO saleosmst (accid,accname,agentid,agentname,areaname,balamt,billamt,bookname,cityname,compcode,compid,compname,customeremail,days,entryemail,entryid,invdate,invnochr,mobile,prevrecamt,recamt,returnamt,runbalamt,saleosid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  accid,
                  accname,
                  agentid,
                  agentname,
                  areaname,
                  balamt,
                  billamt,
                  bookname,
                  cityname,
                  compcode,
                  compid,
                  compname,
                  customeremail,
                  days,
                  entryemail,
                  entryid,
                  invdate,
                  invnochr,
                  mobile,
                  prevrecamt,
                  recamt,
                  returnamt,
                  runbalamt,
                  saleosid,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    reject(new Error(`Failed to insert: ${saleosid}`));
                  }
                },
                error => {
                  console.error(
                    `Error inserting ${saleosid} into the database: ${error} `,
                  );
                },
              );
            });
          });

          // Promise.all(Rdata_saleos)
          //   .then(async successResults => {

          //   })
          //   .catch(error => {
          //     // logger.error('Error in insert queries:', error);
          //   });
        });
      }

      if (response.data_purcosmst && response.data_purcosmst.length > 0) {
        await DeleteTable('purcosmst');

        await db.transaction(tx => {
          const Rdata_purcos = response.data_purcosmst.map(data => {
            return new Promise<number>((resolve, reject) => {
              const {
                CustomerEmail,
                accid,
                accname,
                agentid,
                agentname,
                balamt,
                billamt,
                bookname,
                cityname,
                compid,
                compname,
                days,
                entryemail,
                entryid,
                invdate,
                invnochr,
                mobile,
                prevrecamt,
                purcosid,
                recamt,
                returnamt,
                runbalamt,
                areaname,
                compcode,
              } = data;

              tx.executeSql(
                `INSERT INTO purcosmst (CustomerEmail,accid,accname,agentid,agentname,balamt,billamt,bookname,cityname,compid,compname,days,entryemail,entryid,invdate,invnochr,mobile,prevrecamt,purcosid,recamt,returnamt,runbalamt,areaname,compcode) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  CustomerEmail,
                  accid,
                  accname,
                  agentid,
                  agentname,
                  balamt,
                  billamt,
                  bookname,
                  cityname,
                  compid,
                  compname,
                  days,
                  entryemail,
                  entryid,
                  invdate,
                  invnochr,
                  mobile,
                  prevrecamt,
                  purcosid,
                  recamt,
                  returnamt,
                  runbalamt,
                  areaname,
                  compcode,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    reject(new Error(`Failed to insert: ${invnochr}`));
                  }
                },
                error => {
                  console.log('error', JSON.stringify(error, null, 2));
                  console.error(
                    `Error inserting ${purcosid} into the database: ${error} Table >>>>> purcos`,
                  );
                },
              );
            });
          });
          // Promise.all(Rdata_purcos)
          //   .then(async successResults => {

          //   })
          //   .catch(error => {
          //     // logger.error('Error in insert queries:', error);
          //   });
        });
      }

      if (response.data_ledgermst && response.data_ledgermst.length > 0) {
        await DeleteTable('ledgermst');

        await db.transaction(tx => {
          const Rdata_ledger = response.data_ledgermst.map(data => {
            return new Promise<number>((resolve, reject) => {
              const {
                accid,
                account,
                agentName,
                balamt,
                cheque,
                cityname,
                compid,
                cramt,
                crdr,
                dramt,
                entryemail,
                entryid,
                ldate,
                ledgerid,
                narration,
                party,
                remarks,
                acctype,
                compcode,
                monthname,
                subschedule,
              } = data;

              tx.executeSql(
                `INSERT INTO ledgermst (accid,account,agentName,balamt,cheque,cityname,compid,cramt,crdr,dramt,entryemail,entryid,ldate,ledgerid,narration,party,remarks,acctype,compcode,monthname,subschedule) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  accid,
                  account,
                  agentName,
                  balamt,
                  cheque,
                  cityname,
                  compid,
                  cramt,
                  crdr,
                  dramt,
                  entryemail,
                  entryid,
                  ldate,
                  ledgerid,
                  narration,
                  party,
                  remarks,
                  acctype,
                  compcode,
                  monthname,
                  subschedule,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    console.log(`Failed to insert: ${ledgerid}`);
                    reject(new Error(`Failed to insert: ${ledgerid}`));
                  }
                },
              );
            });
          });
          // Promise.all(Rdata_ledger)
          //   .then(async successResults => {
          //   })
          //   .catch(error => {
          //     // logger.error('Error in insert queries:', error);
          //   });
        });
      }

      if (response.data_coldmst && response.data_coldmst.length > 0) {
        await DeleteTable('coldmst');

        await db.transaction(tx => {
          const Rdata_coldmst = response.data_coldmst.map(data => {
            return new Promise<number>((resolve, reject) => {
              const {
                InwGridremarks,
                OutGridremarks,
                OutwardChlDt,
                OutwardLrDt,
                SerialDt,
                VehicleNo,
                accid,
                accname,
                agentid,
                agentname,
                balqty,
                balweight,
                bookname,
                cadno,
                chamberlocation,
                chldt,
                coldid,
                compid,
                compname,
                delparty,
                entryemail,
                entryid,
                inwremark,
                itemname,
                lotno,
                netbalqty,
                outqty,
                outwardnochr,
                outweight,
                outwrdcadno,
                outwrdremark,
                partylot,
                qty,
                srnochr,
                vakkal,
                weight,
              } = data;

              tx.executeSql(
                `INSERT INTO coldmst (InwGridremarks,OutGridremarks,OutwardChlDt,OutwardLrDt,SerialDt,VehicleNo,accid,accname,agentid,agentname,balqty,balweight,bookname,cadno,chamberlocation,chldt,coldid,compid,compname,delparty,entryemail,entryid,inwremark,itemname,lotno,netbalqty,outqty,outwardnochr,outweight,outwrdcadno,outwrdremark,partylot,qty,srnochr,vakkal,weight) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  InwGridremarks,
                  OutGridremarks,
                  OutwardChlDt,
                  OutwardLrDt,
                  SerialDt,
                  VehicleNo,
                  accid,
                  accname,
                  agentid,
                  agentname,
                  balqty,
                  balweight,
                  bookname,
                  cadno,
                  chamberlocation,
                  chldt,
                  coldid,
                  compid,
                  compname,
                  delparty,
                  entryemail,
                  entryid,
                  inwremark,
                  itemname,
                  lotno,
                  netbalqty,
                  outqty,
                  outwardnochr,
                  outweight,
                  outwrdcadno,
                  outwrdremark,
                  partylot,
                  qty,
                  srnochr,
                  vakkal,
                  weight,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    reject(new Error(`Failed to insert: ${coldid}`));
                  }
                },
              );
            });
          });
          // Promise.all(Rdata_coldmst)
          //   .then(async successResults => {

          //   })
          //   .catch(error => {
          //     // logger.error('Error in insert queries:', error);
          //   });
        });
      }

      if (
        response.data_coldstksummst &&
        response.data_coldstksummst.length > 0
      ) {
        await DeleteTable('coldstksummst');
        await db.transaction(tx => {
          const Rdata_coldstksummst = response.data_coldstksummst.map(data => {
            return new Promise<number>((resolve, reject) => {
              const {
                OutwardLrDt,
                InwGridremarks,
                accid,
                accname,
                agentid,
                agentname,
                balqty,
                balweight,
                bookname,
                chldt,
                chlnochr,
                coldstkid,
                compid,
                compname,
                entryemail,
                entryid,
                itemname,
                lotno,
                outqty,
                outweight,
                partylot,
                qty,
                serialdt,
                srnochr,
                vakkal,
                weight,
              } = data;

              tx.executeSql(
                `INSERT INTO coldstksummst (OutwardLrDt,InwGridremarks,accid,accname,agentid,agentname,balqty,balweight,bookname,chldt,chlnochr,coldstkid,compid,compname,entryemail,entryid,itemname,lotno,outqty,outweight,partylot,qty,serialdt,srnochr,vakkal,weight) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  OutwardLrDt,
                  InwGridremarks,
                  accid,
                  accname,
                  agentid,
                  agentname,
                  balqty,
                  balweight,
                  bookname,
                  chldt,
                  chlnochr,
                  coldstkid,
                  compid,
                  compname,
                  entryemail,
                  entryid,
                  itemname,
                  lotno,
                  outqty,
                  outweight,
                  partylot,
                  qty,
                  serialdt,
                  srnochr,
                  vakkal,
                  weight,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    reject(new Error(`Failed to insert: ${coldstkid}`));
                  }
                },
              );
            });
          });

          // Promise.all(Rdata_coldstksummst)
          //   .then(async successResults => {
          //   })
          //   .catch(error => {
          //     // logger.error('Error in insert queries:', error);
          //   });
        });
      }

      if (response.data_itemmst && response.data_itemmst.length > 0) {
        await DeleteTable('itemmst');

        await db.transaction(tx => {
          const Rdata_itemmst = response.data_itemmst.map(data => {
            return new Promise<number>((resolve, reject) => {
              const {
                compid,
                entryemail,
                itemGrpname,
                itemname,
                id,
                itemid,
                unitName,
                cgstper,
                disc,
                igstper,
                itemCode,
                mrp,
                salerate,
                sgstper,
                packper,
                rateperunit,
              } = data;

              // {"compid": "2048", "entryemail": "dssnvs@gmail.com", "id": "9452", "itemGrpname": "SUIT", "itemid": "84512", "itemname": "NAYASA FANCY DUPATTA", "unitName": ""}
              tx.executeSql(
                `INSERT INTO itemmst (compid,entryemail,itemGrpname,itemname,unitName,id,itemid, cgstper, disc, igstper, itemCode, mrp, salerate, sgstper,packper,rateperunit) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                  compid,
                  entryemail,
                  itemGrpname,
                  itemname,
                  unitName,
                  id,
                  itemid,
                  cgstper,
                  disc,
                  igstper,
                  itemCode,
                  mrp,
                  salerate,
                  sgstper,
                  packper,
                  rateperunit,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    reject(new Error(`Failed to insert: ${id}`));
                  }
                },
              );
            });
          });

          // Promise.all(Rdata_itemmst)
          //   .then(async successResults => {
          //   })
          //   .catch(error => {
          //     // logger.error('Error in insert queries:', error);
          //   });
        });
      }

      if (response.data_compmst && response.data_compmst.length > 0) {
        await DeleteTable('compmst');
        await db.transaction(tx => {
          const Rdata_compmst = response.data_compmst.map(data => {
            return new Promise<number>((resolve, reject) => {
              const {
                compid,
                compmaindb,
                compname,
                compyeardbname,
                compyearname,
                compyearwiseemail,
                entryemail,
                entryid,
                installdate,
              } = data;

              tx.executeSql(
                `INSERT INTO compmst (compid,compmaindb,compname,compyeardbname,compyearname,compyearwiseemail,entryemail,entryid,installdate) VALUES (?,?,?,?,?,?,?,?,?)`,
                [
                  compid,
                  compmaindb,
                  compname,
                  compyeardbname,
                  compyearname,
                  compyearwiseemail,
                  entryemail,
                  entryid,
                  installdate,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    reject(new Error(`Failed to insert: ${compid}`));
                  }
                },
              );
            });
          });
          // Promise.all(Rdata_compmst)
          //   .then(async successResults => {

          //   })
          //   .catch(error => {
          //     // logger.error('Error in insert queries:', error);
          //   });
        });
      }

      if (response.data_users && response.data_users.length > 0) {
        await DeleteTable('users');
        await db.transaction(tx => {
          const Rdata_usermst = response.data_users.map(data => {
            return new Promise<number>((resolve, reject) => {
              const {
                entryId,
                userid,
                entryName,
                entryEmail,
                entryPwd,
                compdbname,
                entryrights,
                erepsaleos,
                ereppurcos,
                erepledger,
                erepcoldlotwise,
                erepcoldaccwise,
                erepcoldstkwise,
                efrmsaleorder,
                erepsaleorder,
                efrmsaleinvoice,
                erepsaleinvoice,
                accId,
                accname,
                accEmail,
                accpwd,
                acctype,
                areaname,
                accrights,
                arepsaleos,
                areppurcos,
                arepledger,
                arepcoldlotwise,
                arepcoldaccwise,
                arepcoldstkwise,
                afrmsaleorder,
                arepsaleorder,
                afrmsaleinvoice,
                arepsaleinvoice,
                hidefield,
                taxon,
                statename,
              } = data;
              tx.executeSql(
                `INSERT INTO users (entryId, userid, entryName, entryEmail, entryPwd, compdbname, entryrights, erepsaleos, ereppurcos, erepledger, erepcoldlotwise, erepcoldaccwise, erepcoldstkwise, efrmsaleorder, erepsaleorder, efrmsaleinvoice, erepsaleinvoice, accId, accname, accEmail, accpwd, acctype, areaname, accrights, arepsaleos, areppurcos, arepledger, arepcoldlotwise, arepcoldaccwise, arepcoldstkwise, afrmsaleorder, arepsaleorder, afrmsaleinvoice, arepsaleinvoice, hidefield, taxon, statename) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                  entryId,
                  userid,
                  entryName,
                  entryEmail,
                  entryPwd,
                  compdbname,
                  entryrights,
                  erepsaleos,
                  ereppurcos,
                  erepledger,
                  erepcoldlotwise,
                  erepcoldaccwise,
                  erepcoldstkwise,
                  efrmsaleorder,
                  erepsaleorder,
                  efrmsaleinvoice,
                  erepsaleinvoice,
                  accId,
                  accname,
                  accEmail,
                  accpwd,
                  acctype,
                  areaname,
                  accrights,
                  arepsaleos,
                  areppurcos,
                  arepledger,
                  arepcoldlotwise,
                  arepcoldaccwise,
                  arepcoldstkwise,
                  afrmsaleorder,
                  arepsaleorder,
                  afrmsaleinvoice,
                  arepsaleinvoice,
                  hidefield,
                  taxon,
                  statename,
                ],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    reject(new Error(`Failed to insert: ${entryId}`));
                  }
                },
              );
            });
          });

          // Promise.all(Rdata_usermst)
          //   .then(async successResults => {

          //   })
          //   .catch(error => {
          //     // logger.error('Error in insert queries:', error);
          //   });
        });
      }

      if (response.data_entryupdatemst && response.data_entryupdatemst.length) {
        // await DeleteTable('tableMst');

        db.transaction(tx => {
          const Rdata_entryupdate = response.data_entryupdatemst.map(data => {
            const {entrydate, entryemail, id, reportname} = data;

            tx.executeSql(
              `UPDATE tableMst SET updated_at='${entrydate}' WHERE tableName='${reportname}'`,
              [],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  logger.log(`All data Updated table name is ${reportname} `);
                }
              },
              error => {
                // Handle error
                logger.log(
                  `Error Updating table name is ${reportname}, error ${error}`,
                );
                return false;
              },
            );
          });
        });
      }
      resolve();
    }
  });
};

export const ResetAll = () => {
  setFilterStartDate('');
  setFilterEndDate('');
  setFilterCity([]);
  setFilterAgent([]);
  setFilterArea([]);
  setFilterBookname([]);
  setFilterCompany([]);
  setFilterMonth([]);
  setFilterSubschedule([]);
  setOSData([]);
};

type ActiveUserProp = {
  entryEmail: string;
  entryPwd?: string;
  accId?: string;
};

export const getActiveUser = async ({
  entryEmail,
  accId,
  entryPwd,
}: ActiveUserProp) => {
  try {
    const db = await getDBConnection();
    let query = `SELECT * FROM users WHERE entryEmail='${entryEmail}' AND entryPwd='${entryPwd}'`;
    if (accId)
      query = `SELECT * FROM users WHERE entryEmail='${entryEmail}' AND accId='${accId}'`;

    const UserDataSql = await db.executeSql(query);
    const UserData = UserDataSql[0].rows.raw();

    setActiveUser(UserData[0] as Datausermst);
  } catch (error) {
    throw error;
  }
};

export const setActiveUser = (ActiveUser: Datausermst) =>
  useHomeStore.setState({ActiveUser});
