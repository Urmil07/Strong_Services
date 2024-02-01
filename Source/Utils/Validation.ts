const isEmailValid = (Email: string) => {
  const regEx = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  return regEx.test(Email) && Email.length > 0;
};
const isMobileNumberValid = (MobileNumber: string) => {
  const regEx = /^([0|\+[0-9]{1,5})?([5-9][0-9]{9})$/;
  return regEx.test(MobileNumber) && MobileNumber.length > 9;
};
const isPasswordValid = (Password: string) => {
  return Password.length > 7;
};
const isSamePasswords = (Password: string, ConfirmPassword: string) => {
  return Password === ConfirmPassword;
};
const isPINValid = (PIN: string) => {
  return PIN.length === 4;
};
const isSamePIN = (PIN: string, ConfirmPIN: string) => {
  return PIN.length === 4 && ConfirmPIN.length === 4 && PIN === ConfirmPIN;
};
export default {
  isEmailValid,
  isMobileNumberValid,
  isPasswordValid,
  isSamePasswords,
  isPINValid,
  isSamePIN,
};
