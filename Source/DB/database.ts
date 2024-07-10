// import SQLite from 'react-native-sqlite-2';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({name: 'StrongServicesDB', location: 'default'});
};

// enablePromise(true);

export let DB = async () => {
  return new Promise<SQLiteDatabase>((resolve, reject) => {
    SQLite.openDatabase({
      name: 'StrongServicesDB',
      location: 'default',
    });
  });
};
export let db = SQLite.openDatabase({
  name: 'StrongServicesDB',
  location: 'default',
});

export const TableData = () => {
  return [
    {
      table_name: 'coldmst',
      table_field: `coldid INTEGER,
                    entryid INTEGER,
                    entryemail TEXT,
                    compid INTEGER,
                    accid INTEGER,
                    agentid INTEGER,
                    bookname TEXT,
                    compname TEXT,
                    accname TEXT,
                    delparty TEXT,
                    agentname TEXT,
                    srnochr TEXT,
                    SerialDt TEXT,
                    chldt TEXT,
                    outwardnochr TEXT,
                    lotno TEXT,
                    itemname TEXT,
                    partylot TEXT,
                    vakkal TEXT,
                    chamberlocation TEXT,
                    cadno TEXT,
                    outwrdcadno TEXT,
                    qty INTEGER,
                    weight INTEGER,
                    outqty INTEGER,
                    outweight INTEGER,
                    balqty INTEGER,
                    balweight INTEGER,
                    netbalqty INTEGER,
                    VehicleNo TEXT,
                    OutwardLrDt TEXT,
                    OutwardChlDt TEXT,
                    InwGridremarks TEXT,
                    inwremark TEXT,
                    outwrdremark TEXT,
                    OutGridremarks TEXT`,
    },
    {
      table_name: 'coldstksummst',
      table_field: `coldstkid INTEGER,
                    entryid INTEGER,
                    entryemail TEXT,
                    compid INTEGER,
                    accid INTEGER,
                    agentid INTEGER,
                    bookname TEXT,
                    compname TEXT,
                    accname TEXT,
                    agentname TEXT,
                    srnochr TEXT,
                    serialdt TEXT,
                    chldt TEXT,
                    lotno TEXT,
                    itemname TEXT,
                    partylot TEXT,
                    vakkal TEXT,
                    qty INTEGER,
                    weight INTEGER,
                    chlnochr TEXT,
                    outqty INTEGER,
                    outweight INTEGER,
                    balqty INTEGER,
                    balweight INTEGER,
                    OutwardLrDt TEXT,
                    InwGridremarks TEXT`,
    },
    {
      table_name: 'compmst',
      table_field: `compid INTEGER,
                    entryid INTEGER,
                    entryemail TEXT,
                    compname TEXT,
                    compmaindb TEXT,
                    compyearwiseemail TEXT,
                    compyearname TEXT,
                    compyeardbname TEXT,
                    installdate TEXT`,
    },

    {
      table_name: 'ledgermst',
      table_field: `ledgerid INTEGER,
                    entryid INTEGER,
                    entryemail TEXT,
                    compid INTEGER,
                    accid INTEGER,
                    party TEXT,
                    ldate TEXT,
                    account TEXT,
                    cheque TEXT,
                    dramt INTEGER,
                    cramt INTEGER,
                    balamt INTEGER,
                    crdr TEXT,
                    narration TEXT,
                    remarks TEXT,
                    agentName TEXT,
                    cityname TEXT,
                    acctype TEXT,
                    subschedule TEXT,
                    compcode TEXT,
                    monthname TEXT`,
    },
    {
      table_name: 'purcosmst',
      table_field: `purcosid INTEGER,
                    entryid INTEGER,
                    entryemail TEXT,
                    compid INTEGER,
                    accid INTEGER,
                    agentid INTEGER,
                    bookname TEXT,
                    compname TEXT,
                    agentname TEXT,
                    invnochr TEXT,
                    invdate TEXT,
                    accname TEXT,
                    cityname TEXT,
                    areaname TEXT,
                    compcode TEXT,
                    mobile TEXT,
                    billamt INTEGER,
                    prevrecamt INTEGER,
                    returnamt INTEGER,
                    recamt INTEGER,
                    runbalamt INTEGER,
                    balamt INTEGER,
                    days INTEGER,
                    CustomerEmail TEXT`,
    },
    {
      table_name: 'saleorddet',
      table_field: `SaleOrdId INTEGER,
                    EntryEmail TEXT,
                    CompId INTEGER,
                    ItemId INTEGER,
                    ItemName TEXT,
                    ItemGrpName TEXT,
                    UnitName TEXT,
                    PCase INTEGER,
                    Pcs INTEGER,
                    Qty INTEGER,
                    Box INTEGER,
                    Weight INTEGER`,
    },
    {
      table_name: 'saleosmst',
      table_field: `saleosid INTEGER,
                    entryid INTEGER,
                    entryemail TEXT,
                    compid INTEGER,
                    accid INTEGER,
                    agentid INTEGER,
                    bookname TEXT,
                    compname TEXT,
                    agentname TEXT,
                    invnochr TEXT,
                    invdate TEXT,
                    accname TEXT,
                    cityname TEXT,
                    areaname TEXT,
                    compcode TEXT,
                    mobile TEXT,
                    billamt INTEGER,
                    prevrecamt INTEGER,
                    returnamt INTEGER,
                    recamt INTEGER,
                    runbalamt INTEGER,
                    balamt INTEGER,
                    days INTEGER,
                    customeremail TEXT`,
    },
    {
      table_name: 'users',
      table_field: `entryId INTEGER,
                    userid TEXT,
                    entryName TEXT,
                    entryEmail TEXT,
                    entryPwd TEXT,
                    compdbname TEXT,
                    entryrights TEXT,
                    erepsaleos INTEGER,
                    ereppurcos INTEGER,
                    erepledger INTEGER,
                    erepcoldlotwise INTEGER,
                    erepcoldaccwise INTEGER,
                    erepcoldstkwise INTEGER,
                    efrmsaleorder INTEGER,
                    erepsaleorder INTEGER,
                    efrmsaleinvoice INTEGER,
                    erepsaleinvoice INTEGER,
                    accId INTEGER,
                    accname TEXT,
                    accEmail TEXT,
                    accpwd TEXT,
                    acctype TEXT,
                    areaname TEXT,
                    accrights TEXT,
                    arepsaleos INTEGER,
                    areppurcos INTEGER,
                    arepledger INTEGER,
                    arepcoldlotwise INTEGER,
                    arepcoldaccwise INTEGER,
                    arepcoldstkwise INTEGER,
                    afrmsaleorder INTEGER,
                    arepsaleorder INTEGER,
                    afrmsaleinvoice INTEGER,
                    arepsaleinvoice INTEGER,
                    hidefield INTEGER,
                    taxon INTEGER,
                    statename INTEGER`,
    },
    {
      table_name: 'saleordermst',
      table_field: `OrdNo INTEGER PRIMARY KEY,
                    OrdDate TEXT,
                    CompanyName TEXT,
                    CompId INTEGER,
                    BooKName TEXT,
                    BooKId INTEGER,
                    AreaName TEXT,
                    Areaid INTEGER,
                    AccName TEXT,
                    AccID INTEGER,
                    AgentName TEXT,
                    AgentId INTEGER,
                    ItemId INTEGER,
                    ItemName TEXT,
                    ItemGrpname TEXT,
                    Pcs INTEGER,
                    Pac INTEGER,
                    Qty INTEGER,
                    MstRate INTEGER,
                    Rate INTEGER,
                    Rateperunit INTEGER,
                    Amt INTEGER,
                    Dis1per INTEGER,
                    Dis1amt INTEGER,
                    Dis2per INTEGER,
                    Dis2amt INTEGER,
                    GstGamt INTEGER,
                    SGSTPER	INTEGER,
                    SGSTAMT	INTEGER,
                    CGSTPER	INTEGER,
                    CGSTAMT	INTEGER,
                    IGSTPER	INTEGER,
                    IGSTAMT	INTEGER,
                    Gamt INTEGER,
                    isSYNC INTEGER,
                    UniqNumber INTEGER`,
    },
    {
      table_name: 'itemmst',
      table_field: `id INTEGER,
                    itemid INTEGER,
                    itemname TEXT,
                    itemGrpname TEXT,
                    packper TEXT,
                    rateperunit TEXT,
                    unitName TEXT,
                    entryemail TEXT,
                    compid INTEGER,
                    itemCode INTEGER,
                    mrp TEXT,
                    salerate TEXT,
                    disc TEXT,
                    sgstper TEXT,
                    cgstper TEXT,
                    igstper TEXT`,
    },
  ];
};

