import {
  AccLedgerInterfase,
  LedgerDataInterfase,
  OSInterfase,
  StockListProp,
} from '@/Interfaces/DBReducerInterFace';
import {
  Datacoldstksummst,
  Datapurco,
  Datasaleo,
} from '@/Interfaces/ReportInterface';
import {Functions, logger, setDate} from '@Utils';
import {setLoading, useAppStore} from './Appaction';

import {Dayjs} from 'dayjs';
import {create} from 'zustand';
import {getDBConnection} from '@/DB/database';

interface Prop {
  MastOSList: OSInterfase[];
  FilterOSList: OSInterfase[];
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
  MasterStockSummary: StockListProp[];
  FilterStockSummary: StockListProp[];
  PartyWiseStockSummary: Datacoldstksummst[];
  AccountWiseSummary: [];
  FilterBookname: string[];
  FilterCity: string[];
  FilterAgent: string[];
  FilterItem: string[];
  FilterLotno: string[];
  FilterArea: string[];
  FilterLedgerComp: string;
  FilterMonth: string[];
  FilterSubschedule: string[];
  MastBookname: {label: string; value: string}[];
  MastAgent: {label: string; value: string}[];
  MastItem: {label: string; value: string}[];
  MastLotno: {label: string; value: string}[];
  MastCity: {label: string; value: string}[];
  MastCompany: {label: string; value: string}[];
  MasterMonth: {label: string; value: string}[];
  MasterSubschedule: {label: string; value: string}[];
  MastArea: {label: string; value: string}[];
  ApplyFilter: boolean;
  FilterStartDate: string | undefined;
  FilterEndDate: string | undefined;
  FilterCompany: FilterCompanyProp[];
}
interface FilterCompanyProp {
  compid: number;
  compname: string;
  totalBillAmt: number;
  selected: boolean;
  compyearname: string;
}

interface PartyTotalProp {
  TotalBalAmt: number;
  TotalBillAmt: number;
  TotalPrevrecAmt: number;
  TotalRecAmt: number;
  TotalReturnAmt: number;
}

export const useReportStore = create<Prop>(() => ({
  FilterOSList: [],
  MastOSList: [],
  PartyWiseOS: [],
  PartyTotal: {
    TotalBalAmt: 0,
    TotalBillAmt: 0,
    TotalPrevrecAmt: 0,
    TotalRecAmt: 0,
    TotalReturnAmt: 0,
  },
  MasterStockSummary: [],
  FilterStockSummary: [],
  PartyWiseStockSummary: [],
  AccountWiseSummary: [],
  MastLedger: [],
  FilterLedger: [],
  PartyWiseLedger: [],
  MastBookname: [],
  MastItem: [],
  MastLotno: [],
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
  FilterItem: [],
  FilterLotno: [],
  LotWiseList: [],
  ApplyFilter: false,
  // EndDate: dayjs('2022-05-01').format('YYYY-MM-DDTHH:mm:ss'),
  FilterEndDate: undefined,
  FilterStartDate: undefined,
  // FilterStartDate: dayjs('2022-04-01').format('YYYY-MM-DD HH:mm:ss'),
  FilterCompany: [],
}));

export const GetStockSummary = async () => {
  setLoading(true);

  const db = await getDBConnection();
  const User = await Functions.getUser();
  const Filters = useReportStore.getState();

  let query = `SELECT coldstksummst.accname, coldstksummst.accid, coldstksummst.compname, coldstksummst.compid, SUM(coldstksummst.balqty) as totalBalQty, SUM(coldstksummst.balweight)as totalBalWeight FROM coldstksummst LEFT JOIN compmst ON compmst.compid = coldstksummst.compid where coldstksummst.entryemail='${User.entryemail}' `;

  if (Filters.FilterBookname.length > 0) {
    query += ` AND bookname IN (${Filters.FilterBookname.map(
      (bookname: string) => `'${bookname}'`,
    ).join(',')})`;
  }

  if (Filters.FilterLotno.length > 0) {
    query += ` AND lotno IN (${Filters.FilterLotno.map(
      (lotno: string) => `'${lotno}'`,
    ).join(',')})`;
  }

  if (Filters.FilterItem.length > 0) {
    query += ` AND itemname IN (${Filters.FilterItem.map(
      (itemname: string) => `'${itemname}'`,
    ).join(',')})`;
  }

  if (Filters.FilterAgent.length > 0) {
    query += ` AND agentname IN (${Filters.FilterAgent.map(
      (agentname: string) => `'${agentname}'`,
    ).join(',')})`;
  }

  const UserRights = useAppStore.getState().UserRights;
  if (UserRights == 'Owner' || UserRights == 'Agent') {
    query += ` GROUP BY coldstksummst.accname `;
  } else if (UserRights == 'Client') {
    query += ` GROUP BY coldstksummst.compname `;
  }

  // if (UserRights == 'Owner' || UserRights== 'Client' | 'Agent') query += ` GROUP BY accname `;
  query += `ORDER BY coldstksummst.serialdt, coldstksummst.srnochr DESC`;

  console.log('query', query);
  const ColdSummDataSql = await db.executeSql(query);
  const ColdSummData = ColdSummDataSql[0].rows.raw();

  // {"accid": 35885, "accname": "VAIBHAV LAXMI", "compid": 2052, "compname": "PATEL WAREHOUSING CORPORATION", "totalBalQty": 3640, "totalBalWeight": 91000}

  setStockSummary(ColdSummData);
  setTimeout(() => {
    setLoading(false);
  }, 800);
};

