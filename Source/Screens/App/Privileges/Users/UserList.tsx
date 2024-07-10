import {FlatList, Pressable, StyleSheet, Text, View} from 'react-native';
import {RNCNodata, RNCText} from 'Common';
import React, {FC, useEffect, useState} from 'react';
import {
  getUserList,
  isLoading,
  setFilterUserList,
  setLoading,
  usePrivilegesStore,
} from '@Actions';

import {Colors} from '@Constants';
import {Datausermst} from '@/Interfaces/ReportInterface';
import Entypo from 'react-native-vector-icons/Entypo';
import {UserListPageProps} from '@/Interfaces/AppStackParamList';
import normalize from 'react-native-normalize';

const UserList: FC<UserListPageProps> = ({navigation}) => {
  const {FilterUserList, UserList} = usePrivilegesStore();

  const [Users, setUsers] = useState<Datausermst[]>([]);
  const [page, setPage] = useState(1);

  const NumberOfRenderData = 100;
  useEffect(() => {
    setLoading(true);
    getUserList();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: false,
      headerSearchBarOptions: {
        shouldShowHintSearchIcon: false,
        headerIconColor: Colors.WText,
        textColor: Colors.WText,
        tintColor: Colors.WText,
        onChangeText(e) {
          handleSearch(e.nativeEvent.text);
        },
      },
    });
  }, [navigation, UserList, FilterUserList]);

  useEffect(() => {
    const initialUsers = FilterUserList.slice(0, NumberOfRenderData);
    setUsers(initialUsers);
  }, [FilterUserList, UserList]);

  const handleSearch = (query: string) => {
    const queryWords = query.toLowerCase().split(' ');

    const filteredResults = UserList.filter(item => {
      // const city = item.cityname.toLowerCase();
      const user = item.accname.toLowerCase();

      return queryWords.every(word => user.includes(word));
    });

    setFilterUserList(filteredResults);
  };

  const loadMoreData = () => {
    if (isLoading()) return;
    setLoading(true);

    const nextUsers = FilterUserList.slice(
      page * NumberOfRenderData,
      (page + 1) * NumberOfRenderData,
    );
    setTimeout(() => {
      setUsers([...Users, ...nextUsers]);
      setPage(page + 1);
      setLoading(false);
    }, 800);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={Users}
        renderItem={({item, index}) => (
          <Pressable
            style={styles.itemContainer}
            onPress={() => navigation.navigate('UserPrivileges', {User: item})}>
            <RNCText>{item.accname}</RNCText>
            <Entypo
              name="chevron-right"
              size={normalize(25)}
              color={Colors.Text}
            />
          </Pressable>
        )}
        contentContainerStyle={{gap: 5}}
        ListEmptyComponent={RNCNodata}
        contentInsetAdjustmentBehavior="automatic"
        removeClippedSubviews={false}
        // initialNumToRender={150}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.3}
      />
    </View>
  );
};

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(10),
  },
  itemContainer: {
    padding: normalize(10),
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
