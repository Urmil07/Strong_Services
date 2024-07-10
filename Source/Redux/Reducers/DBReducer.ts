import { AccLedgerInterfase, LedgerDataInterfase, OSInterfase } from '@/Interfaces/DBReducerInterFace';
import {Datapurco, Datasaleo} from '@/Interfaces/ReportInterface';
import {Functions, setDate} from '@Utils';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import dayjs, {Dayjs} from 'dayjs';

import {getDBConnection} from '@/DB/database';

interface DBInitInterface {
  MastColdList: [];
  FilterColdList: [];
  MastList: OSInterfase[];
  FilterList: OSInterfase[];
  PartyWiseOS: Datasaleo[] | Datapurco[];
  PartyTotal: {
    TotalBalAmt: number;
    TotalBillAmt: number;
    TotalPrevrecAmt: number;
    TotalRecAmt: number;
    TotalReturnAmt: number;
  };
  MastLedger: AccLedgerInterfase[];
  FilterLedger: AccLedgerInterfase[];
  PartyWiseLedger: LedgerDataInterfase[];
  FilterBookname: string[];
  FilterCity: string[];
  FilterAgent: string[];
  FilterArea: string[];
  FilterLedgerComp: string;
  FilterMonth: string[];
  FilterSubschedule: string[];
  MastBookname: {label: string; value: string}[];
  MastAgent: {label: string; value: string}[];
  MastCity: {label: string; value: string}[];
  MastCompany: {label: string; value: string}[];
  MasterMonth: {label: string; value: string}[];
  MasterSubschedule: {label: string; value: string}[];
  MastArea: {label: string; value: string}[];
  ApplyFilter: boolean;
  FilterStartDate: string | undefined;
  FilterEndDate: string | undefined;
  FilterCompany: {
    compid: number;
    compname: string;
    totalBillAmt: number;
    selected: boolean;
    compyearname: string;
  }[];

  LotWiseList: {lotno: string; compid: string; accid: string}[];
}

export const GetCompanys = createAsyncThunk(
  'GetCompanys',
  async ({type}: {type: 'sale' | 'purchase'}, thunkAPI) => {
    const TableName = type === 'sale' ? 'saleosmst' : 'purcosmst';
    const State: any = thunkAPI.getState();
    const DBState: DBInitInterface = State?.DBReducer;

    const Date = await setDate();
    const StartDate = DBState?.FilterStartDate ?? Date.StartDate;
    const EndDate = DBState?.FilterEndDate ?? Date.EndDate;

    const db = await getDBConnection();
    // let query = `SELECT compid,compname,SUM(billamt) as totalBillAmt FROM ${TableName} GROUP BY compid ORDER BY compname`;
    let query = `SELECT ${TableName}.compid,${TableName}.compname,SUM(${TableName}.billamt) as totalBillAmt,compmst.compyearname FROM ${TableName} LEFT JOIN compmst ON compmst.compid=${TableName}.compid GROUP BY ${TableName}.compid ORDER BY compmst.compyearname`;
    console.log('query', query);
    const Company = await db.executeSql(query);
    const CompanyData = Company[0].rows.raw();

    const CompanyArray = CompanyData.map(company => {
      return {selected: true, ...company};
    });
    // console.log('CompanyArray', CompanyArray);
    return CompanyArray;
  },
);