export const createTable = async (db: SQLiteDatabase) => {
  const Tables = TableData();
  Tables?.map(async table => {
    const query = `CREATE TABLE IF NOT EXISTS ${table.table_name} (${table.table_field})`;
    await db
      .executeSql(query)
      .then()
      .catch(error => console.log('error', error));
  });
};

export const DeleteAllData = async () => {
  const db = await getDBConnection();

  const Tables = TableData();
  const DeleteQury = Tables?.map(async table => {
    return new Promise<void>(async (resolve, reject) => {
      // const query = `DELETE FROM ${table.table_name}`;
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM ${table.table_name} `,
          [],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              console.log(
                `All data deleted from the table ${table.table_name} `,
              );
            }
          },
          error => {
            // Handle error
            console.log(`Error deleting data from the table: ${error} `);
            return false;
          },
        );
      });
      // await db.executeSql(query);
    });
  });

  Promise.all(DeleteQury)
    .then(successResults => {
      return;
      console.log('DeleteAllData successResults >>>>>');
    })
    .catch(async error => {
      return;
      console.error('Error in insert queries:', error);
    });
};

export async function DeleteTable(tableName: string) {
  // const DB = await db;
  const db = await getDBConnection();
  console.log('tableName', tableName);
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM ${tableName} `,
      [],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log(`All data deleted from the table ${tableName} `);
        }
      },
      error => {
        // Handle error
        console.log(`Error deleting data from the table: ${error} `);
        return false;
      },
    );
  });
}

export const Updatetblmst = async ({
  date,
  tableName,
}: {
  tableName: string;
  date: string;
}) => {
  const db = await getDBConnection();
  db.transaction(tx => {
    tx.executeSql(
      `UPDATE tableMst SET updated_at='${date}' WHERE tableName='${tableName}'`,
      [],
      (tx, results) => {
        if (results.rowsAffected > 0) {
          console.log(`All data Updated table name is ${tableName} `);
        }
      },
      error => {
        // Handle error
        console.log(
          `Error Updating table name is ${tableName}, error ${error}`,
        );
        return false;
      },
    );
  });
};
