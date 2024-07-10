import {
  OrderListProp,
  SaleAgents,
  SaleArea,
  SaleBookname,
  SaleCompanies,
  SaleParty,
} from '@Interfaces';

import {Datausermst} from '@/Interfaces/ReportInterface';
import {create} from 'zustand';
import {getDBConnection} from '@/DB/database';
import {logger} from '@Utils';
import {setLoading} from './Appaction';

interface Prop {
  MasterSaleAccountList: Datausermst[];
  FilterSaleAccountList: Datausermst[];
  Companies: SaleCompanies[];
  SelectedCompany: SaleCompanies | {};
  Booknames: SaleBookname[];
  Areas: SaleArea[];
  Agents: SaleAgents[];
  Party: SaleParty[];
  OrderList: OrderListProp[];
}
export const useSaleStore = create<Prop>(() => ({
  MasterSaleAccountList: [],
  FilterSaleAccountList: [],
  Companies: [],
  SelectedCompany: {},
  Booknames: [],
  Areas: [],
  Agents: [],
  Party: [],
  OrderList: [],
}));

export const getOrders = async () => {
  try {
    setLoading(true);
    const db = await getDBConnection();
    const query = `SELECT  AccName, UniqNumber, OrdDate, CompanyName, CompId, AreaName, AgentId, AgentName, BooKName, Gamt FROM saleordermst WHERE isSYNC='0' GROUP BY UniqNumber`;

    const getOrder = await db.executeSql(query);
    const OrderData = getOrder[0].rows.raw();
    // logger.log('OrderData', OrderData);
    setOrderList(OrderData);
  } catch (error) {
    let message = 'Something went wrong!';
    if (typeof error === 'string') message = error;
    if (error instanceof Error) message = error.message;
    logger.toast(message);
  }
};
export const setOrderList = (OrderList: OrderListProp[] | []) =>
  useSaleStore.setState({OrderList});

export const getSaleData = async () => {
  try {
    setLoading(true);
    const db = await getDBConnection();

    let getCompaniesQuery = `SELECT * FROM compmst ORDER BY compid,compname,compyearname`;
    // console.log('getCompaniesQuery', getCompaniesQuery);
    const getCompany = await db.executeSql(getCompaniesQuery);
    const CompanyData = getCompany[0].rows.raw();
    const MastCompany = CompanyData.map(company => {
      return {...company, label: company.compyearname, value: company.compid};
    });

    let getBooknameQuery = `SELECT accname,accId FROM users WHERE acctype='SALES BOOK'`;
    // console.log('getBooknameQuery', getBooknameQuery);
    const getBookname = await db.executeSql(getBooknameQuery);
    const BooknameData = getBookname[0].rows.raw();
    const MastBookname = BooknameData.map(bookname => {
      return {...bookname, label: bookname.accname, value: bookname.accname};
    });

    let getPartyQuery = `SELECT accname,accId,userid,areaname FROM users WHERE accrights='Client'`;
    // console.log('getPartyQuery', getPartyQuery);
    const getParty = await db.executeSql(getPartyQuery);
    const PartyData = getParty[0].rows.raw();
    const MastParty = PartyData.map(party => {
      return {...party, label: party.accname, value: party.accId};
    });

    let getAgentQuery = `SELECT accname,accId,userid,areaname FROM users WHERE accrights='Agent'`;
    // console.log('getPartyQuery', getPartyQuery);
    const getAgent = await db.executeSql(getAgentQuery);
    const AgentData = getAgent[0].rows.raw();
    const MastAgent = AgentData.map(agent => {
      return {...agent, label: agent.accname, value: agent.accId};
    });

    setParty(MastParty);
    setCompanies(MastCompany);
    setBooknames(MastBookname);
    setAgents(MastAgent);
  } catch (error) {
    let message = 'Something went wrong!';
    if (typeof error === 'string' && error) message = error;
    else if (error instanceof Error) message = error.message;
    logger.toast(message);
  } finally {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }
};

export const setCompanies = (Companies: SaleCompanies[]) =>
  useSaleStore.setState({Companies});

export const setBooknames = (Booknames: SaleBookname[]) =>
  useSaleStore.setState({Booknames});

export const setAreas = (Areas: SaleArea[]) => useSaleStore.setState({Areas});
export const setAgents = (Agents: SaleAgents[]) =>
  useSaleStore.setState({Agents});

export const setParty = (Party: SaleParty[]) => useSaleStore.setState({Party});

export const getSaleAccounts = async () => {
  setLoading(true);
  const db = await getDBConnection();

  const SaleDataSql = await db.executeSql(
    `SELECT accname,accId,userid,entryId,entryName FROM users WHERE accrights='Client'`,
  );
  // const SaleDataSql = await db.executeSql(
  //   `SELECT * FROM users WHERE accrights='Client'`,
  // );

  const SaleData = SaleDataSql[0].rows.raw();
  // console.log('SaleData', SaleData);
  setSaleAccountList(SaleData);
  setTimeout(() => {
    setLoading(false);
  }, 800);
};

export const setSaleAccountList = (SaleAccountList: Datausermst[] | []) =>
  useSaleStore.setState({
    MasterSaleAccountList: SaleAccountList,
    FilterSaleAccountList: SaleAccountList,
  });

export const setFilterSaleAccountList = (
  FilterSaleAccountList: Datausermst[] | [],
) => useSaleStore.setState({FilterSaleAccountList});
