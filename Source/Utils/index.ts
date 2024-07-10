import Functions from './Functions';
import Validation from './Validation';
import dayjs from 'dayjs';
import logger from './logger';
import useGetUserDetails from './Hook/useGetUserDetails';
import useKeyboard from './Hook/useKeyboard';

const setDate = async () => {
  const FinancialYear = Functions.getCurrentFinancialYear();
  const Year = FinancialYear.split('-');
  const StartDate = dayjs(`${Year[0]}-04-01`).format('YYYY-MM-DD HH:mm:ss');
  const EndDate = dayjs(`${Year[1]}-03-31`).format('YYYY-MM-DD HH:mm:ss');

  return {StartDate, EndDate};
};

export {Validation, Functions, setDate, useKeyboard, useGetUserDetails, logger};
