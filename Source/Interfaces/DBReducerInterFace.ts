interface OSInterfase {
  totalbill: string;
  cityname: string;
  accid: string;
  accname: string;
  compid: string;
  compname: string;
  mobile: string;
  id: string;
  // data: SaleOSDataInterfase[];
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
  accid: number;
  account: string;
  agentName: string;
  balamt: number;
  cheque: string;
  cityname: string;
  compid: number;
  cramt: number;
  crdr: string;
  dramt: number;
  entryemail: string;
  entryid: number;
  ldate: string;
  ledgerid: number;
  narration: string;
  party: string;
  remarks: string;
}
