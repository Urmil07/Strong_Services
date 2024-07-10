import {Colors, FontFamily, FontSize} from '@Constants';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RNCDropdown, RNCText} from 'Common';
import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import {
  SaleAgents,
  SaleArea,
  SaleBookname,
  SaleCompanies,
  SaleParty,
} from '@Interfaces';
import {
  setLoading,
  setToast,
  useAppStore,
  usePrivilegesStore,
  useSaleStore,
} from '@Actions';

import {Datausermst} from '@/Interfaces/ReportInterface';
import {OrderConfigPageProps} from '@/Interfaces/AppStackParamList';
import {logger} from '@Utils';
import normalize from 'react-native-normalize';

const OrderConfig: FC<OrderConfigPageProps> = ({navigation}) => {
  const {Companies, Booknames, Areas, Party, Agents} = useSaleStore();
  const {UserRights} = useAppStore();
  const {User} = usePrivilegesStore(state => ({
    User: state.User as Datausermst,
  }));
  const [SelectedCompany, setSelectedCompany] = useState<SaleCompanies>();
  const [SelectedBookname, setSelectedBookname] = useState<SaleBookname>();
  const [SelectedAgents, setSelectedAgents] = useState<SaleAgents>();
  const [SelectedArea, setSelectedArea] = useState<string>('');
  const [SelectedParty, setSelectedParty] = useState<SaleParty>();

  useLayoutEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getAreaList = useCallback(() => {
    const filteredArea = Party.map(item => {
      return {label: item.areaname, value: item.areaname};
    }).filter(
      (obj, index, self) =>
        index === self.findIndex(t => t.value === obj.value),
    );
    return filteredArea;
  }, [Party]);
  const AreaList = getAreaList();

  const getParty = useCallback(() => {
    let filteredParty = Party;
    if (SelectedArea)
      filteredParty = Party.filter(item => item.areaname == SelectedArea);
    return filteredParty;
  }, [SelectedArea]);
  const FilterdParty = getParty();

  const handleTakeOrder = () => {
    console.log('handleTakeOrder');
    try {
      let agentid;
      let agentname;

      if (!SelectedCompany) throw 'Select Company';
      if (!SelectedBookname) throw 'Select Bookname';
      if (!SelectedParty) throw 'Select Party';
      if (!SelectedAgents && UserRights == 'Owner') throw 'Select Agent';
      else {
        agentid = String(User.accId);
        agentname = String(User.accname);
      }

      const Data = {
        compid: SelectedCompany.compid,
        compname: SelectedCompany.compname,
        bookid: SelectedBookname.accId,
        bookname: SelectedBookname.accname,
        accid: SelectedParty.accId,
        accname: SelectedParty.accname,
        areaname: SelectedParty.areaname,
        agentid:
          UserRights == 'Owner'
            ? String(SelectedAgents?.accId) || ''
            : agentid || '',
        agentname:
          UserRights == 'Owner'
            ? SelectedAgents?.accname || ''
            : agentname || '',
        
      };
      logger.log('Data', Data);

      navigation.navigate('TakeOrder', {...Data,flg:0});
    } catch (error) {
      let message = 'Something went wrong!';
      if (typeof error === 'string') message = error;
      else if (error instanceof Error) message = error.message;
      logger.toast(message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={{gap: 10}}>
        <RNCDropdown
          Data={Companies}
          value={SelectedCompany?.value}
          itemtextstyle={{fontSize: FontSize.font12}}
          placeholderText={'Select Company...'}
          onChange={item => {
            const {_index, ...comapny} = item;
            setSelectedCompany(comapny as SaleCompanies);
          }}
          title="Company"
        />

        <RNCDropdown
          Data={Booknames}
          value={SelectedBookname?.value}
          itemtextstyle={{fontSize: FontSize.font12}}
          placeholderText={'Select Bookname...'}
          onChange={item => {
            const {_index, ...bookname} = item;
            setSelectedBookname(bookname as SaleBookname);
          }}
          title="Bookname"
        />
        {UserRights == 'Owner' && (
          <RNCDropdown
            Data={Agents}
            value={SelectedAgents?.value}
            itemtextstyle={{fontSize: FontSize.font12}}
            placeholderText={'Select Agent...'}
            search
            onChange={item => {
              const {_index, ...agents} = item;
              setSelectedAgents(agents as SaleAgents);
            }}
            title="Agent"
          />
        )}

        <RNCDropdown
          Data={AreaList}
          value={SelectedArea}
          itemtextstyle={{fontSize: FontSize.font12}}
          placeholderText={'Select Area...'}
          inputsearchstyle={{color: Colors.Black}}
          search
          onChange={item => {
            setSelectedArea(item.value);
          }}
          title="Area"
        />

        <RNCDropdown
          Data={FilterdParty}
          value={SelectedParty?.value}
          itemtextstyle={{fontSize: FontSize.font12}}
          placeholderText={'Select Party...'}
          inputsearchstyle={{color: Colors.Black}}
          search
          onChange={item => {
            const {_index, ...party} = item;
            setSelectedParty(party as SaleParty);
          }}
          title="Party"
        />
      </ScrollView>
      <Pressable style={styles.bottomBtn} onPress={handleTakeOrder}>
        <RNCText family={FontFamily.Bold} color={Colors.WText}>
          Take Order
        </RNCText>
      </Pressable>
    </View>
  );
};

export default OrderConfig;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(10),
  },
  bottomBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.header,
    backgroundColor: Colors.header,
    padding: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
