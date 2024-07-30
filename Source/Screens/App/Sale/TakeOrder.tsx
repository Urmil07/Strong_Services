import {Colors, FontFamily, FontSize} from '@Constants';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import {Functions, logger, useGetUserDetails, useKeyboard} from '@Utils';
import {RNCButton, RNCDropdown, RNCText} from 'Common';
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  getItemList,
  getUniqOrder,
  getUserInfo,
  setLoading,
  setToast,
  useAppStore,
  useHomeStore,
  useOrderStore,
  usePrivilegesStore,
} from '@Actions';

import {Datausermst} from '@/Interfaces/ReportInterface';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
    UniqNumber,
    OrdNo,
    Entryemail,
    OrdDate,
  } = route.params;
  const {getDetails} = useGetUserDetails();
  const {ItemList} = useOrderStore();
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

  const isKeyboardVisible = useKeyboard();

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
          flg !== 1 && (
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
          )
        );
      },
    });
  }, [navigation]);

  useEffect(() => {
    getItemList();
    getUserInfo({accId: accid});
  }, []);

  useEffect(() => {
    if (flg !== 0) {
      GetUniqOrder();
    }
  }, []);

  const GetUniqOrder = useCallback(async () => {
    if (UniqNumber) {
      const data: OrderProp[] | undefined = await getUniqOrder({UniqNumber});
      if (data && data.length) setOrderList(data);
    }
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
    // console.log('value', value);
    // console.log('fieldName', fieldName);
    // return;
    // console.log('User', User);
    const isSameState = User.statename == ActiveUser?.statename;

    const Order = [...OrderList];
    logger.log('value', value);

    if (fieldName === 'item') {
      Order[index].amt = '0';
      Order[index].cgstamt = '0';
      Order[index].cgstper = value.cgstper ? String(value.cgstper) : '';
      Order[index].disc1amt = '0';
      Order[index].disc1per = value.disc ? String(value.disc) : '';
      Order[index].disc2amt = '0';
      Order[index].disc2per = '0';
      Order[index].gamt = '0';
      Order[index].gstgamt = '0';
      Order[index].igstamt = '0';
      Order[index].igstper = value.igstper ? String(value.igstper) : '0';
      Order[index].itemGrpname = value.itemGrpname || '';
      Order[index].itemName = value.label || '';
      Order[index].itemid = value.value || '';
      Order[index].mstrate = value.salerate ? String(value.salerate) : '0';
      Order[index].pac = value.packper ? String(value.packper) : '';
      Order[index].pcs = '';
      Order[index].qty = '0';
      Order[index].rate = '0';
      Order[index].rateperunit = value.rateperunit
        ? String(value.rateperunit)
        : '0';
      Order[index].sgstamt = '0';
      Order[index].sgstper = value.sgstper ? String(value.sgstper) : '0';
    }

    if (fieldName == 'mstrate') Order[index].mstrate = value;

    if (fieldName === 'pcs') Order[index].pcs = value;

    if (fieldName === 'pac') Order[index].pac = value;

    if (fieldName === 'disc2per') {
      const amt = parseFloat(Order[index].amt);
      const disc1amt = parseFloat(Order[index].disc1amt);
      const disc2per = value ? parseFloat(value) : 0;
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
    const pcs = parseFloat(Order.pcs) || '0';
    const pac = parseFloat(Order.pac) || '0';

    if (User.hidefield == '0') qty = Number(pcs) * Number(pac);
    else qty = parseFloat(Order.qty);

    // if (pac && pcs) qty = parseFloat(Order.pcs) * parseFloat(Order.pac);

    const sgstper = parseFloat(Order.sgstper);
    const cgstper = parseFloat(Order.cgstper);
    const igstper = parseFloat(Order.igstper);
    const rateperunit = parseFloat(Order.rateperunit);
    const disc1per = parseFloat(Order.disc1per);
    const disc2per = parseFloat(Order.disc2per);

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
    Orders[index].cgstper = cgstper.toString();
    Orders[index].disc1amt = Disc1amt.toFixed(2);
    Orders[index].disc1per = disc1per.toString();
    Orders[index].disc2amt = Disc2amt.toFixed(2);
    Orders[index].disc2per = disc2per.toString();
    Orders[index].gamt = Gamt.toFixed(2);
    Orders[index].gstgamt = GstGamt.toFixed(2);
    Orders[index].igstamt = igstamt;
    Orders[index].igstper = igstper.toString();
    Orders[index].rate = rate.toFixed(2);
    Orders[index].sgstamt = sgstamt;
    Orders[index].sgstper = sgstper.toFixed(2);
    Orders[index].qty = qty.toString();
    logger.log('Orders', Orders);
    setOrderList(Orders);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (isKeyboardVisible) {
      Keyboard.dismiss();
      return;
    }
    const orderList = [...OrderList];

    const isValid = validateData(orderList);
    const db = await getDBConnection();

    if (isValid) {
      if (flg == 0) {
        const datetime = dayjs();

        const orderDate = dayjs(datetime).format('YYYY-MM-DD hh:mm:ss');

        const currUser = await Functions.getUser();
        const Entryemail = currUser.entryemail;

        const userId =
          UserRights == 'Agent' || UserRights == 'Client'
            ? User.accId
            : UserRights == 'Owner' && User.userid;

        let agetnID = '';

        if (UserRights == 'Agent' || UserRights == 'Client')
          agetnID = String(User.accId);

        const orderId = `${dayjs(datetime).format(
          'YYYYMMDDhhmmss',
        )}${Math.floor(1000 + Math.random() * 9000)}`;

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
            Entryemail,
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

        db.transaction(tx => {
          insertOrder.forEach(item => {
            const values = Object.values(item).map(value => String(value));
            tx.executeSql(
              'INSERT INTO saleordermst (Entryemail, UniqNumber, OrdDate, CompId, CompanyName, BooKName, AccID, AccName, AreaName, AgentName, AgentId, ItemId, ItemName, ItemGrpname, Pcs, Pac, Qty, MstRate, Rate, Rateperunit, Amt, Dis1per, Dis1amt, Dis2per, Dis2amt, GstGamt, SGSTPER, SGSTAMT, CGSTPER, CGSTAMT, IGSTPER, IGSTAMT, Gamt, isSYNC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              values,
              () => console.log('Item inserted successfully'),
              error => console.error('Error inserting item: ', error),
            );
          });
        });
      } else if (flg == 2) {
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
            Entryemail,
            orderDate: OrdDate,
            orderId: UniqNumber,
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
        db.transaction(tx => {
          insertOrder.forEach(item => {
            const values = Object.values(item).map(value => String(value));
            tx.executeSql(
              'INSERT INTO saleordermst (Entryemail, UniqNumber, OrdDate, CompId, CompanyName, BooKName, AccID, AccName, AreaName, AgentName, AgentId, ItemId, ItemName, ItemGrpname, Pcs, Pac, Qty, MstRate, Rate, Rateperunit, Amt, Dis1per, Dis1amt, Dis2per, Dis2amt, GstGamt, SGSTPER, SGSTAMT, CGSTPER, CGSTAMT, IGSTPER, IGSTAMT, Gamt, isSYNC) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
              values,
              () => console.log('Item inserted successfully'),
              error => console.error('Error inserting item: ', error),
            );
          });
        });
      }

      navigation.navigate('SaleHome');
    }
    setLoading(false);
  };

  const validateData = (obj: OrderProp[]) => {
    try {
      obj.map((item, index) => {
        const {disc1amt, disc1per, disc2per, disc2amt, ...rest} = item;

        // Validate the rest of the fields
        for (const key in rest) {
          // @ts-ignore
          if (!rest[key] || rest[key] === '') {
            // @ts-ignore
            console.log('rest[key]', rest[key]);
            console.log('key', key);
            const cardNum = index;
            // const cardNum = OrderList.indexOf(item);
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

            throw `Card ${cardNum + 1} Field ${FieldName} is Required`;
          }
        }
      });
      return true;

      // return true;
    } catch (error) {
      let message = 'Something went wrong!';
      if (typeof error === 'string' && error) message = error;
      if (error instanceof Error) message = error.message;
      logger.toast(message);
      return false;
    }
  };

  const handleRemoveCard = ({index}: {index: number}) => {
    const orderList = [...OrderList];

    orderList.splice(index, 1);
    setOrderList(orderList);
  };

  const isHideField =
    flg !== 1 ? (User.hidefield !== '1' ? false : true) : false;

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
            <View style={styles.card}>
              {OrderList.length > 1 && flg !== 1 ? (
                <Pressable
                  style={{
                    backgroundColor: Colors.E85555,
                    position: 'absolute',
                    zIndex: 1000,
                    top: -normalize(8),
                    right: 0,
                    borderRadius: 50,
                    padding: normalize(5),
                  }}
                  onPress={() => handleRemoveCard({index})}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={normalize(18)}
                    color={Colors.Black}
                  />
                </Pressable>
              ) : null}

              <RNCDropdown
                Data={ItemList}
                // @ts-ignore
                value={Number(item.itemid)}
                dropdownstyle={{
                  backgroundColor: Colors.background,
                  padding: 0,
                  paddingHorizontal: normalize(5),
                }}
                selectedtextstyle={{fontSize: FontSize.font10}}
                placeholderstyle={{fontSize: FontSize.font10}}
                placeholderText={'Select Item'}
                onChange={value => {
                  // console.log('value', value);

                  setValue({index, fieldName: 'item', value});
                  // setOrderValue({index, fieldName: 'item', value});
                }}
                search
                disable={flg !== 0}
              />

              <View style={{flexDirection: 'row', gap: 7}}>
                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>PCS</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {
                        backgroundColor: isHideField
                          ? Colors.inpDisable
                          : Colors.background,
                      },
                    ]}
                    keyboardType="numeric"
                    defaultValue={item.pcs}
                    onChangeText={value => {
                      setValue({index, fieldName: 'pcs', value});
                    }}
                    onEndEditing={e => {
                      const {text} = e.nativeEvent;
                      setValue({index, fieldName: 'pcs', value: text});
                    }}
                    editable={!isHideField}
                  />
                </View>

                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>PAC</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {
                        backgroundColor: isHideField
                          ? Colors.inpDisable
                          : Colors.background,
                      },
                    ]}
                    keyboardType="numeric"
                    // value={item.pac}
                    defaultValue={item.pac}
                    onChangeText={value => {
                      setValue({index, fieldName: 'pac', value});
                    }}
                    onEndEditing={e => {
                      const {text} = e.nativeEvent;
                      setValue({index, fieldName: 'pac', value: text});
                    }}
                    editable={!isHideField}
                  />
                </View>

                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>QTY</RNCText>

                  <TextInput
                    style={[
                      styles.cardInput,
                      {
                        backgroundColor: !isHideField
                          ? Colors.inpDisable
                          : Colors.background,
                      },
                    ]}
                    keyboardType="numeric"
                    value={item.qty}
                    onChangeText={value => {
                      setValue({index, fieldName: 'qty', value});
                    }}
                    onEndEditing={e => {
                      const {text} = e.nativeEvent;
                      setValue({index, fieldName: 'qty', value: text});
                    }}
                    editable={isHideField}
                  />
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 7}}>
                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>MSTRATE</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {
                        backgroundColor:
                          flg == 1 ? Colors.inpDisable : Colors.background,
                      },
                    ]}
                    value={item.mstrate}
                    editable={flg !== 1}
                    onChangeText={value => {
                      setValue({index, fieldName: 'mstrate', value});
                    }}
                  />
                </View>

                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>RATE</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {
                        backgroundColor: Colors.inpDisable,
                      },
                    ]}
                    defaultValue={item.rate}
                    editable={false}
                    onEndEditing={e => {
                      const {text} = e.nativeEvent;
                      setValue({index, fieldName: 'rate', value: text});
                    }}
                  />
                </View>

                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>DISC 1 %</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {backgroundColor: Colors.inpDisable},
                    ]}
                    keyboardType="numeric"
                    value={item.disc1per}
                    editable={false}
                  />
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 7}}>
                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>DISC 2 %</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {
                        backgroundColor:
                          flg == 1 ? Colors.inpDisable : Colors.background,
                      },
                    ]}
                    keyboardType="numeric"
                    defaultValue={item.disc2per}
                    onChangeText={value => {
                      setValue({index, fieldName: 'disc2per', value});
                    }}
                    onEndEditing={e => {
                      const {text} = e.nativeEvent;
                      setValue({index, fieldName: 'disc2per', value: text});
                    }}
                    editable={flg !== 1}
                  />
                </View>

                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>SGST %</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {backgroundColor: Colors.inpDisable},
                    ]}
                    value={item.sgstper}
                    editable={false}
                  />
                </View>

                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>CGST %</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {backgroundColor: Colors.inpDisable},
                    ]}
                    keyboardType="numeric"
                    value={item.cgstper}
                    editable={false}
                  />
                </View>

                <View style={styles.cardContainer}>
                  <RNCText style={styles.cardTitle}>IGST %</RNCText>
                  <TextInput
                    style={[
                      styles.cardInput,
                      {backgroundColor: Colors.inpDisable},
                    ]}
                    keyboardType="numeric"
                    value={item.igstper}
                    editable={false}
                  />
                </View>
              </View>
            </View>
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

        {flg !== 1 && (
          <RNCButton
            name="Place Order"
            onPress={handleSubmit}
            style={{padding: normalize(8), borderRadius: 6}}
          />
        )}
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
