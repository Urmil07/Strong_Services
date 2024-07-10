import {Colors, FontFamily, FontSize, isIOS} from '@Constants';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Functions, logger, useGetUserDetails, useKeyboard} from '@Utils';
import {RNCButton, RNCDropdown, RNCText} from 'Common';
import React, {FC, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  getItemList,
  getUserInfo,
  setOrderValue,
  setToast,
  useAppStore,
  useHomeStore,
  useOrderStore,
  usePrivilegesStore,
} from '@Actions';

import {Datausermst} from '@/Interfaces/ReportInterface';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {OrderCard} from 'CApp';
import {OrderProp} from '@Interfaces';
import {TakeOrderPageProps} from '@/Interfaces/AppStackParamList';
import dayjs from 'dayjs';
import {getDBConnection} from '@/DB/database';
import normalize from 'react-native-normalize';

type TotalType = {
  amt: number;
  disc1amt: number;
  disc2amt: number;
  gstgamt: number;
  sgstamt: number;
  cgstamt: number;
  igstamt: number;
  gamt: number;
};

const TakeOrder: FC<TakeOrderPageProps> = ({navigation, route}) => {
  const isKeyboardVisible = useKeyboard();
  const {getDetails} = useGetUserDetails();
  const {
    accid,
    accname,
    areaname,
    bookid,
    bookname,
    compid,
    compname,
    agentid,
    agentname,
    flg,
  } = route.params;

  const {UserRights} = useAppStore();
  const {ActiveUser} = useHomeStore();
  const {User} = usePrivilegesStore(state => ({
    User: state.User as Datausermst,
  }));

  const [OrderList, setOrderList] = useState<OrderProp[]>([
    {
      itemid: '',
      itemName: '',
      itemGrpname: '',
      pcs: '',
      pac: '',
      qty: '',
      mstrate: '',
      rate: '',
      rateperunit: '',
      amt: '',
      disc1per: '',
      disc1amt: '',
      disc2per: '',
      disc2amt: '',
      sgstper: '',
      sgstamt: '',
      cgstper: '',
      cgstamt: '',
      igstper: '',
      igstamt: '',
      gstgamt: '',
      gamt: '',
    },
  ]);
  const [Total, setTotal] = useState<TotalType>({
    amt: 0,
    disc1amt: 0,
    disc2amt: 0,
    gstgamt: 0,
    sgstamt: 0,
    cgstamt: 0,
    igstamt: 0,
    gamt: 0,
  });

  const {format} = new Intl.NumberFormat('hi-IN', {
    style: 'currency',
    currency: 'INR',
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: 'Order',
      headerStyle: {
        backgroundColor: Colors.header,
      },
      headerTintColor: Colors.WText,
      headerTitleStyle: {fontFamily: FontFamily.SemiBold},
      headerBackTitleVisible: false,
      headerRight(props) {
        return (
          <Pressable
            onPress={() => {
              const newData = {
                itemid: '',
                itemName: '',
                itemGrpname: '',
                pcs: '',
                pac: '',
                qty: '',
                mstrate: '',
                rate: '',
                rateperunit: '',
                amt: '',
                disc1per: '',
                disc1amt: '',
                disc2per: '',
                disc2amt: '',
                sgstper: '',
                sgstamt: '',
                cgstper: '',
                cgstamt: '',
                igstper: '',
                igstamt: '',
                gstgamt: '',
                gamt: '',
              };
              setOrderList(prevOrderList => [...prevOrderList, newData]);
            }}>
            <Ionicons
              name="add-circle-sharp"
              size={normalize(25)}
              color={Colors.WText}
            />
          </Pressable>
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    getItemList();
    getUserInfo({accId: accid});
  }, []);

  useEffect(() => {
    const Total = OrderList.reduce(
      (total, item) => {
        // Convert field values to numbers before adding

        total.amt += parseFloat(item.amt) || 0;
        total.disc1amt += parseFloat(item.disc1amt) || 0;
        total.disc2amt += parseFloat(item.disc2amt) || 0;
        total.gstgamt += parseFloat(item.gstgamt) || 0;
        total.sgstamt += parseFloat(item.sgstamt) || 0;
        total.cgstamt += parseFloat(item.cgstamt) || 0;
        total.igstamt += parseFloat(item.igstamt) || 0;
        total.gamt += parseFloat(item.gamt) || 0;

        return total;
      },
      {
        amt: 0,
        disc1amt: 0,
        disc2amt: 0,
        gstgamt: 0,
        sgstamt: 0,
        cgstamt: 0,
        igstamt: 0,
        gamt: 0,
      },
    );

    setTotal(Total);
  }, [OrderList]);

  const setValue = async ({
    fieldName,
    index,
    value,
  }: {
    fieldName: string;
    value: any;
    index: number;
  }) => {
    console.log('value', value);
    console.log('fieldName', fieldName);
    // return;
    // console.log('User', User);
    const isSameState = User.statename == ActiveUser?.statename;

    const Order = [...OrderList];
    logger.log('value', value);

    if (fieldName === 'item') {
      Order[index].amt = '';
      Order[index].cgstamt = '';
      Order[index].cgstper = value.cgstper ? String(value.cgstper) : '';
      Order[index].disc1amt = '';
      Order[index].disc1per = value.disc ? String(value.disc) : '';
      Order[index].disc2amt = '';
      Order[index].disc2per = '';
      Order[index].gamt = '';
      Order[index].gstgamt = '';
      Order[index].igstamt = '';
      Order[index].igstper = value.igstper ? String(value.igstper) : '';
      Order[index].itemGrpname = value.itemGrpname || '';
      Order[index].itemName = value.label || '';
      Order[index].itemid = value.value || '';
      Order[index].mstrate = value.salerate ? String(value.salerate) : '';
      Order[index].pac = value.packper ? String(value.packper) : '';
      Order[index].pcs = '';
      Order[index].qty = '';
      Order[index].rate = '';
      Order[index].rateperunit = value.rateperunit
        ? String(value.rateperunit)
        : '';
      Order[index].sgstamt = '';
      Order[index].sgstper = value.sgstper ? String(value.sgstper) : '';
    }

    if (fieldName == 'mstrate') Order[index].mstrate = value;

    if (fieldName === 'pcs') {
      Order[index].pcs = value;
    }

    if (fieldName === 'pac') Order[index].pac = value;

    if (fieldName === 'disc2per') {
      const amt = parseFloat(Order[index].amt);
      const disc1amt = parseFloat(Order[index].disc1amt);
      const disc2per = parseFloat(value);
      let Disc2amt = 0;

      if (disc2per) Disc2amt = (amt - disc1amt) * (disc2per / 100);

      Order[index].disc2amt = Disc2amt.toFixed(2);
      Order[index].disc2per = disc2per ? disc2per.toString() : '';
    }

    setOrderList(Order);
    if (Order[index].itemid <= '0') return;
    handleCalculation({currOrder: Order[index], index});
  };

  const handleCalculation = ({
    currOrder: Order,
    index,
  }: {
    currOrder: OrderProp;
    index: number;
  }) => {
    const isSameState = User.statename == ActiveUser?.statename;
    const taxon = User.taxon;
    let qty = 0;

    if (User.hidefield == '0')
      qty = parseFloat(Order.pcs) * parseFloat(Order.pac);
    else qty = parseFloat(Order.qty);

    const pcs = parseFloat(Order.pcs);
    const pac = parseFloat(Order.pac);

    if (pac && pcs) qty = parseFloat(Order.pcs) * parseFloat(Order.pac);

    const sgstper = parseFloat(Order.sgstper) ?? 0;
    const cgstper = parseFloat(Order.cgstper) ?? 0;
    const igstper = parseFloat(Order.igstper) ?? 0;
    const rateperunit = parseFloat(Order.rateperunit) ?? 0;
    const disc1per = parseFloat(Order.disc1per) ?? 0;
    const disc2per = parseFloat(Order.disc2per) ?? 0;

    let rate;
    let gstPer;
    let amt;
    let Disc1amt;
    let Disc2amt;
    let gstamt;
    let GgstPer;
    let GstGamt;
    let Gamt;
    let sgstamt;
    let cgstamt;
    let igstamt;

    if (isSameState) {
      gstPer = (sgstper + cgstper + 100) / 100;
    } else {
      gstPer = (igstper + 100) / 100;
    }

    if (taxon) rate = Number(Order.mstrate);
    else rate = Number(Order.mstrate) / gstPer;

    if (rateperunit) {
      const unitrate = rate / rateperunit;
      amt = qty * unitrate;
    } else amt = qty * rate;

    if (disc1per) Disc1amt = amt * (disc1per / 100);
    else Disc1amt = 0;

    if (disc2per) Disc2amt = (amt - Disc1amt) * (disc2per / 100);
    else Disc2amt = 0;

    GstGamt = amt - Disc1amt - Disc2amt;

    if (isSameState) {
      gstamt = (GstGamt * sgstper) / 100;
      GgstPer = sgstper + cgstper;
      sgstamt = gstamt.toFixed(2);
      cgstamt = gstamt.toFixed(2);
      igstamt = '0';
    } else {
      gstamt = (GstGamt * igstper) / 100;
      GgstPer = igstper;

      sgstamt = '0';
      cgstamt = '0';
      igstamt = gstamt.toFixed(2);
    }

    Gamt = GstGamt + GstGamt * (GgstPer / 100);

    const Orders = [...OrderList];

    Orders[index].amt = amt.toFixed(2);
    Orders[index].cgstamt = cgstamt;
    Orders[index].cgstper = cgstper ? cgstper.toString() : '';
    Orders[index].disc1amt = Disc1amt.toFixed(2);
    Orders[index].disc1per = disc1per ? disc1per.toString() : '';
    Orders[index].disc2amt = Disc2amt.toFixed(2);
    Orders[index].disc2per = disc2per ? disc2per.toString() : '';
    Orders[index].gamt = Gamt.toFixed(2);
    Orders[index].gstgamt = GstGamt.toFixed(2);
    Orders[index].igstamt = igstamt;
    Orders[index].igstper = igstper ? igstper.toString() : '';
    Orders[index].rate = rate.toFixed(2);
    Orders[index].sgstamt = sgstamt;
    Orders[index].sgstper = sgstper ? sgstper.toFixed(2) : '';
    // Orders[index].itemGrpname = '';
    // Orders[index].itemName = '';
    // Orders[index].itemid = '';
    // Orders[index].mstrate = '';
    // Orders[index].pac = '';
    // Orders[index].pcs = '';
    Orders[index].qty = qty.toString();
    // Orders[index].rateperunit = '';
    setOrderList(Orders);
  };

  const handleSubmit = async () => {
    if (isKeyboardVisible) {
      Keyboard.dismiss();
      return;
    }
    const orderList = [...OrderList];

    // const isValid = validateOrderList(orderList);
    // const isValid = orderList.every(validateObject);
    const isValid = true;

    console.log('isValid', isValid);
    if (isValid) {
      // console.log('orderList', orderList);

      const datetime = dayjs();

      const orderDate = dayjs(datetime).format('YYYY-MM-DD hh:mm:ss');

      const currUser = await Functions.getUser();
      const entryemail = currUser.entryemail;

      const userId =
        UserRights == 'Agent' || UserRights == 'Client'
          ? User.accId
          : UserRights == 'Owner' && User.userid;

      let agetnID = '';

      if (UserRights == 'Agent' || UserRights == 'Client')
        agetnID = String(User.accId);

      const orderId = `${dayjs(datetime).format('YYYYMMDDhhmmss')}${Math.floor(
        1000 + Math.random() * 9000,
      )}`;

      const insertOrder = orderList.flatMap(order => {
        const {
          itemid,
          itemName,
          pcs,
          qty,
          amt,
          cgstamt,
          cgstper,
          disc1amt,
          disc1per,
          disc2amt,
          disc2per,
          gamt,
          gstgamt,
          igstamt,
          igstper,
          itemGrpname,
          mstrate,
          pac,
          rate,
          rateperunit,
          sgstamt,
          sgstper,
        } = order;

        let isSYNC = 0;
        return {
          orderId,
          orderDate,
          compid,
          compname,
          bookname,
          accid,
          accname,
          areaname: User.areaname,
          agentname,
          agentid,
          itemid,
          itemName,
          itemGrpname,
          pcs,
          pac,
          qty,
          mstrate,
          rate,
          rateperunit,
          amt,
          disc1per,
          disc1amt,
          disc2per,
          disc2amt,
          gstgamt,
          sgstper,
          sgstamt,
          cgstper,
          cgstamt,
          igstper,
          igstamt,
          gamt,
          isSYNC,
        };
      });

      const db = await getDBConnection();
      db.transaction(tx => {
        insertOrder.forEach(item => {
          const values = Object.values(item).map(value => String(value));
          tx.executeSql(
            'INSERT INTO saleordermst (UniqNumber, OrdDate, CompId, CompanyName, BooKName, AccID, AccName, AreaName, AgentName, AgentId, ItemId, ItemName, ItemGrpname, Pcs, Pac, Qty, MstRate, Rate, Rateperunit, Amt, Dis1per, Dis1amt, Dis2per, Dis2amt, GstGamt, SGSTPER, SGSTAMT, CGSTPER, CGSTAMT, IGSTPER, IGSTAMT, Gamt, isSYNC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            values,
            () => console.log('Item inserted successfully'),
            error => console.error('Error inserting item: ', error),
          );
        });
      });
      navigation.navigate('SaleHome');
    }
  };

  // Function to validate a single object
  const validateObject = (obj: any) => {
    // Skip validation for dis1 and dis2 fields
    const {dis1, dis2, ...rest} = obj;

    // Validate the rest of the fields
    for (const key in rest) {
      if (!rest[key] || rest[key] === '') {
        console.log('rest[key]', rest[key]);
        console.log('key', key);
        const cardNum = OrderList.indexOf(obj);
        let FieldName;

        switch (key) {
          case 'itemName':
            FieldName = 'Item Name';
            break;
          case 'itemid':
            FieldName = 'Item Name';
            break;
          case 'pcs':
            FieldName = 'Pieces';
            break;
          case 'pac':
            FieldName = 'Package';
            break;
          case 'qty':
            FieldName = 'Quantity';
            break;
          case 'rate':
            FieldName = 'Rate';
            break;
          default:
        }

        setToast({
          toast: true,
          toastMessage: `Card ${cardNum + 1} Field ${FieldName} is Required`,
        });
        return false;
      }
    }
    return true;
  };

  const handleRemoveCard = ({index}: {index: number}) => {
    const orderList = [...OrderList];
    console.log('orderList', orderList[index]);
    orderList.splice(index, 1);
    setOrderList(orderList);
  };

  return (
    <View style={styles.page}>
      <View
        style={{
          padding: normalize(5),
          backgroundColor: Colors.backgroundSecondary,
          borderRadius: 8,
        }}>
        <RNCText family={FontFamily.SemiBold}>{accname}</RNCText>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          data={OrderList}
          renderItem={({index, item}) => (
            <OrderCard
              index={index}
              item={item}
              setValue={setValue}
              length={OrderList.length}
              handleRemoveCard={handleRemoveCard}
              flg={flg}
            />
          )}
          contentContainerStyle={{gap: 10, paddingTop: normalize(10)}}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={false}
          // keyboardShouldPersistTaps="always"
        />
      </View>

      <View style={styles.totalCard}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{width: '49%', gap: 3}}>
            <View style={styles.totalcontainer}>
              <RNCText style={styles.totalTitle}>TAMT</RNCText>
              <RNCText style={styles.totalValue}>{format(Total.amt)}</RNCText>
            </View>

            <View style={styles.totalcontainer}>
              <RNCText style={styles.totalTitle}>DISC1</RNCText>
              <RNCText style={styles.totalValue}>
                {format(Total.disc1amt)}
              </RNCText>
            </View>

            <View style={styles.totalcontainer}>
              <RNCText style={styles.totalTitle}>DISC2</RNCText>
              <RNCText style={styles.totalValue}>
                {format(Total.disc2amt)}
              </RNCText>
            </View>

            <View style={styles.totalcontainer}>
              <RNCText style={styles.totalTitle}>GSTGAMT</RNCText>
              <RNCText style={styles.totalValue}>
                {format(Total.gstgamt)}
              </RNCText>
            </View>
          </View>

          <View style={{width: '49%', gap: 3}}>
            <View style={styles.totalcontainer}>
              <RNCText style={styles.totalTitle}>SGST</RNCText>
              <RNCText style={styles.totalValue}>
                {format(Total.sgstamt)}
              </RNCText>
            </View>

            <View style={styles.totalcontainer}>
              <RNCText style={styles.totalTitle}>CGST</RNCText>
              <RNCText style={styles.totalValue}>
                {format(Total.cgstamt)}
              </RNCText>
            </View>

            <View style={styles.totalcontainer}>
              <RNCText style={styles.totalTitle}>IGST</RNCText>
              <RNCText style={styles.totalValue}>
                {format(Total.igstamt)}
              </RNCText>
            </View>

            <View style={styles.totalcontainer}>
              <RNCText style={styles.totalTitle}>FINALAMT</RNCText>
              <RNCText style={styles.totalValue}>{format(Total.gamt)}</RNCText>
            </View>
          </View>
        </View>

        <RNCButton
          name="Place Order"
          onPress={handleSubmit}
          style={{padding: normalize(8), borderRadius: 6}}
        />
      </View>
    </View>
  );
};

export default TakeOrder;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    padding: normalize(10),
    gap: 10,
  },

  card: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    padding: normalize(10),
    gap: 5,
  },
  cardContainer: {
    flex: 1,
    gap: 2,
  },
  cardInput: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: normalize(5),
    color: Colors.Black,
  },
  cardTitle: {
    fontSize: FontSize.font11,
    fontFamily: FontFamily.SemiBold,
    left: normalize(5),
  },
  totalCard: {
    padding: normalize(5),
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 8,
    gap: 5,
    bottom: 0,
  },
  totalcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalTitle: {
    fontSize: FontSize.font11,
    fontFamily: FontFamily.Medium,
  },
  totalValue: {
    fontSize: FontSize.font11,
    fontFamily: FontFamily.SemiBold,
  },
});
