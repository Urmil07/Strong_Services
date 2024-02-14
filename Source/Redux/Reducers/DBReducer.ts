import {getDBConnection} from '@/DB/database';
import {Functions} from '@Utils';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

interface DBInitInterface {
  PartyWiseOS: SaleOSDataInterfase[];
  MastList: OSInterfase[];
  FilterList: OSInterfase[];
  FilterLedger: AccLedgerInterfase[];
  MastLedger: AccLedgerInterfase[];
  PartyWiseLedger: LedgerDataInterfase[];
  FilterCity: string[];
  FilterAgent: string[];
  MastAgent: {label: string; value: string}[];
  MastCity: {label: string; value: string}[];
  LotWiseList: {lotno: string}[];
  ApplyFilter: boolean;
}

export const GetSaleOS = createAsyncThunk(
  'GetSaleOS',
  async ({Orderby = 'name'}: {Orderby?: string}, thunkAPI) => {
    return new Promise<OSInterfase[]>(async (resolve, reject) => {
      const State: any = thunkAPI.getState();

      let Role: string;
      const User = await Functions.getUser();
      if (User?.entryrights == 'Owner') {
        Role = 'Owner';
      } else if (User?.acctype == 'SALES') {
        Role = 'SALES';
      }

      const db = await getDBConnection();

      let query = `SELECT invnochr, accid, accname, compid, compname, cityname, billamt, saleosid FROM saleosmst`;

      if (
        State?.DBReducer?.FilterCity &&
        State?.DBReducer?.FilterCity?.length > 0
      ) {
        query += ` WHERE cityname IN (${State?.DBReducer?.FilterCity?.map(
          (city: string) => `'${city}'`,
        ).join(',')})`;
      }

      // console.log('State?.DBReducer?.MastAgent', State?.DBReducer?.MastAgent);
      if (
        State?.DBReducer?.FilterAgent &&
        State?.DBReducer?.FilterAgent?.length > 0
      ) {
        if (
          State?.DBReducer?.FilterCity &&
          State?.DBReducer?.FilterCity.length > 0
        ) {
          query += ' AND ';
        } else {
          query += ' WHERE ';
        }
        query += `agentname IN (${State?.DBReducer?.FilterAgent?.map(
          (agent: string) => `'${agent}'`,
        ).join(',')})`;
      }

      if (Orderby == 'name') {
        if (Role! == 'Owner') {
          query += ` ORDER BY accname`;
        } else {
          query += ` ORDER BY compname`;
        }
      }

      if (Orderby == 'date') {
        query += ` ORDER BY invdate DESC`;
      }

      if (Orderby == 'city') {
        query += ` ORDER BY cityname`;
      }

      // Date Wise
      // SELECT * FROM saleosmst WHERE invdate BETWEEN '2023-04-01 00:00:00' AND '2024-03-31 23:59:59'

      // City Wisw
      // SELECT * FROM saleosmst WHERE cityname LIKE '%OLPAD%'

      // Company Wise
      // SELECT * FROM saleosmst WHERE compid IN (7187, 19514)

      // Company Wise
      // SELECT * FROM saleosmst WHERE agentid IN (7187, 19514)

      // Day Wise
      // SELECT * FROM saleosmst WHERE days IN (5,2)

      // All Filter (Date, City)
      // SELECT * FROM saleosmst WHERE compid IN (7187, 19514) AND cityname LIKE '%OLPAD%' AND invdate BETWEEN '2024-01-01 00:00:00' AND '2024-03-31 23:59:59'

      console.log('query', query);

      const SaleDataSql = await db.executeSql(query);

      const SaleData = SaleDataSql[0].rows.raw();

      const returnData = SaleData.reduce((acc, curr) => {
        const found: OSInterfase = acc.find((item: OSInterfase) =>
          Role == 'Owner'
            ? item.accid === curr.accid
            : Role == 'SALES'
            ? item.compid === curr.compid
            : null,
        )!;
        if (found) {
          found.totalbill += curr.billamt;
        } else {
          acc.push({
            accid: curr.accid,
            accname: curr.accname,
            cityname: curr.cityname,
            compid: curr.compid,
            compname: curr.compname,
            id: curr.saleosid,
            totalbill: curr.billamt,
          });
        }
        return acc;
      }, []);
      resolve(returnData);
    });
  },
);