export const GetPartyWiseStockSummary = async ({id}: {id: number}) => {
  setLoading(true);

  const db = await getDBConnection();
  const User = await Functions.getUser();
  const Filters = useReportStore.getState();

  let query = `SELECT coldstksummst.* FROM coldstksummst LEFT JOIN compmst ON compmst.compid = coldstksummst.compid where coldstksummst.entryemail='${User.entryemail}' `;

  const UserRights = useAppStore.getState().UserRights;
  if (UserRights == 'Owner' || UserRights == 'Agent') {
    query += ` AND coldstksummst.accid=${id} `;
  } else if (UserRights == 'Client') {
    query += ` AND coldstksummst.compid=${id} `;
  }

  if (Filters.FilterBookname.length > 0) {
    query += ` AND bookname IN (${Filters.FilterBookname.map(
      (bookname: string) => `'${bookname}'`,
    ).join(',')})`;
  }

  if (Filters.FilterLotno.length > 0) {
    query += ` AND lotno IN (${Filters.FilterLotno.map(
      (lotno: string) => `'${lotno}'`,
    ).join(',')})`;
  }

  if (Filters.FilterItem.length > 0) {
    query += ` AND itemname IN (${Filters.FilterItem.map(
      (itemname: string) => `'${itemname}'`,
    ).join(',')})`;
  }

  if (Filters.FilterAgent.length > 0) {
    query += ` AND agentname IN (${Filters.FilterAgent.map(
      (agentname: string) => `'${agentname}'`,
    ).join(',')})`;
  }

  query += `ORDER BY coldstksummst.serialdt, coldstksummst.srnochr DESC`;

  console.log('query', query);
  const ColdSummDataSql = await db.executeSql(query);
  const ColdSummData = ColdSummDataSql[0].rows.raw();
  // console.log('ColdSummData', ColdSummData);
  // {"accid": 35885, "accname": "VAIBHAV LAXMI", "compid": 2052, "compname": "PATEL WAREHOUSING CORPORATION", "totalBalQty": 3640, "totalBalWeight": 91000}

  setPartyWiseStockSummary(ColdSummData);
  setTimeout(() => {
    setLoading(false);
  }, 800);
};

export const GetCompanys = async ({type}: {type: 'sale' | 'purchase'}) => {
  const db = await getDBConnection();
  const TableName = type === 'sale' ? 'saleosmst' : 'purcosmst';

  let query = `SELECT ${TableName}.compid,${TableName}.compname,SUM(${TableName}.billamt) as totalBillAmt,compmst.compyearname FROM ${TableName} LEFT JOIN compmst ON compmst.compid=${TableName}.compid GROUP BY ${TableName}.compid ORDER BY compmst.compyearname`;
  console.log('query', query);
  const Company = await db.executeSql(query);
  const CompanyData = Company[0].rows.raw();

  const CompanyArray = CompanyData.map(company => {
    return {selected: true, ...company};
  });

  // console.log('CompanyArray', CompanyArray);
  setFilterCompany(CompanyArray);
};

