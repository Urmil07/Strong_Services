export interface EstrongReportInterface {
  status: number;
  message: string;
  data_saleos: Datasaleo[];
  data_purcos: Datapurco[];
  data_ledger: Dataledger[];
  data_coldmst: Datacoldmst[];
  data_coldstksummst: Datacoldstksummst[];
  data_itemmst: Dataitemmst[];
  data_compmst: Datacompmst[];
}

export interface Datacompmst {
  compid: string;
  entryid?: any;
  entryemail: string;
  compname: string;
  compmaindb: string;
  compyearwiseemail: string;
  compyearname: string;
  compyeardbname: string;
  installdate: string;
}

export interface Dataitemmst {
  id: string;
  itemid: string;
  ItemName: string;
  ItemGrpName: string;
  UnitName: string;
  EntryEmail: string;
  CompId: string;
}

export interface Datacoldstksummst {
  coldstkid: string;
  entryid: string;
  entryemail: string;
  compid: string;
  accid: string;
  agentid: string;
  bookname: string;
  compname: string;
  accname: string;
  agentname: string;
  srnochr: string;
  serialdt: string;
  chldt: string;
  lotno: string;
  itemname: string;
  partylot: string;
  vakkal: string;
  qty: string;
  weight: string;
  chlnochr: string;
  outqty: string;
  outweight: string;
  balqty: string;
  balweight: string;
  OutwardLrDt: string;
  InwGridremarks: string;
}

export interface Datacoldmst {
  coldid: string;
  entryid?: any;
  entryemail: string;
  compid: string;
  accid: string;
  agentid: string;
  bookname: string;
  compname: string;
  accname: string;
  delparty: string;
  agentname: string;
  srnochr: string;
  SerialDt: string;
  chldt: string;
  outwardnochr: string;
  lotno: string;
  itemname: string;
  partylot: string;
  vakkal: string;
  chamberlocation?: any;
  cadno: string;
  outwrdcadno: string;
  qty: string;
  weight: string;
  outqty: string;
  outweight: string;
  balqty: string;
  balweight: string;
  netbalqty: string;
  VehicleNo?: any;
  OutwardLrDt?: any;
  OutwardChlDt?: any;
  InwGridremarks: string;
  inwremark: string;
  outwrdremark: string;
  OutGridremarks: string;
}

export interface Dataledger {
  ledgerid: string;
  entryid: string;
  entryemail: string;
  compid: string;
  accid: string;
  party?: any;
  ldate?: any;
  account?: any;
  cheque?: any;
  dramt?: any;
  cramt: string;
  balamt: string;
  crdr: string;
  narration: string;
  remarks: string;
  agentName: string;
  cityname: string;
}

export interface Datapurco {
  purcosid: string;
  entryid: string;
  entryemail: string;
  compid: string;
  accid: string;
  agentid: string;
  bookname: string;
  compname: string;
  agentname: string;
  invnochr: string;
  invdate: string;
  accname?: any;
  cityname: string;
  mobile: string;
  billamt: string;
  prevrecamt: string;
  returnamt: string;
  recamt: string;
  runbalamt: string;
  balamt: string;
  days: string;
  CustomerEmail: string;
}

export interface Datasaleo {
  saleosid: string;
  entryid: string;
  entryemail: string;
  compid: string;
  accid: string;
  agentid: string;
  bookname: string;
  compname: string;
  agentname: string;
  invnochr: string;
  invdate: string;
  accname: string;
  cityname: string;
  mobile: string;
  billamt: string;
  prevrecamt: string;
  returnamt: string;
  recamt: string;
  runbalamt: string;
  balamt: string;
  days: string;
  customeremail: string;
}