export const GetPurchaseOS = createAsyncThunk(
  'GetPurchaseOS',
  async ({Orderby = 'name'}: {Orderby?: string}, thunkAPI) => {
    return new Promise<OSInterfase[]>(async (resolve, reject) => {
      const State: any = thunkAPI.getState();

      let Role: string;
      const User = await Functions.getUser();
      if (User?.entryrights == 'Owner') {
        Role = 'Owner';
      } else if (User?.acctype == 'SALES') {
        Role = 'SALES';
      }

      const db = await getDBConnection();

      let query =
        'SELECT invnochr, accid, accname, compid, compname, cityname, billamt, purcosid FROM purcosmst';

      if (
        State?.DBReducer?.FilterCity &&
        State?.DBReducer?.FilterCity?.length > 0
      ) {
        query += ` WHERE cityname IN (${State?.DBReducer?.FilterCity?.map(
          (city: string) => `'${city}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterAgent &&
        State?.DBReducer?.FilterAgent?.length > 0
      ) {
        if (
          State?.DBReducer?.FilterCity &&
          State?.DBReducer?.FilterCity.length > 0
        ) {
          query += ' AND ';
        } else {
          query += ' WHERE ';
        }
        query += `agentname IN (${State?.DBReducer?.FilterAgent?.map(
          (agent: string) => `'${agent}'`,
        ).join(',')})`;
      }

      if (Orderby == 'name') {
        if (Role! == 'Owner') {
          query += ` ORDER BY accname`;
        } else {
          query += ` ORDER BY compname`;
        }
      }

      if (Orderby == 'date') {
        query += ` ORDER BY invdate DESC`;
      }

      if (Orderby == 'city') {
        query += ` ORDER BY cityname`;
      }

      console.log('query', query);

      const PurcDataSql = await db.executeSql(query);

      const PurcData = PurcDataSql[0].rows.raw();

      const returnData = PurcData.reduce((acc, curr) => {
        const found: OSInterfase = acc.find((item: OSInterfase) =>
          Role == 'Owner'
            ? item.accid === curr.accid
            : Role == 'SALES'
            ? item.compid === curr.compid
            : null,
        )!;
        if (found) {
          found.totalbill += curr.billamt;
        } else {
          acc.push({
            accid: curr.accid,
            accname: curr.accname,
            cityname: curr.cityname,
            compid: curr.compid,
            compname: curr.compname,
            id: curr.purcosid,
            totalbill: curr.billamt,
          });
        }
        return acc;
      }, []);

      resolve(returnData);
    });
  },
);

export const GetLedger = createAsyncThunk('GetLedger', async () => {
  return new Promise<AccLedgerInterfase[]>(async (resolve, reject) => {
    const db = await getDBConnection();

    const query =
      'SELECT ledgerid, compid, accid, party, crdr, balamt, cityname FROM ledgermst ORDER BY ldate';

    const LedgerDataSql = await db.executeSql(query);

    const LedgerData = LedgerDataSql[0].rows.raw();

    let Role: string;
    const User = await Functions.getUser();
    if (User?.entryrights == 'Owner') {
      Role = 'Owner';
    } else if (User?.acctype == 'SALES') {
      Role = 'SALES';
    }

    const returnData = LedgerData.reduce((acc, curr) => {
      const found: AccLedgerInterfase = acc.find((item: AccLedgerInterfase) =>
        Role == 'Owner'
          ? item.accid === curr.accid
          : Role == 'SALES'
          ? item.compid === curr.compid
          : null,
      )!;
      if (found) {
        found.totalbal = curr.balamt;
        found.crdr = curr.crdr;
      } else {
        acc.push({
          accid: curr.accid,
          party: curr.party,
          compid: curr.compid,
          crdr: curr.crdr,
          cityname: curr.cityname,
          // balamt: curr.balamt,
          totalbal: curr.balamt,
        });
      }
      return acc;
    }, []);

    resolve(returnData);
  });
});

export const GetPartyWiseSaleOS = createAsyncThunk(
  'GetPartyWiseSaleOS',
  async ({accid, compid}: {accid: string; compid: string}, thunkAPI) => {
    return new Promise<SaleOSDataInterfase[]>(async (resolve, reject) => {
      const State: any = thunkAPI.getState();

      let Role: string;
      const User = await Functions.getUser();
      if (User?.entryrights == 'Owner') {
        Role = 'Owner';
      } else if (User?.acctype == 'SALES') {
        Role = 'SALES';
      }

      const db = await getDBConnection();
      let query = `SELECT * FROM saleosmst WHERE `;

      if (Role! == 'Owner') {
        query += `accid=${accid}`;
      } else {
        query += `compid=${compid}`;
      }

      if (
        State?.DBReducer?.FilterCity &&
        State?.DBReducer?.FilterCity?.length > 0
      ) {
        query += ` AND cityname IN (${State?.DBReducer?.FilterCity?.map(
          (city: string) => `'${city}'`,
        ).join(',')})`;
      }

      // console.log('State?.DBReducer?.MastAgent', State?.DBReducer?.MastAgent);
      if (
        State?.DBReducer?.FilterAgent &&
        State?.DBReducer?.FilterAgent?.length > 0
      ) {
        query += ` AND agentname IN (${State?.DBReducer?.FilterAgent?.map(
          (agent: string) => `'${agent}'`,
        ).join(',')})`;
      }

      query += ` ORDER BY invdate DESC`;

      console.log('query', query);

      const SaleDataSql = await db.executeSql(query);

      const SaleData = SaleDataSql[0].rows.raw();

      // setTimeout(() => {
      resolve(SaleData);
      // }, 500);
    });
  },
);

