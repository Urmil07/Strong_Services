import dayjs from 'dayjs';
import {setToast} from '@Actions';

// let time = dayjs().format('DD-MM-YYYY hh:mm:ss A');
const logger = {
  log: (...args: any) => {
    let time = `[${dayjs().format('YYYY-MM-DD hh:mm:ss a')}]`;
    if (__DEV__) console.log(time, ...args);
  },
  warn: (...args: any) => {
    if (__DEV__) console.warn(...args);
  },
  error: (...args: any) => {
    console.error(...args);
  },
  toast: (message: string) => {
    setToast({toast: true, toastMessage: message});
  },
};

export default logger;
