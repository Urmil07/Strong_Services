import {Datasaleordermst, Datausermst} from '@/Interfaces/ReportInterface';
import {FetchMethod, URL} from '@Constants';
import {
  OrderListProp,
  OrderProp,
  SaleAgents,
  SaleArea,
  SaleBookname,
  SaleCompanies,
  SaleParty,
} from '@Interfaces';

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
  OrderList: Datasaleordermst[];
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
    // const query = `SELECT  AccName, UniqNumber, OrdDate, CompanyName, CompId, AreaName, AgentId, AgentName, BooKName, Gamt FROM saleordermst WHERE isSYNC='0' GROUP BY UniqNumber`;
    const query = `SELECT  * FROM saleordermst GROUP BY UniqNumber`;

    const getOrder = await db.executeSql(query);
    const OrderData = getOrder[0].rows.raw();

    setOrderList(OrderData);
  } catch (error) {
    let message = 'Something went wrong!';
    if (typeof error === 'string') message = error;
    if (error instanceof Error) message = error.message;
    logger.toast(message);
  }
};
export const setOrderList = (OrderList: Datasaleordermst[] | []) =>
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

    let getPartyQuery = `SELECT accname,accId,userid,areaname FROM users WHERE LOWER(accrights)='client'`;
    // console.log('getPartyQuery', getPartyQuery);
    const getParty = await db.executeSql(getPartyQuery);
    const PartyData = getParty[0].rows.raw();
    const MastParty = PartyData.map(party => {
      return {...party, label: party.accname, value: party.accId};
    });

    let getAgentQuery = `SELECT accname,accId,userid,areaname FROM users WHERE LOWER(accrights)='agent'`;

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

export const sycOrders = async () => {
  try {
    setLoading(true);
    const db = await getDBConnection();

    let query = `SELECT OrdNo, OrdDate, CompanyName, CompId, BooKName, BooKId, AreaName, Areaid, AccName, AccID, AgentName, AgentId, ItemId, ItemName, ItemGrpname, Pcs, Pac, Qty, MstRate, Rate, Rateperunit, Amt, Dis1per, Dis1amt, Dis2per, Dis2amt, GstGamt, SGSTPER, SGSTAMT, CGSTPER, CGSTAMT, IGSTPER, IGSTAMT, Gamt, isSYNC, UniqNumber FROM saleordermst WHERE isSYNC=0`;
    // console.log('getPartyQuery', getPartyQuery);
    const getOrders = await db.executeSql(query);
    const Orders = getOrders[0].rows.raw();

    if (!Orders.length) throw 'No orders found!';
    const Params = {jsonstr: JSON.stringify(Orders)};
    const response = await FetchMethod.POST_FORMDATA({
      EndPoint: URL.Estrongaddord,
      Params,
    });

    if (response.code !== 200) throw response.message;

    db.transaction(tx => {
      const Rdata_entryupdate = Orders.map(data => {
        const {OrdNo} = data;

        tx.executeSql(
          `UPDATE saleordermst SET isSYNC=1 WHERE OrdNo='${OrdNo}'`,
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
            }
          },
          error => {
            // Handle error
            logger.log(`Error Updating table name is ${OrdNo}, error ${error}`);
            return false;
          },
        );
      });
    });
    // return Orders;
  } catch (error) {
    let message = 'Something went wrong!';
    if (typeof error === 'string' && error) message = error;
    if (error instanceof Error) message = error.message;
    logger.toast(message);
    logger.log('sycOrders');
  } finally {
    setLoading(false);
  }
};

export const getUniqOrder = async ({UniqNumber}: {UniqNumber: string}) => {
  try {
    setLoading(true);
    const db = await getDBConnection();
    const query = `SELECT * FROM saleordermst WHERE UniqNumber=${UniqNumber}`;

    const OrderSql = await db.executeSql(query);
    // const SaleDataSql = await db.executeSql(
    //   `SELECT * FROM users WHERE accrights='Client'`,
    // );

    const OrderData = OrderSql[0].rows.raw();
    const finalOrderData = OrderData.map(item => {
      return {
        itemid: String(item.ItemId),
        itemName: item.ItemName,
        itemGrpname: item.ItemGrpname,
        pcs: String(item.Pcs),
        pac: String(item.Pac),
        qty: String(item.Qty),
        mstrate: String(item.MstRate),
        rate: String(item.Rate),
        rateperunit: String(item.Rateperunit),
        amt: String(item.Amt),
        disc1per: String(item.Dis1per),
        disc1amt: String(item.Dis1amt),
        disc2per: String(item.Dis2per),
        disc2amt: String(item.Dis2amt),
        sgstper: String(item.SGSTPER),
        sgstamt: String(item.SGSTAMT),
        cgstper: String(item.CGSTPER),
        cgstamt: String(item.CGSTAMT),
        igstper: String(item.IGSTPER),
        igstamt: String(item.IGSTAMT),
        gstgamt: String(item.GstGamt),
        gamt: String(item.Gamt),
      };
    });

    return finalOrderData;
  } catch (error) {
    let message = 'Something went wrong!';
    if (typeof error === 'string' && error) message = error;
    if (error instanceof Error) message = error.message;
    logger.toast(message);
    logger.log('Error in getUniqOrder');
  } finally {
    setLoading(false);
  }
};
