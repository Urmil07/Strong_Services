import {setLoading, setToast} from './Appaction';

import {Dataitemmst} from '@/Interfaces/ReportInterface';
import {create} from 'zustand';
import {getDBConnection} from '@/DB/database';
import {logger} from '@Utils';

interface ItemListProp extends Dataitemmst {
  label: string;
  value: string;
}

interface Prop {
  OrderForm: {
    itemName: string;
    itemid: string;
    pcs: string;
    pac: string;
    qty: string;
    rate: string;
    dis1: string;
    dis2: string;
  }[];
  ItemList: ItemListProp[];
}
export const useOrderStore = create<Prop>(() => ({
  OrderForm: [
    {
      itemName: '',
      itemid: '',
      pcs: '',
      pac: '',
      qty: '',
      rate: '',
      dis1: '',
      dis2: '',
    },
  ],
  ItemList: [],
}));

export const setAddOreder = () => {
  const OrderForm = useOrderStore.getState().OrderForm;
  const newArray = [
    ...OrderForm,
    {
      itemName: '',
      itemid: '',
      pcs: '',
      pac: '',
      qty: '0',
      rate: '',
      dis1: '',
      dis2: '',
    },
  ];

  useOrderStore.setState({OrderForm: newArray});
};

export const getItemList = async () => {
  try {
    setLoading(true);
    const db = await getDBConnection();

    const ItemQuery = await db.executeSql('SELECT * FROM itemmst');
    const ItemData: Dataitemmst[] = ItemQuery[0].rows.raw();

    const MastItem = ItemData.map(item => {
      return {label: item.itemname, value: item.itemid, ...item};
    });
    setItemList(MastItem);
  } catch (error) {
    let message = 'Something went wrong!';
    if (typeof error === 'string') message = error;
    if (error instanceof Error) message = error.message;
    logger.toast(message);
  } finally {
    setLoading(false);
  }
};

export const setItemList = (ItemList: ItemListProp[]) =>
  useOrderStore.setState({ItemList});

interface OrderValueProp {
  index: number;
  fieldName: string;
  value: any;
}

export const setOrderValue = ({fieldName, index, value}: OrderValueProp) => {
  const OrderForm = useOrderStore.getState().OrderForm;

  if (fieldName === 'item') {
    OrderForm[index].itemName = value.label;
    OrderForm[index].itemid = value.value;
    OrderForm[index].rate = String(value.salerate);
    OrderForm[index].dis1 = String(value.disc);
    OrderForm[index].pac = String(value.packper);
    OrderForm[index].pcs = '0';
    OrderForm[index].qty = '0';
  }
  if (fieldName == 'pcs') {
    OrderForm[index].pcs = value;
    const multi = Number(OrderForm[index].pcs) * Number(OrderForm[index].pac);
    OrderForm[index].qty = String(multi);
  }

  useOrderStore.setState({OrderForm});
};

// {"_index": 3, "cgstper": 2.5, "compid": 2058, "disc": 0, "entryemail": "dssnvs@gmail.com", "id": 11318, "igstper": 5, "itemCode": "", "itemGrpname": "SUIT", "itemid": 1010, "itemname": "ALFA B/D", "label": "ALFA B/D", "mrp": 0, "salerate": 175, "sgstper": 2.5, "unitName": "", "value": 1010}

export const addNewOrder = async () => {
  try {
    const db = await getDBConnection();
  } catch (error) {
    setToast({
      toast: true,
      toastMessage: `Something went wrong While Saving Order! ${error}`,
    });
  }
};
