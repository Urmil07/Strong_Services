import Functions from '../Functions';
import {db} from '@/DB/database';
import {useHomeStore} from '@Actions';

const useGetUserDetails = () => {
  const {ActiveUser} = useHomeStore();
  const getDetails = async (accId: string) => {
    const DB = await db;
    const UserSQL = await DB.executeSql(
      `SELECT * FROM users WHERE accId='${accId}'`,
    );
    const UserData = UserSQL[0].rows.raw();
    return UserData;
  };

  return {
    getDetails,
  };
};

export default useGetUserDetails;
