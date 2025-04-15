import {H3Event} from 'h3';
import {ErrCode} from '~/types/enums/ErrCode';
import {nanoid} from 'nanoid';

interface ILogicErr {
  code: ErrCode;
  msg?: string;
  data?: any;
}

export const throwLogicError = (options: ILogicErr) => {
  const rid = nanoid();
  console.error({
    code: options.code,
    msg: options.msg || 'Logic Error',
    data: options.data || null,
    rid,
  });
  throw createError({
    status: 400,
    statusMessage: 'Logic Error',
    data: {
      code: options.code,
      msg: options.msg || 'Logic Error',
      data: options.data || null,
      rid,
    }
  })
}
