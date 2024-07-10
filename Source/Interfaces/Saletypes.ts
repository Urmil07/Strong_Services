import {Datacompmst, Datausermst} from './ReportInterface';

export interface SaleCompanies extends Datacompmst {
  label: string;
  value: any;
}

export interface SaleBookname {
  label: string;
  value: any;
  accId: string;
  accname: string;
}

export interface SaleArea extends Datausermst {
  label: string;
  value: any;
}

export interface SaleParty {
  label: string;
  value: any;
  accname: string;
  accId: string;
  userid: string;
  areaname: string;
}
export interface SaleAgents {
  label: string;
  value: any;
  accname: string;
  accId: string;
  userid: string;
  areaname: string;
}

export interface OrderProp {
  itemid: string;
  itemName: string;
  itemGrpname: string;
  pcs: string;
  pac: string;
  qty: string;
  mstrate: string;
  rate: string;
  rateperunit: string;
  amt: string;
  disc1per: string;
  disc1amt: string;
  disc2per: string;
  disc2amt: string;
  sgstper: string;
  sgstamt: string;
  cgstper: string;
  cgstamt: string;
  igstper: string;
  igstamt: string;
  gstgamt: string;
  gamt: string;
}

export interface OrderListProp {
  AccName: string;
  AgentId: number;
  AgentName: string;
  AreaName: string;
  BooKName: string;
  CompId: number;
  CompanyName: string;
  Gamt: number;
  OrdDate: string;
  UniqNumber: number;
}