export const GetPartyWiseLedger = createAsyncThunk(
  'GetPartyWiseLedger',
  async ({accid, compid}: {accid: string; compid: string}) => {
    return new Promise<LedgerDataInterfase[]>(async (resolve, reject) => {
      const User = await Functions.getUser();

      const db = await getDBConnection();
      let query = `SELECT * FROM ledgermst WHERE `;

      if (User?.entryrights == 'Owner') {
        query += `accid=${accid}`;
      } else if (User?.acctype == 'SALES') {
        query += `compid=${compid}`;
      }

      const LedgerDataSql = await db.executeSql(query);

      const LedgerData = LedgerDataSql[0].rows.raw();

      // setTimeout(() => {
      resolve(LedgerData);
      // }, 500);
    });
  },
);

export const GetLotWise = createAsyncThunk('GetLotWise', (_, thunkAPI) => {
  return new Promise<{lotno: string}[]>(async (resolve, reject) => {
    // SELECT lotno FROM coldmst GROUP BY lotno

    const State: any = thunkAPI.getState();

    let Role: string;
    const User = await Functions.getUser();
    if (User?.entryrights == 'Owner') {
      Role = 'Owner';
    } else if (User?.acctype == 'SALES') {
      Role = 'SALES';
    }

    const db = await getDBConnection();

    let query = `SELECT lotno FROM coldmst GROUP BY lotno`;

    const LotDataSql = await db.executeSql(query);

    const LotData = LotDataSql[0].rows.raw();
    resolve(LotData);
  });
});

interface FilterData {
  MastCity: {label: string; value: string}[];
  MastAgent: {label: string; value: string}[];
}
export const GetFilterData = createAsyncThunk('GetFilterData', () => {
  return new Promise<FilterData>(async (resolve, reject) => {
    const db = await getDBConnection();
    let Cityquery = `SELECT cityname FROM saleosmst GROUP BY cityname ORDER BY cityname`;
    const CityDataSql = await db.executeSql(Cityquery);
    const CityData = CityDataSql[0].rows.raw();

    let Agentquery = `SELECT agentname FROM saleosmst GROUP BY agentname ORDER BY agentname`;
    const AgentDataSql = await db.executeSql(Agentquery);
    const AgentData = AgentDataSql[0].rows.raw();

    const City = CityData.map(city => {
      return {label: city.cityname, value: city.cityname};
    });
    const Agent = AgentData.map(agent => {
      return {label: agent.agentname, value: agent.agentname};
    });
    resolve({MastAgent: Agent, MastCity: City});
  });
});

const initialState: DBInitInterface = {
  PartyWiseOS: [],
  PartyWiseLedger: [],
  FilterList: [],
  MastList: [],
  FilterLedger: [],
  MastLedger: [],
  MastAgent: [],
  MastCity: [],
  FilterAgent: [],
  FilterCity: [],
  LotWiseList: [],
  ApplyFilter: false,
};

const DBReducer = createSlice({
  name: 'DBReducer',
  initialState,
  reducers: {
    SetResetFilter: (state, {payload}) => {
      state.ApplyFilter = true;
      state.FilterAgent = [];
      state.FilterCity = [];
    },
    SetApplyFilter: (state, {payload}) => {
      state.ApplyFilter = payload;
    },
    SetFilterCity: (state, {payload}) => {
      state.FilterCity = payload;
    },
    SetPartyWiseOS: (state, {payload}) => {
      state.PartyWiseOS = payload;
    },
    SetPartyWiseLedger: (state, {payload}) => {
      state.PartyWiseLedger = payload;
    },
    SetFilterList: (state, {payload}) => {
      state.FilterList = payload;
    },
    SetMastList: (state, {payload}) => {
      state.MastList = payload;
    },
    SetFilterLedger: (state, {payload}) => {
      state.FilterLedger = payload;
    },
    SetMastLedger: (state, {payload}) => {
      state.MastLedger = payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(GetSaleOS.fulfilled, (state, {payload}) => {
      state.MastList = payload;
      state.FilterList = payload;
    });
    builder.addCase(GetPurchaseOS.fulfilled, (state, {payload}) => {
      state.MastList = payload;
      state.FilterList = payload;
    });
    builder.addCase(GetLedger.fulfilled, (state, {payload}) => {
      state.FilterLedger = payload;
      state.MastLedger = payload;
    });
    builder.addCase(GetPartyWiseSaleOS.fulfilled, (state, {payload}) => {
      state.PartyWiseOS = payload;
    });
    builder.addCase(GetPartyWiseLedger.fulfilled, (state, {payload}) => {
      state.PartyWiseLedger = payload;
    });
    builder.addCase(GetFilterData.fulfilled, (state, {payload}) => {
      const {MastAgent, MastCity} = payload;
      state.MastAgent = MastAgent;
      state.MastCity = MastCity;
    });
    builder.addCase(GetLotWise.fulfilled, (state, {payload}) => {
      state.LotWiseList = payload;
    });
  },
});

export const {
  SetFilterLedger,
  SetFilterList,
  SetMastLedger,
  SetMastList,
  SetPartyWiseLedger,
  SetPartyWiseOS,
  SetFilterCity,
  SetApplyFilter,
  SetResetFilter,
} = DBReducer.actions;

export default DBReducer.reducer;
