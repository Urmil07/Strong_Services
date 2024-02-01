import {db} from '@/DB/database';
import {Datasaleo} from '@/Interfaces/ReportInterface';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

interface DBInitInterface {
  SaleOS: SaleOSInterfase[];
}

export const GetSaleOS = createAsyncThunk('', async () => {
  console.log('GetSaleOS');
  return new Promise<Datasaleo[]>(async (resolve, reject) => {
    let getDB = await db;
    console.log('getDB', getDB);
    getDB.transaction(tx => {
      tx.executeSql(
        // 'SELECT accid, accname, SUM(billamt) FROM saleosmst GROUP BY accname',
        // 'SELECT * FROM saleosmst WHERE accid=2156',
        'SELECT * FROM saleosmst',
        [],
        (tx, results) => {
          console.log('Query completed');
          var len = results.rows.length;
          console.log('len', len);
          console.log('results.rows', results.rows);
          resolve(results.rows.raw());
          // return results.rows;
        },
      );
    });
  });
  // console.log('Sale', Sale);

  //   const SaleOSRaw = await new Promise<Datasaleo[]>(async (resolve, reject) => {
  //     (await db).transaction(tx => {
  //       tx.executeSql(`SELECT * FROM saleordmst`, [], (tx, results) => {
  //         var temp = [];
  //         for (let i = 0; i < results.rows.length; ++i) {
  //           temp.push(results.rows.item(i));
  //         }
  //         // console.log('temp', temp);
  //         resolve(temp);
  //       });
  //     });
  //   });
  // const SaleOSRaw = (await db).transaction(tx => {
  //   tx.executeSql(
  //     // `SELECT * FROM saleosmst LIMIT 1000 OFFSET 20`,
  //     `SELECT accid, accname, SUM(billamt) FROM saleosmst GROUP BY accname`,
  //     [],
  //     (tx, results) => {
  //       console.log('results.rows', results.rows);
  //       var temp = [];
  //       for (let i = 0; i < results.rows.length; ++i) {
  //         temp.push(results.rows.item(i));
  //       }
  //       console.log('temp', temp);
  //     },
  //   );
  // });

  // console.log('SaleOSRaw', SaleOSRaw);
  // return SaleOSRaw;
  // return true;
});

const initialState: DBInitInterface = {
  SaleOS: [],
};

const DBReducer = createSlice({
  name: 'DBReducer',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(GetSaleOS.fulfilled, (state, {payload}) => {
      console.log('GetSaleOS fulfilled >>>>>>>>>>>>>>');

      const groupedArray = payload.reduce((acc, curr) => {
        const found: SaleOSInterfase = acc.find(
          (item: SaleOSInterfase) => item.accid === curr.accid,
        )!;
        if (found) {
          found.totalbill += curr.billamt;
          found.data.push(curr);
        } else {
          acc.push({
            accid: curr.accid,
            accname: curr.accname,
            totalbill: curr.billamt,
            data: [curr],
          });
        }
        return acc;
      }, []);

      state.SaleOS = groupedArray;
    });
  },
});

export const {} = DBReducer.actions;

export default DBReducer.reducer;
