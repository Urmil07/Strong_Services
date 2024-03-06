interface OSInterfase {
  totalbill: string;
  cityname: string;
  areaname: string;
  accid: string;
  accname: string;
  compid: string;
  compname: string;
  mobile: string;
}

interface AccLedgerInterfase {
  ledgerid: string;
  compid: string;
  crdr: string;
  balamt: string;
  cityname: string;
  accid: string;
  party: string;
  totalbal: string;
}

interface SaleOSDataInterfase {
  accid: string;
  accname?: any;
  agentid: string;
  agentname: string;
  balamt: string;
  billamt: string;
  bookname: string;
  cityname: string;
  compid: string;
  compname: string;
  customeremail: string;
  days: string;
  entryemail: string;
  entryid: string;
  invdate: string;
  invnochr: string;
  mobile: string;
  prevrecamt: string;
  saleosid: string;
  recamt: string;
  returnamt: string;
  runbalamt: string;
}

interface LedgerDataInterfase {
  accid: number; // x
  account: string; // x
  agentName: string;
  balamt: number; // x
  cheque: string;
  cityname: string;
  compid: number;
  cramt: number; // x
  crdr: string; // x
  dramt: number; // x
  entryemail: string; // x
  entryid: number; // x
  ldate: string; // x
  ledgerid: number;
  narration: string;
  party: string; // x
  remarks: string;
  monthname: string; // x
  acctype: string;
  subschedule: string;
  compcode: string;
  op: string;
}
