interface SaleOSInterfase {
  totalbill: string;
  accid: string;
  accname: string;
  data: SaleOSDataInterfase[];
}

interface SaleOSDataInterfase {
  // CustomerEmail: string;
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
  // purcosid: string;
  recamt: string;
  returnamt: string;
  runbalamt: string;
}