export const GetSaleOS = createAsyncThunk(
  'GetSaleOS',
  async (
    {
      type,
      Orderby = 'name',
      id,
    }: {type: 'sale' | 'purchase'; Orderby?: string; id?: string},
    thunkAPI,
  ) => {
    // return new Promise<OSInterfase[]>(async (resolve, reject) => {
    return new Promise<void>(async (resolve, reject) => {
      const State: any = thunkAPI.getState();

      const DBState: DBInitInterface = State?.DBReducer;
      const DBName = type === 'sale' ? 'saleosmst' : 'purcosmst';

      // console.log('State', State?.AppReducer?.UserRights)
      const Date = await setDate();
      const StartDate = State?.DBReducer?.FilterStartDate;
      const EndDate = State?.DBReducer?.FilterEndDate;
      console.log('StartDate', StartDate);
      console.log('EndDate', EndDate);
      // DBState.FilterStartDate
      // DBState.FilterEndDate
      const Role: 'Owner' | 'Client' | 'Agent' = State?.AppReducer?.UserRights;

      const db = await getDBConnection();

      const ExtractData = id
        ? '*'
        : 'invdate, invnochr, accid, accname, compid, compname, cityname, billamt, areaname';

      const SelectedComp = DBState?.FilterCompany.map(company => {
        if (company.selected) {
          return company.compid;
        }
      }).filter(comp => comp !== undefined);
      let query = `SELECT ${ExtractData} FROM ${DBName} WHERE compid IN(${SelectedComp}) `;

      if (StartDate) {
        query += ` AND invdate >= '${StartDate}'`;
      }
      if (EndDate) {
        query += ` AND invdate <= '${EndDate}'`;
      }

      if (
        State?.DBReducer?.FilterCity &&
        State?.DBReducer?.FilterCity?.length > 0
      ) {
        query += ` AND cityname IN (${State?.DBReducer?.FilterCity?.map(
          (city: string) => `'${city}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterAgent &&
        State?.DBReducer?.FilterAgent?.length > 0
      ) {
        query += ` AND agentname IN (${State?.DBReducer?.FilterAgent?.map(
          (agent: string) => `'${agent}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterArea &&
        State?.DBReducer?.FilterArea?.length > 0
      ) {
        query += ` AND areaname IN (${State?.DBReducer?.FilterArea?.map(
          (area: string) => `'${area}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterBookname &&
        State?.DBReducer?.FilterBookname?.length > 0
      ) {
        query += ` AND bookname IN (${State?.DBReducer?.FilterBookname?.map(
          (area: string) => `'${area}'`,
        ).join(',')})`;
      }

      if (id) {
        if (Role! == 'Client') {
          query += ` AND compname='${id}'`;
        } else {
          query += ` AND accid=${id}`;
        }

        query += ` ORDER BY invdate,invnochr ASC`;
      } else {
        if (Orderby == 'name') {
          if (Role! == 'Client') {
            query += ` ORDER BY compname`;
          } else {
            query += ` ORDER BY accname`;
          }
        }

        if (Orderby == 'date') {
          query += ` ORDER BY invdate DESC`;
        }

        if (Orderby == 'city') {
          query += ` ORDER BY cityname`;
        }
      }

      console.log('query', query);

      const SaleDataSql = await db.executeSql(query);
      const SaleData = SaleDataSql[0].rows.raw();

      if (id) {
        const PartyWiseTotal = SaleData.reduce(
          (acc, item) => {
            acc.TotalBillAmt += item.billamt;
            acc.TotalReturnAmt += item.returnamt;
            acc.TotalPrevrecAmt += item.prevrecamt;
            acc.TotalRecAmt += item.recamt;
            acc.TotalBalAmt += item.balamt;
            return acc;
          },
          {
            TotalBillAmt: 0,
            TotalReturnAmt: 0,
            TotalPrevrecAmt: 0,
            TotalRecAmt: 0,
            TotalBalAmt: 0,
          },
        );
        thunkAPI.dispatch(SetPatyTotal(PartyWiseTotal));
        thunkAPI.dispatch(SetPartyWiseOS(SaleData));

        resolve();
        return;
      }

      const returnData = SaleData.reduce((acc, curr) => {
        const found: OSInterfase = acc.find((item: OSInterfase) =>
          Role == 'Client'
            ? item.compid === curr.compid
            : item.accid === curr.accid,
        )!;
        if (found) {
          found.totalbill += curr.billamt;
        } else {
          acc.push({
            accid: curr.accid,
            accname: curr.accname,
            cityname: curr.cityname,
            areaname: curr.areaname,
            compid: curr.compid,
            compname: curr.compname,
            mobile: curr.mobile,
            id: curr.saleosid,
            totalbill: curr.billamt,
          });
        }
        return acc;
      }, []);

      thunkAPI.dispatch(SetOSData(returnData));

      resolve();
    });
  },
);

