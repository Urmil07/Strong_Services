import {DeleteTable, db, getDBConnection} from '@/DB/database';
import {FetchMethod, URL} from '@Constants';
import {
  GetAccWiseColdList,
  GetColdList,
  GetCompanys,
  GetFilterData,
  GetLedger,
  GetLedgerFilterData,
  GetLedgerSummary,
  GetLotWiseColdList,
  GetPartyWiseLedger,
  GetSaleOS,
} from './DBReducer';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {EstrongReportInterface} from '@/Interfaces/ReportInterface';
import {Estronglogin} from './LoginReducer';
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import {logger} from '@Utils';

interface State {
  Loading: boolean;
  ToggleToast: boolean;
  UserRights: 'Owner' | 'Client' | 'Agent' | '';
}
const initialState: State = {
  Loading: false,
  ToggleToast: true,
  UserRights: '',
};

export const EstrongReport = createAsyncThunk(
  'EstrongReport',
  async ({EntryEmail, AccId = ''}: {EntryEmail: string; AccId?: string}) => {
    try {
      const response: EstrongReportInterface = await FetchMethod.POST_FORMDATA({
        // EndPoint: `${URL.EstrongReport}?entryemail=${EntryId}`,
        EndPoint: URL.EstrongReport,
        Params: {entryemail: EntryEmail, accid: AccId},
      });
      logger.log('response', response);
      if (response.status !== 200) {
        throw new Error(response.message);
      }

      const db = await getDBConnection();
      console.log('response', response.status);
      await AddFetchData(response, db);

      return response;
    } catch (error) {
      console.log('EstrongReport error ~~>', error);
      throw new Error('Something went wrong!');
    }
  },
);

const AddFetchData = (response: EstrongReportInterface, db: SQLiteDatabase) => {
  return new Promise<void>(async (resolve, reject) => {
    if (response.status === 200) {
      if (response.data_saleosmst.length > 0) {
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
          //   .then(successResults => {
          //     console.log('SaleOS successResults >>>>>');
          //     DataSaleOs = true;
          //   })
          //   .catch(error => {
          //     DataSaleOs = false;
          //     console.error('Error in insert queries:', error);
          //   });
        });
      }

      if (response.data_purcosmst.length > 0) {
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
        });
      }

      if (response.data_ledgermst.length > 0) {
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
                    reject(new Error(`Failed to insert: ${ledgerid}`));
                  }
                },
              );
            });
          });
        });
      }

      if (response.data_coldmst.length > 0) {
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
        });
      }

      if (response.data_coldstksummst.length > 0) {
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
        });
      }

      if (response.data_itemmst.length > 0) {
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
              } = data;

              // {"compid": "2048", "entryemail": "dssnvs@gmail.com", "id": "9452", "itemGrpname": "SUIT", "itemid": "84512", "itemname": "NAYASA FANCY DUPATTA", "unitName": ""}
              tx.executeSql(
                `INSERT INTO itemmst (compid,entryemail,itemGrpname,itemname,unitName,id,itemid, cgstper, disc, igstper, itemCode, mrp, salerate, sgstper) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
        });
      }

      if (response?.data_compmst.length > 0) {
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
        });
      }

      if (response.data_users.length > 0) {
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
              } = data;
              tx.executeSql(
                `INSERT INTO users (entryId, userid, entryName, entryEmail, entryPwd, compdbname, entryrights, erepsaleos, ereppurcos, erepledger, erepcoldlotwise, erepcoldaccwise, erepcoldstkwise, efrmsaleorder, erepsaleorder, efrmsaleinvoice, erepsaleinvoice, accId, accname, accEmail, accpwd, acctype, accrights, arepsaleos, areppurcos, arepledger, arepcoldlotwise, arepcoldaccwise, arepcoldstkwise, afrmsaleorder, arepsaleorder, afrmsaleinvoice, arepsaleinvoice) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        });
      }

      resolve();
    }
  });
};

const AppReducer = createSlice({
  name: 'AppReducer',
  initialState,
  reducers: {
    SetUserRights: (state, {payload}) => {
      state.UserRights = payload;
    },
    SetLoading: (state, {payload}) => {
      state.Loading = payload;
    },
    SetToggleToast: (state, {payload}) => {
      state.ToggleToast = payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(EstrongReport.pending, state => {
      state.Loading = true;
    });
    builder.addCase(EstrongReport.fulfilled, (state, action) => {
      state.Loading = false;
    });
    builder.addCase(EstrongReport.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(Estronglogin.pending, state => {
      state.Loading = true;
    });
    builder.addCase(Estronglogin.fulfilled, (state, action) => {
      state.Loading = false;
    });
    builder.addCase(Estronglogin.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetCompanys.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetCompanys.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetCompanys.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetSaleOS.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetSaleOS.fulfilled, state => {
      // state.Loading = false;
    });
    builder.addCase(GetSaleOS.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetLedger.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetLedger.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetLedger.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetPartyWiseLedger.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetPartyWiseLedger.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetPartyWiseLedger.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetFilterData.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetFilterData.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetFilterData.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetLotWiseColdList.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetLotWiseColdList.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetLotWiseColdList.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetAccWiseColdList.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetAccWiseColdList.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetAccWiseColdList.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetLedgerSummary.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetLedgerSummary.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetLedgerSummary.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetLedgerFilterData.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetLedgerFilterData.fulfilled, state => {
      // state.Loading = false;
    });
    builder.addCase(GetLedgerFilterData.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetColdList.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetColdList.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetColdList.rejected, state => {
      state.Loading = false;
    });
  },
});

export const {SetLoading, SetToggleToast, SetUserRights} = AppReducer.actions;

export default AppReducer.reducer;
