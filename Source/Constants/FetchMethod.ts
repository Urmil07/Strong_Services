import {REQUESTProp} from '@/Interfaces/API';
import REQUEST from './REQUEST';

const GET = async ({EndPoint, NeedToken}: REQUESTProp) => {
  return await REQUEST({
    Method: 'GET',
    EndPoint,
    NeedToken,
  });
};
const POST = async ({EndPoint, Params, NeedToken}: REQUESTProp) => {
  return await REQUEST({
    Method: 'POST',
    Params,
    EndPoint,
    NeedToken,
  });
};
const PUT = async ({EndPoint, Params, NeedToken}: REQUESTProp) => {
  return await REQUEST({
    Method: 'PUT',
    Params,
    EndPoint,
    NeedToken,
  });
};
const DELETE = async ({EndPoint, Params, NeedToken}: REQUESTProp) => {
  return await REQUEST({
    Method: 'DELETE',
    Params,
    EndPoint,
    NeedToken,
  });
};

// For FORMDATA....
const GET_FORMDATA = async ({EndPoint, Params, NeedToken}: REQUESTProp) => {
  return await REQUEST({
    Method: 'GET',
    IsformData: true,
    Params,
    EndPoint,
    NeedToken,
  });
};
const POST_FORMDATA = async ({EndPoint, Params, NeedToken}: REQUESTProp) => {
  return await REQUEST({
    Method: 'POST',
    IsformData: true,
    Params,
    EndPoint,
    NeedToken,
  });
};
const PUT_FORMDATA = async ({EndPoint, Params, NeedToken}: REQUESTProp) => {
  return await REQUEST({
    Method: 'PUT',
    IsformData: true,
    Params,
    EndPoint,
    NeedToken,
  });
};
export default {
  GET,
  GET_FORMDATA,
  POST,
  POST_FORMDATA,
  PUT,
  PUT_FORMDATA,
  DELETE,
};
