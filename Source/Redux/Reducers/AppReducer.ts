import {FetchMethod, URL} from '@Constants';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {Estronglogin} from './LoginReducer';
import {DeleteTable, db, getDBConnection} from '@/DB/database';
import {EstrongReportInterface} from '@/Interfaces/ReportInterface';
import {
  GetFilterData,
  GetLedger,
  GetLotWise,
  GetPartyWiseLedger,
  GetPartyWiseSaleOS,
  GetPurchaseOS,
  GetSaleOS,
} from './DBReducer';
import {SQLiteDatabase} from 'react-native-sqlite-storage';

const initialState = {
  Loading: false,
  ToggleToast: true,
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
      if (response.status !== 200) {
        throw new Error(response.message);
      }

      // const data = {
      //   status: 200,
      //   message: 'Get Sale Report list Successfully',
      //   data_saleos: [
      //     {
      //       saleosid: '5277',
      //       entryid: '0',
      //       entryemail: 'patelmattressworld@gmail.com',
      //       compid: '2046',
      //       accid: '161503',
      //       agentid: '161514',
      //       bookname: 'TAX SALES INVOICE',
      //       compname: 'PATEL MATTRESS WORLD',
      //       agentname: 'SHREE DWARIKA FURNISHING (KIRAN SONI)',
      //       invnochr: '3008T',
      //       invdate: '2022-08-06 00:00:00',
      //       accname: 'AMRATLAL & DHIRAJLAL & COMPANY',
      //       cityname: 'MUMBAI CITY',
      //       mobile: '',
      //       billamt: '4893',
      //       prevrecamt: '0',
      //       returnamt: '0',
      //       recamt: '0',
      //       runbalamt: '4893',
      //       balamt: '4893',
      //       days: '49',
      //       customeremail: '',
      //     },
      //   ],
      //   data_purcos: [
      //     {
      //       purcosid: '10360',
      //       entryid: '0',
      //       entryemail: 'dssnvs@gmail.com',
      //       compid: '2048',
      //       accid: '24121',
      //       agentid: '1110',
      //       bookname: 'PURCHASE INVOICE',
      //       compname: 'GAURI CREATION',
      //       agentname: 'RB AGENCY',
      //       invnochr: '1989',
      //       invdate: '2022-01-22 00:00:00',
      //       accname: null,
      //       cityname: 'SURAT',
      //       mobile: '',
      //       billamt: '48178',
      //       prevrecamt: '0',
      //       returnamt: '0',
      //       recamt: '0',
      //       runbalamt: '48178',
      //       balamt: '48178',
      //       days: '248',
      //       CustomerEmail: '',
      //     },
      //   ],
      //   data_ledger: [
      //     {
      //       ledgerid: '129540',
      //       entryid: '0',
      //       entryemail: 'pratik9094@gmail.com',
      //       compid: '2055',
      //       accid: '2916',
      //       party: null,
      //       ldate: null,
      //       account: null,
      //       cheque: null,
      //       dramt: null,
      //       cramt: '0',
      //       balamt: '0',
      //       crdr: '',
      //       narration: '',
      //       remarks: '',
      //       agentName: 'Delete This Account',
      //       cityname: 'SURAT',
      //     },
      //   ],
      //   data_coldmst: [
      //     {
      //       coldid: '93',
      //       entryid: null,
      //       entryemail: 'info@siddharthgroups.com',
      //       compid: '2040',
      //       accid: '1122',
      //       agentid: '0',
      //       bookname: 'INWARD CHALLAN',
      //       compname: 'SIDDHARTH AGRO INDUSTRIES',
      //       accname: 'M/S L. K. & SONS',
      //       delparty: '',
      //       agentname: '',
      //       srnochr: '305',
      //       SerialDt: '2021-06-01 00:00:00',
      //       chldt: '2021-06-01 00:00:00',
      //       outwardnochr: '1275',
      //       lotno: '305-21-2122',
      //       itemname: 'VATANA DAL',
      //       partylot: '',
      //       vakkal: 'KICHAN KING',
      //       chamberlocation: null,
      //       cadno: '',
      //       outwrdcadno: '',
      //       qty: '21',
      //       weight: '630',
      //       outqty: '1',
      //       outweight: '30',
      //       balqty: '20',
      //       balweight: '600',
      //       netbalqty: '6',
      //       VehicleNo: null,
      //       OutwardLrDt: null,
      //       OutwardChlDt: null,
      //       InwGridremarks: 'TESTING1',
      //       inwremark: '',
      //       outwrdremark: '',
      //       OutGridremarks: '',
      //     },
      //   ],
      //   data_coldstksummst: [
      //     {
      //       coldstkid: '24494',
      //       entryid: '0',
      //       entryemail: 'balajifoodsandcoldstorage@gmail.com',
      //       compid: '2051',
      //       accid: '2033',
      //       agentid: '0',
      //       bookname: 'INWARD CHALLAN',
      //       compname: 'BALAJI FOODS AND COLD STORAGE',
      //       accname: 'DAHYABHAI JAMNADAS',
      //       agentname: '',
      //       srnochr: '45',
      //       serialdt: '2020-04-05 00:00:00',
      //       chldt: '2020-04-05 00:00:00',
      //       lotno: '45-158-2021',
      //       itemname: 'ADAD',
      //       partylot: '',
      //       vakkal: '',
      //       qty: '79',
      //       weight: '3950',
      //       chlnochr: '',
      //       outqty: '45',
      //       outweight: '2250',
      //       balqty: '34',
      //       balweight: '1700',
      //       OutwardLrDt: '0000-00-00 00:00:00',
      //       InwGridremarks: '',
      //     },
      //   ],
      //   data_itemmst: [
      //     {
      //       id: '1',
      //       itemid: '359',
      //       ItemName: 'ACETON 4.5 LTR',
      //       ItemGrpName: 'ACETONE',
      //       UnitName: 'LTR',
      //       EntryEmail: 'dssnvs@gmail.com',
      //       CompId: '2034',
      //     },
      //   ],
      //   data_compmst: [
      //     {
      //       compid: '2046',
      //       entryid: null,
      //       entryemail: 'patelmattressworld@gmail.com',
      //       compname: 'PATEL MATTRESS WORLD',
      //       compmaindb: 'PMWCLMAIN',
      //       compyearwiseemail: '',
      //       compyearname: 'PATEL MATTRESS WORLD 2022-23',
      //       compyeardbname: 'PMWCLMAINYr2022Id6',
      //       installdate: '2022-09-24 00:00:00',
      //     },
      //   ],
      // };

      const db = await getDBConnection();
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
      if (response.data_saleos.length > 0) {
        await DeleteTable('saleosmst');

        await db.transaction(tx => {
          const Rdata_saleos = response.data_saleos.map(data => {
            return new Promise<number>(async (resolve, reject) => {
              const {
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
                `INSERT INTO saleosmst (accid,accname,agentid,agentname,balamt,billamt,bookname,cityname,compid,compname,customeremail,days,entryemail,entryid,invdate,invnochr,mobile,prevrecamt,recamt,returnamt,runbalamt,saleosid) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
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

      if (response.data_purcos.length > 0) {
        await DeleteTable('purcosmst');

        await db.transaction(tx => {
          const Rdata_purcos = response.data_purcos.map(data => {
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
              } = data;
              console.log('data', data);
              tx.executeSql(
                `INSERT INTO purcosmst (CustomerEmail,accid,accname,agentid,agentname,balamt,billamt,bookname,cityname,compid,compname,days,entryemail,entryid,invdate,invnochr,mobile,prevrecamt,purcosid,recamt,returnamt,runbalamt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
                ],
                (tx, results) => {
                  console.log(
                    'purcosmst results.rowsAffected',
                    results.rowsAffected,
                  );
                  if (results.rowsAffected > 0) {
                    resolve(results.insertId);
                  } else {
                    reject(new Error(`Failed to insert: ${invnochr}`));
                  }
                },
                error => {
                  console.log('error', JSON.stringify(error, null, 2));
                  console.error(
                    `Error inserting ${purcosid} into the database: ${error} Table >>>>> purcosmst`,
                  );
                },
              );
            });
          });
        });
      }

      if (response.data_ledger.length > 0) {
        await DeleteTable('ledgermst');

        await db.transaction(tx => {
          const Rdata_ledger = response.data_ledger.map(data => {
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
              } = data;

              tx.executeSql(
                `INSERT INTO ledgermst (accid,account,agentName,balamt,cheque,cityname,compid,cramt,crdr,dramt,entryemail,entryid,ldate,ledgerid,narration,party,remarks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
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
                CompId,
                EntryEmail,
                ItemGrpName,
                ItemName,
                UnitName,
                id,
                itemid,
              } = data;

              tx.executeSql(
                `INSERT INTO itemmst (CompId,EntryEmail,ItemGrpName,ItemName,UnitName,id,itemid) VALUES (?,?,?,?,?,?,?)`,
                [
                  CompId,
                  EntryEmail,
                  ItemGrpName,
                  ItemName,
                  UnitName,
                  id,
                  itemid,
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

      resolve();
    }
  });
};

const AppReducer = createSlice({
  name: 'AppReducer',
  initialState,
  reducers: {
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
    builder.addCase(GetSaleOS.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetSaleOS.fulfilled, state => {
      state.Loading = false;
    });
    builder.addCase(GetSaleOS.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetPurchaseOS.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetPurchaseOS.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetPurchaseOS.fulfilled, state => {
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
    builder.addCase(GetPartyWiseSaleOS.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetPartyWiseSaleOS.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetPartyWiseSaleOS.fulfilled, state => {
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
    builder.addCase(GetLotWise.pending, state => {
      state.Loading = true;
    });
    builder.addCase(GetLotWise.rejected, state => {
      state.Loading = false;
    });
    builder.addCase(GetLotWise.fulfilled, state => {
      state.Loading = false;
    });
  },
});

export const {SetLoading, SetToggleToast} = AppReducer.actions;

export default AppReducer.reducer;