export const GetLedger = createAsyncThunk(
  'GetLedger',
  async ({id, Orderby = 'name'}: {id?: string; Orderby?: string}, thunkAPI) => {
    console.log('Orderby', Orderby);
    return new Promise<void>(async (resolve, reject) => {
      const db = await getDBConnection();
      const State: any = thunkAPI.getState();

      const Date = await setDate();
      const StartDate = State?.DBReducer?.FilterStartDate ?? Date.StartDate;
      const EndDate = State?.DBReducer?.FilterEndDate ?? Date.EndDate;

      const Role: 'Owner' | 'Client' | 'Agent' = State?.AppReducer?.UserRights;

      const ExtractData = id
        ? '*'
        : 'ledgerid, compid, accid, party, crdr, balamt, cityname';

      let query = `SELECT ${ExtractData} FROM ledger WHERE ldate >= '${StartDate}' AND ldate <= '${EndDate}'`;

      if (
        State?.DBReducer?.FilterCity &&
        State?.DBReducer?.FilterCity?.length > 0
      ) {
        query += ` AND cityname IN (${State?.DBReducer?.FilterCity?.map(
          (city: string) => `'${city}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterAgent &&
        State?.DBReducer?.FilterAgent?.length > 0
      ) {
        query += ` AND agentname IN (${State?.DBReducer?.FilterAgent?.map(
          (agent: string) => `'${agent}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterArea &&
        State?.DBReducer?.FilterArea?.length > 0
      ) {
        query += ` AND areaname IN (${State?.DBReducer?.FilterArea?.map(
          (area: string) => `'${area}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterMonth &&
        State?.DBReducer?.FilterMonth?.length > 0
      ) {
        query += ` AND monthname IN (${State?.DBReducer?.FilterMonth?.map(
          (month: string) => `'${month}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterSubschedule &&
        State?.DBReducer?.FilterSubschedule?.length > 0
      ) {
        query += ` AND monthname IN (${State?.DBReducer?.FilterSubschedule?.map(
          (subschedule: string) => `'${subschedule}'`,
        ).join(',')})`;
      }

      // if (id) {
      //   if (Role! == 'Client') {
      //     query += ` AND compname='${id}'`;
      //   } else {
      //     query += ` AND accid=${id}`;
      //   }

      //   query += ` ORDER BY ldate`;
      // } else {
      if (Orderby == 'name') {
        query += ` ORDER BY party`;
      }

      if (Orderby == 'date') {
        query += ` ORDER BY ldate DESC`;
      }

      if (Orderby == 'city') {
        query += ` ORDER BY cityname`;
      }
      if (Orderby == 'month') {
        query += ` ORDER BY monthname`;
      }
      if (Orderby == 'subschedule') {
        query += ` ORDER BY subschedule`;
      }
      // }

      console.log('Ledger query', query);
      const LedgerDataSql = await db.executeSql(query);

      const LedgerData = LedgerDataSql[0].rows.raw();

      if (id) {
        thunkAPI.dispatch(SetPartyWiseLedger(LedgerData));
        resolve();
        return;
      }

      const returnData = LedgerData.reduce((acc, curr) => {
        const found: AccLedgerInterfase = acc.find((item: AccLedgerInterfase) =>
          Role == 'Client'
            ? item.compid === curr.compid
            : item.accid === curr.accid,
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

      thunkAPI.dispatch(SetLedger(returnData));

      resolve();
    });
  },
);

export const GetLedgerSummary = createAsyncThunk(
  'GetLedgerSummary',
  async (_, thunkAPI) => {
    new Promise<void>(async (resolve, reject) => {
      const State: any = thunkAPI.getState();

      const db = await getDBConnection();

      const Date = await setDate();
      const StartDate = State?.DBReducer?.FilterStartDate ?? Date.StartDate;
      const EndDate = State?.DBReducer?.FilterEndDate ?? Date.EndDate;

      let query = `SELECT monthname,dramt,cramt,crdr,balamt FROM ledger WHERE invdate >= '${StartDate}' AND invdate <= '${EndDate}' GROUP BY monthname,dramt,cramt,crdr,balamt`;

      const SummaryDataSql = await db.executeSql(query);
      console.log('SummaryDataSql', SummaryDataSql);
      const SummaryData = SummaryDataSql[0].rows.raw();
    });
  },
);

export const GetPartyWiseLedger = createAsyncThunk(
  'GetPartyWiseLedger',
  async (
    {party, accid, CompID}: {party: string; accid?: string; CompID: string},
    thunkAPI,
  ) => {
    return new Promise<void>(async (resolve, reject) => {
      const State: any = thunkAPI.getState();
      const User = await Functions.getUser();

      const Date = await setDate();
      const StartDate = State?.DBReducer?.FilterStartDate ?? Date.StartDate;
      const EndDate = State?.DBReducer?.FilterEndDate ?? Date.EndDate;

      const db = await getDBConnection();

      // let query = `SELECT ledgerid, compname,
      //             CASE WHEN account = 'OPENING AMOUNT' THEN 'AA' ELSE '' END AS op,
      //             ldate, account, round(dramt, 2) AS dramt, round(cramt, 2) AS cramt,
      //             round(balamt, 2) AS balamt,
      //             crdr, narration, remarks, cheque, cityname, agentName, subschedule, monthname
      //             FROM ledger
      //             LEFT JOIN compmst ON compmst.compid = ledger.compid
      //             WHERE ledger.entryemail = '${User.entryemail}'
      //             AND compmst.compid=${CompID}
      //             `;
      let query = `SELECT CASE WHEN account = 'OPENING AMOUNT' THEN 'AA' ELSE '' END AS op, ledger.* FROM ledger LEFT JOIN compmst ON compmst.compid=ledger.compid WHERE ledger.entryemail='${User.entryemail}' AND compmst.compid=${CompID} `;

      if (accid) {
        query += ` AND ledger.accid=${accid}`;
      }

      if (
        State?.DBReducer?.FilterMonth &&
        State?.DBReducer?.FilterMonth?.length > 0
      ) {
        query += ` AND monthname IN (${State?.DBReducer?.FilterMonth?.map(
          (month: string) => `'${month}'`,
        ).join(',')})`;
      }

      if (
        State?.DBReducer?.FilterSubschedule &&
        State?.DBReducer?.FilterSubschedule?.length > 0
      ) {
        query += ` AND monthname IN (${State?.DBReducer?.FilterSubschedule?.map(
          (subschedule: string) => `'${subschedule}'`,
        ).join(',')})`;
      }

      query += ` AND ledger.ldate >= '${StartDate}' AND ledger.ldate <= '${EndDate}' AND ledger.party IN ('${party}') ORDER BY ledgerid, date(ldate), op ASC;`;

      console.log('GetPartyWiseLedger query', query);

      const LedgerDataSql = await db.executeSql(query);

      const LedgerData = LedgerDataSql[0].rows.raw();
      console.log('LedgerData', LedgerData);
      thunkAPI.dispatch(SetPartyWiseLedger(LedgerData));
      resolve();
    });
  },
);

interface GetColdListProp {
  type: 'lot' | 'account';
}
export const GetColdList = createAsyncThunk(
  'GetColdList',
  async ({type}: GetColdListProp, thunkAPI) => {
    const State: any = thunkAPI.getState();
    const DBState: DBInitInterface = State?.DBReducer;
    const db = await getDBConnection();
    const User = await Functions.getUser();

    let query = `SELECT coldmst.coldid, coldmst.compid, coldmst.accid, coldmst.delparty, coldmst.SerialDt, coldmst.lotno, coldmst.accname FROM coldmst LEFT JOIN compmst ON compmst.compid = coldmst.compid where coldmst.entryemail='${User.entryemail}' `;
    console.log(' query type', type);
    if (type === 'lot') {
      query += ` GROUP BY lotno`;
    } else {
      query += ` GROUP BY accname`;
    }

    query += ` ORDER BY SerialDt`;

    console.log('query', query);

    const ColdDataSql = await db.executeSql(query);
    const ColdData = ColdDataSql[0].rows.raw();
    thunkAPI.dispatch(SetColdList(ColdData));
    console.log('ColdData', ColdData);
  },
);

export const GetLotWiseColdList = createAsyncThunk(
  'GetLotWiseColdList',
  (_, thunkAPI) => {
    return new Promise<{lotno: string; compid: string; accid: string}[]>(
      async (resolve, reject) => {
        const State: any = thunkAPI.getState();

        let Role: string;
        const User = await Functions.getUser();
        if (User?.entryrights == 'Owner') {
          Role = 'Owner';
        } else if (User?.acctype == 'SALES') {
          Role = 'SALES';
        }

        const db = await getDBConnection();

        let query = `SELECT compid, accid, lotno FROM coldmst GROUP BY lotno ORDER BY lotno`;

        const LotDataSql = await db.executeSql(query);

        const LotData = LotDataSql[0].rows.raw();
        resolve(LotData);
      },
    );
  },
);

export const GetAccWiseColdList = createAsyncThunk(
  'GetAccWise',
  (_, thunkAPI) => {
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

      let query = `SELECT compid, accid, lotno FROM coldmst`;

      if (Role! == 'Owner') {
        query += ` GROUP BY accname ORDER BY accname`;
      } else if (Role! == 'SALES') {
        query += ` GROUP BY compname ORDER BY compname`;
      }

      const LotDataSql = await db.executeSql(query);

      const LotData = LotDataSql[0].rows.raw();
      resolve(LotData);
    });
  },
);

// To Get All Data For Filter
interface FilterData {
  MastCity: {label: string; value: string}[];
  MastAgent: {label: string; value: string}[];
  MastArea: {label: string; value: string}[];
  MastBookname: {label: string; value: string}[];
}
export const GetFilterData = createAsyncThunk(
  'GetFilterData',
  ({type}: {type: 'sale' | 'purchase'}) => {
    return new Promise<FilterData>(async (resolve, reject) => {
      const dbName = type == 'sale' ? 'saleosmst' : 'purcosmst';
      const db = await getDBConnection();
      let Cityquery = `SELECT cityname FROM ${dbName} GROUP BY cityname ORDER BY cityname`;
      const CityDataSql = await db.executeSql(Cityquery);
      const CityData = CityDataSql[0].rows.raw();

      let Agentquery = `SELECT agentname FROM ${dbName} GROUP BY agentname ORDER BY agentname`;
      const AgentDataSql = await db.executeSql(Agentquery);
      const AgentData = AgentDataSql[0].rows.raw();

      let Booknamequery = `SELECT bookname FROM ${dbName} GROUP BY bookname ORDER BY bookname`;
      const BooknameDataSql = await db.executeSql(Booknamequery);
      const BooknameData = BooknameDataSql[0].rows.raw();

      // let Areaquery = `SELECT agentname FROM ${dbName} GROUP BY agentname ORDER BY agentname`;
      let Areaquery = `SELECT areaname FROM ${dbName} where areaname IS NOT NULL GROUP BY areaname ORDER BY areaname`;
      const AreaDataSql = await db.executeSql(Areaquery);
      const AreaData = AreaDataSql[0].rows.raw();

      const City = CityData.map(city => {
        return {label: city.cityname, value: city.cityname};
      });
      const Agent = AgentData.map(agent => {
        return {label: agent.agentname, value: agent.agentname};
      });
      const Area = AreaData.map(area => {
        return {label: area.areaname, value: area.areaname};
      });
      const Bookname = BooknameData.map(bookname => {
        return {label: bookname.bookname, value: bookname.bookname};
      });
      resolve({
        MastAgent: Agent,
        MastCity: City,
        MastArea: Area,
        MastBookname: Bookname,
      });
    });
  },
);

interface GetLedgerFilterDataProps {
  MastCity: {label: string; value: string}[];
  MastAgent: {label: string; value: string}[];
  MastCompany: {label: string; value: string}[];
  MasterMonth: {label: string; value: string}[];
  MasterSubschedule: {label: string; value: string}[];
}

export const GetLedgerFilterData = createAsyncThunk(
  'GetLedgerFilterData',
  async () => {
    return new Promise<GetLedgerFilterDataProps>(async (resolve, reject) => {
      const db = await getDBConnection();
      let Cityquery = `SELECT cityname FROM ledger GROUP BY cityname ORDER BY cityname`;
      const CityDataSql = await db.executeSql(Cityquery);
      const CityData = CityDataSql[0].rows.raw();

      let Agentquery = `SELECT agentName FROM ledger GROUP BY agentName`;
      const AgentDataSql = await db.executeSql(Agentquery);
      const AgentData = AgentDataSql[0].rows.raw();

      let subscheduleQuery = `SELECT subschedule FROM ledger GROUP BY subschedule ORDER BY subschedule`;
      const subscheduleQuerySql = await db.executeSql(subscheduleQuery);
      const subscheduleData = subscheduleQuerySql[0].rows.raw();

      let monthNameQuery = `SELECT monthname FROM ledger GROUP BY monthname ORDER BY  CASE 
        WHEN monthname = 'January' THEN 1
        WHEN monthname = 'February' THEN 2
        WHEN monthname = 'March' THEN 3
        WHEN monthname = 'April' THEN 4
        WHEN monthname = 'May' THEN 5
        WHEN monthname = 'June' THEN 6
        WHEN monthname = 'July' THEN 7
        WHEN monthname = 'August' THEN 8
        WHEN monthname = 'September' THEN 9
        WHEN monthname = 'October' THEN 10
        WHEN monthname = 'November' THEN 11
        ELSE 12
      END;`;
      const monthNameQuerySql = await db.executeSql(monthNameQuery);
      const monthNameData = monthNameQuerySql[0].rows.raw();

      let companyQuery = `SELECT compmst.compid,compmst.compname, compmst.compyearname FROM ledger LEFT JOIN compmst WHERE compmst.compid=ledger.compid GROUP BY ledger.compid ORDER BY compmst.compid`;
      const companyQuerySql = await db.executeSql(companyQuery);
      const companyData = companyQuerySql[0].rows.raw();

      const City = CityData.map(city => {
        return {label: city.cityname, value: city.cityname};
      });
      const Agent = AgentData.map(agent => {
        return {label: agent.agentname, value: agent.agentname};
      });
      const Company = companyData.map(company => {
        return {label: company.compyearname, value: company.compid};
      });
      const MonthName = monthNameData.map(month => {
        return {label: month.monthname, value: month.monthname};
      });
      const SubSchedule = subscheduleData.map(subschedule => {
        return {label: subschedule.subschedule, value: subschedule.subschedule};
      });

      resolve({
        MastAgent: Agent,
        MastCity: City,
        MastCompany: Company,
        MasterMonth: MonthName,
        MasterSubschedule: SubSchedule,
      });
    });
  },
);

const initialState: DBInitInterface = {
  MastColdList: [],
  FilterColdList: [],
  MastList: [],
  FilterList: [],
  PartyWiseOS: [],
  PartyTotal: {
    TotalBalAmt: 0,
    TotalBillAmt: 0,
    TotalPrevrecAmt: 0,
    TotalRecAmt: 0,
    TotalReturnAmt: 0,
  },
  PartyWiseLedger: [],
  FilterLedger: [],
  MastLedger: [],
  MastBookname: [],
  MastAgent: [],
  MastCity: [],
  MastArea: [],
  MastCompany: [],
  MasterMonth: [],
  MasterSubschedule: [],
  FilterLedgerComp: '',
  FilterMonth: [],
  FilterSubschedule: [],
  FilterAgent: [],
  FilterArea: [],
  FilterCity: [],
  FilterBookname: [],
  LotWiseList: [],
  ApplyFilter: false,
  // EndDate: dayjs('2022-05-01').format('YYYY-MM-DDTHH:mm:ss'),
  FilterEndDate: undefined,
  FilterStartDate: undefined,
  // FilterStartDate: dayjs('2022-04-01').format('YYYY-MM-DD HH:mm:ss'),
  FilterCompany: [],
};

const DBReducer = createSlice({
  name: 'DBReducer',
  initialState,
  reducers: {
    SetOSData: (state, {payload}) => {
      state.MastList = payload;
      state.FilterList = payload;
    },
    SetPartyWiseOS: (state, {payload}) => {
      state.PartyWiseOS = payload;
    },
    SetPatyTotal: (state, {payload}) => {
      state.PartyTotal = payload;
    },
    SetFilterStartDate: (state, {payload}) => {
      state.FilterStartDate = payload;
    },
    SetFilterEndDate: (state, {payload}) => {
      state.FilterEndDate = payload;
    },
    SetFilterAgent: (state, {payload}) => {
      state.FilterAgent = payload;
    },
    SetFilterCity: (state, {payload}) => {
      state.FilterCity = payload;
    },
    SetFilterLedgerComp: (state, {payload}) => {
      state.FilterLedgerComp = payload;
    },
    SetFilterArea: (state, {payload}) => {
      state.FilterArea = payload;
    },
    SetFilterMonth: (state, {payload}) => {
      state.FilterMonth = payload;
    },
    SetFilterSubschedule: (state, {payload}) => {
      state.FilterSubschedule = payload;
    },
    SetFilterBookname: (state, {payload}) => {
      state.FilterBookname = payload;
    },
    SetResetFilter: (state, {payload}) => {
      state.ApplyFilter = true;
      state.FilterAgent = [];
      state.FilterCity = [];
      state.FilterArea = [];
      state.FilterBookname = [];
      state.FilterMonth = [];
      state.FilterSubschedule = [];
    },
    SetApplyFilter: (state, {payload}) => {
      state.ApplyFilter = payload;
    },
    SetLedger: (state, {payload}) => {
      state.MastLedger = payload;
      state.FilterLedger = payload;
    },
    SetPartyWiseLedger: (state, {payload}) => {
      state.PartyWiseLedger = payload;
    },

    SetFilterList: (state, {payload}) => {
      state.FilterList = payload;
    },
    SetFilterLedger: (state, {payload}) => {
      state.FilterLedger = payload;
    },
    SetOSCompny: (state, {payload}) => {
      console.log('payload', payload);
      // const Company = state.FilterCompany;
      // const SelectedComp = Company.filter(comp => comp.compid == payload);
      state.FilterCompany.map(company => {
        if (company.compid == payload) {
          company.selected = !company.selected;
        }
      });
      console.log('state.FilterCompany', state.FilterCompany);
    },
    SetColdList: (state, {payload}) => {
      state.MastColdList = payload;
      state.FilterColdList = payload;
    },
    SetFilterColdList: (state, {payload}) => {
      state.FilterColdList = payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(GetCompanys.fulfilled, (state, {payload}) => {
      state.FilterCompany = payload;
    });
    builder.addCase(GetSaleOS.fulfilled, (state, {payload}) => {
      // state.MastList = payload;
      // state.FilterList = payload;
    });
    builder.addCase(GetLedger.fulfilled, (state, {payload}) => {
      // state.FilterLedger = payload;
      // state.MastLedger = payload;
    });
    builder.addCase(GetPartyWiseLedger.fulfilled, (state, {payload}) => {
      // state.PartyWiseLedger = payload;
    });
    builder.addCase(GetFilterData.fulfilled, (state, {payload}) => {
      const {MastAgent, MastCity, MastArea, MastBookname} = payload;
      state.MastAgent = MastAgent;
      state.MastCity = MastCity;
      state.MastArea = MastArea;
      state.MastBookname = MastBookname;
    });
    builder.addCase(GetLotWiseColdList.fulfilled, (state, {payload}) => {
      state.LotWiseList = payload;
    });
    builder.addCase(GetAccWiseColdList.fulfilled, (state, {payload}) => {});
    builder.addCase(GetLedgerFilterData.fulfilled, (state, {payload}) => {
      const {MastAgent, MastCity, MastCompany, MasterMonth, MasterSubschedule} =
        payload;

      state.MastAgent = MastAgent;
      state.MastCity = MastCity;
      state.MastCompany = MastCompany;
      state.MasterMonth = MasterMonth;
      state.MasterSubschedule = MasterSubschedule;
    });
    builder.addCase(GetColdList.fulfilled, (state, {payload}) => {});
  },
});

export const {
  SetFilterLedger,
  SetFilterList,
  SetPartyWiseLedger,
  SetPartyWiseOS,
  SetFilterCity,
  SetApplyFilter,
  SetResetFilter,
  SetFilterAgent,
  SetFilterArea,
  SetFilterEndDate,
  SetFilterStartDate,
  SetOSData,
  SetPatyTotal,
  SetLedger,
  SetFilterBookname,
  SetFilterMonth,
  SetFilterSubschedule,
  SetFilterLedgerComp,
  SetOSCompny,
  SetColdList,
  SetFilterColdList,
} = DBReducer.actions;

export default DBReducer.reducer;