export const GetOSData = async ({
  type,
  Orderby = 'name',
  id,
}: {
  type: 'sale' | 'purchase';
  Orderby?: string;
  id?: string;
}) => {
  // return new Promise<OSInterfase[]>(async (resolve, reject) => {
  return new Promise<void>(async (resolve, reject) => {
    // const State: any = thunkAPI.getState();

    // const DBState: DBInitInterface = State?.DBReducer;
    const DBState = useReportStore.getState();
    const DBName = type === 'sale' ? 'saleosmst' : 'purcosmst';

    // console.log('State', State?.AppReducer?.UserRights)
    const Date = await setDate();
    const StartDate = DBState.FilterStartDate;
    const EndDate = DBState.FilterEndDate;

    const Role = useAppStore.getState().UserRights;

    const db = await getDBConnection();

    const ExtractData = id
      ? '*'
      : 'invdate, invnochr, accid, accname, compid, compname, cityname, billamt, areaname, mobile';

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

    if (DBState.FilterCity && DBState.FilterCity?.length > 0) {
      query += ` AND cityname IN (${DBState.FilterCity?.map(
        (city: string) => `'${city}'`,
      ).join(',')})`;
    }

    if (DBState.FilterAgent && DBState.FilterAgent?.length > 0) {
      query += ` AND agentname IN (${DBState.FilterAgent?.map(
        (agent: string) => `'${agent}'`,
      ).join(',')})`;
    }

    if (DBState.FilterArea && DBState.FilterArea?.length > 0) {
      query += ` AND areaname IN (${DBState.FilterArea?.map(
        (area: string) => `'${area}'`,
      ).join(',')})`;
    }

    if (DBState.FilterBookname && DBState.FilterBookname?.length > 0) {
      query += ` AND bookname IN (${DBState.FilterBookname?.map(
        (area: string) => `'${area}'`,
      ).join(',')})`;
    }

    if (id) {
      if (Role! == 'Client') {
        query += ` AND compid='${id}'`;
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
      setPartyTotal(PartyWiseTotal);
      setPartyWiseOS(SaleData);

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


    setOSData(returnData);

    resolve();
  });
};

export const GetFilterData = ({type}: {type: 'sale' | 'purchase'}) => {
  return new Promise<void>(async (resolve, reject) => {
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

    const MastCity = CityData.map(city => {
      return {label: city.cityname, value: city.cityname};
    });
    useReportStore.setState({MastCity});

    const MastAgent = AgentData.map(agent => {
      return {label: agent.agentname, value: agent.agentname};
    });
    useReportStore.setState({MastAgent});

    const MastArea = AreaData.map(area => {
      return {label: area.areaname, value: area.areaname};
    });
    useReportStore.setState({MastArea});

    const MastBookname = BooknameData.map(bookname => {
      return {label: bookname.bookname, value: bookname.bookname};
    });
    useReportStore.setState({MastBookname});

    resolve();
  });
};

export const getStockSummFilterData = async () => {
  const db = await getDBConnection();

  const getBookname = `SELECT bookname FROM coldstksummst GROUP BY bookname`;
  const BooknameDataSql = await db.executeSql(getBookname);
  const BooknameData = BooknameDataSql[0].rows.raw();

  const getItemname = `SELECT itemname FROM coldstksummst GROUP BY itemname`;
  const ItemnameDataSql = await db.executeSql(getItemname);
  const ItemnameData = ItemnameDataSql[0].rows.raw();

  const getAgentname = `SELECT agentname FROM coldstksummst GROUP BY agentname`;
  const AgentnameDataSql = await db.executeSql(getAgentname);
  const AgentnameData = AgentnameDataSql[0].rows.raw();

  const getLotno = `SELECT lotno FROM coldstksummst GROUP BY lotno`;
  const LotnoDataSql = await db.executeSql(getLotno);
  const LotnoData = LotnoDataSql[0].rows.raw();

  const MastBookname = BooknameData.map(bookname => {
    return {label: bookname.bookname, value: bookname.bookname};
  });
  useReportStore.setState({MastBookname});

  const MastAgent = AgentnameData.map(agentname => {
    return {label: agentname.agentname, value: agentname.agentname};
  });
  useReportStore.setState({MastAgent});

  const MastItem = ItemnameData.map(itemname => {
    return {label: itemname.itemname, value: itemname.itemname};
  });
  useReportStore.setState({MastItem});

  const MastLotno = LotnoData.map(lotno => {
    return {label: lotno.lotno, value: lotno.lotno};
  });
  useReportStore.setState({MastLotno});
};

export const GetLedger = async ({
  id,
  Orderby = 'name',
}: {
  id?: string;
  Orderby?: string;
}) => {
  return new Promise<void>(async (resolve, reject) => {
    const db = await getDBConnection();

    const State = useReportStore.getState();
    const AppStore = useAppStore.getState();

    const Date = await setDate();
    const StartDate = State.FilterStartDate;
    const EndDate = State.FilterEndDate;

    const Role = useAppStore.getState().UserRights;

    const ExtractData = id
      ? '*'
      : 'ledgerid, compid, accid, party, crdr, balamt, cityname';

    let query = `SELECT ${ExtractData} FROM ledger `;

    if (
      StartDate ||
      EndDate ||
      (State.FilterCity && State.FilterCity?.length > 0) ||
      (State.FilterAgent && State.FilterAgent?.length > 0) ||
      (State.FilterArea && State.FilterArea?.length > 0) ||
      (State.FilterMonth && State.FilterMonth?.length > 0) ||
      (State.FilterSubschedule && State.FilterSubschedule?.length > 0)
    )
      query += ` WHERE `;

    if (StartDate) {
      query += ` ldate >= '${StartDate}'`;
    }

    if (EndDate) {
      if (StartDate) query += ` AND `;

      query += ` ldate <= '${EndDate}'`;
    }

    if (State.FilterCity && State.FilterCity?.length > 0) {
      if (StartDate || EndDate) query += ` AND `;

      query += ` cityname IN (${State.FilterCity?.map(
        (city: string) => `'${city}'`,
      ).join(',')})`;
    }

    if (State.FilterAgent && State.FilterAgent?.length > 0) {
      if (
        StartDate ||
        EndDate ||
        (State.FilterCity && State.FilterCity?.length > 0)
      )
        query += ` AND `;

      query += ` agentname IN (${State.FilterAgent?.map(
        (agent: string) => `'${agent}'`,
      ).join(',')})`;
    }

    if (State.FilterArea && State.FilterArea?.length > 0) {
      if (
        StartDate ||
        EndDate ||
        (State.FilterCity && State.FilterCity?.length > 0) ||
        (State.FilterAgent && State.FilterAgent?.length > 0)
      )
        query += ` AND `;

      query += ` areaname IN (${State.FilterArea?.map(
        (area: string) => `'${area}'`,
      ).join(',')})`;
    }

    if (State.FilterMonth && State.FilterMonth?.length > 0) {
      if (
        StartDate ||
        EndDate ||
        (State.FilterCity && State.FilterCity?.length > 0) ||
        (State.FilterAgent && State.FilterAgent?.length > 0) ||
        (State.FilterArea && State.FilterArea?.length > 0)
      )
        query += ` AND `;

      query += ` monthname IN (${State.FilterMonth?.map(
        (month: string) => `'${month}'`,
      ).join(',')})`;
    }

    if (State.FilterSubschedule && State.FilterSubschedule?.length > 0) {
      if (
        StartDate ||
        EndDate ||
        (State.FilterCity && State.FilterCity?.length > 0) ||
        (State.FilterAgent && State.FilterAgent?.length > 0) ||
        (State.FilterArea && State.FilterArea?.length > 0) ||
        (State.FilterMonth && State.FilterMonth?.length > 0)
      )
        query += ` AND `;

      query += ` subschedule IN (${State.FilterSubschedule?.map(
        (subschedule: string) => `'${subschedule}'`,
      ).join(',')})`;
    }

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
      setPartyWiseLedger(LedgerData);
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

    setLedger(returnData);

    resolve();
  });
};

export const GetLedgerFilterData = async () => {
  return new Promise<void>(async (resolve, reject) => {
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

    const MastCity = CityData.map(city => {
      return {label: city.cityname, value: city.cityname};
    });
    useReportStore.setState({MastCity});

    const MastAgent = AgentData.map(agent => {
      return {label: agent.agentname, value: agent.agentname};
    });
    useReportStore.setState({MastAgent});

    const MastCompany = companyData.map(company => {
      return {label: company.compyearname, value: company.compid};
    });
    useReportStore.setState({MastCompany});

    const MasterMonth = monthNameData.map(month => {
      return {label: month.monthname, value: month.monthname};
    });
    useReportStore.setState({MasterMonth});

    const MasterSubschedule = subscheduleData.map(subschedule => {
      return {label: subschedule.subschedule, value: subschedule.subschedule};
    });
    useReportStore.setState({MasterSubschedule});
    resolve();
  });
};

export const GetPartyWiseLedger = async ({
  party,
  accid,
  CompID,
}: {
  party: string;
  accid?: string;
  CompID: string;
}) => {
  return new Promise<void>(async (resolve, reject) => {
    const State = useReportStore.getState();
    const User = await Functions.getUser();

    const Date = await setDate();
    const StartDate = State.FilterStartDate;
    const EndDate = State.FilterEndDate;

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

    if (State.FilterMonth && State.FilterMonth?.length > 0) {
      query += ` AND monthname IN (${State.FilterMonth?.map(
        (month: string) => `'${month}'`,
      ).join(',')})`;
    }

    if (State.FilterSubschedule && State.FilterSubschedule?.length > 0) {
      query += ` AND monthname IN (${State.FilterSubschedule?.map(
        (subschedule: string) => `'${subschedule}'`,
      ).join(',')})`;
    }

    if (State.FilterStartDate) {
      query += ` AND ledger.ldate >= '${StartDate}'`;
    }

    if (State.FilterEndDate) {
      query += ` AND ledger.ldate <= '${EndDate}'`;
    }

    query += ` AND ledger.party IN ('${party}') ORDER BY ledgerid, date(ldate), op ASC;`;

    console.log('GetPartyWiseLedger query', query);

    const LedgerDataSql = await db.executeSql(query);

    const LedgerData = LedgerDataSql[0].rows.raw();
    console.log('LedgerData', LedgerData);
    setPartyWiseLedger(LedgerData);
    resolve();
  });
};

export const applyFilter = (setFilter: boolean) => {
  if (!setFilter) {
    resetFilter();
  }
};

export const resetFilter = () => {
  setFilterStartDate(undefined);
  setFilterEndDate(undefined);
  setFilterBookname([]);
  setFilterAgent([]);
  setFilterItem([]);
  setFilterLotno([]);
};

export const setPartyWiseStockSummary = (
  PartyWiseStockSummary: Datacoldstksummst[] | [],
) => useReportStore.setState({PartyWiseStockSummary});

export const setOSData = (OSData: OSInterfase[] | []) => {
  useReportStore.setState({MastOSList: OSData, FilterOSList: OSData});
};
export const setFilterOSList = (FilterOSList: OSInterfase[] | []) =>
  useReportStore.setState({FilterOSList});

export const setFilterCompany = (FilterCompany: FilterCompanyProp[] | []) =>
  useReportStore.setState({FilterCompany});

export const setFilterStartDate = (FilterStartDate: string | undefined) =>
  useReportStore.setState({FilterStartDate});

export const setFilterEndDate = (FilterEndDate: string | undefined) =>
  useReportStore.setState({FilterEndDate});

export const setFilterBookname = (FilterBookname: string[] | []) =>
  useReportStore.setState({FilterBookname});

export const setFilterAgent = (FilterAgent: string[] | []) =>
  useReportStore.setState({FilterAgent});

export const setFilterItem = (FilterItem: string[] | []) =>
  useReportStore.setState({FilterItem});

export const setFilterLotno = (FilterLotno: string[] | []) =>
  useReportStore.setState({FilterLotno});

export const setFilterArea = (FilterArea: string[] | []) =>
  useReportStore.setState({FilterArea});

export const setFilterMonth = (FilterMonth: string[] | []) =>
  useReportStore.setState({FilterMonth});

export const setFilterSubschedule = (FilterSubschedule: string[] | []) =>
  useReportStore.setState({FilterSubschedule});

export const setFilterCity = (FilterCity: string[] | []) =>
  useReportStore.setState({FilterCity});

export const setPartyWiseOS = (PartyWiseOS: Datasaleo[] | Datapurco[] | []) =>
  useReportStore.setState({PartyWiseOS});

export const setPartyTotal = (PartyTotal: PartyTotalProp) =>
  useReportStore.setState({PartyTotal});

export const setLedger = (Ledger: AccLedgerInterfase[]) =>
  useReportStore.setState({MastLedger: Ledger, FilterLedger: Ledger});

export const setFilterLedger = (FilterLedger: AccLedgerInterfase[]) =>
  useReportStore.setState({FilterLedger});

export const setPartyWiseLedger = (PartyWiseLedger: LedgerDataInterfase[]) =>
  useReportStore.setState({PartyWiseLedger});

export const setFilterLedgerComp = (FilterLedgerComp: string) =>
  useReportStore.setState({FilterLedgerComp});

export const setStockSummary = (data: StockListProp[] | []) =>
  useReportStore.setState({
    MasterStockSummary: data,
    FilterStockSummary: data,
  });

export const setFilterStockSummary = (FilterStockSummary: []) =>
  useReportStore.setState({FilterStockSummary});

export const setAccountSummary = (AccountWiseSummary: []) =>
  useReportStore.setState({AccountWiseSummary});

export const setOSCompny = (id: number) => {
  // const Company = state.FilterCompany;
  // const SelectedComp = Company.filter(comp => comp.compid == payload);
  const FilterCompany = useReportStore.getState().FilterCompany;
  FilterCompany.map(company => {
    if (company.compid == id) {
      company.selected = !company.selected;
    }
  });

  setFilterCompany(FilterCompany);
};
