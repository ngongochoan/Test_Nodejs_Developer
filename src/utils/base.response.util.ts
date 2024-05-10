import { ErrorCodes } from '../constants';
export class PageInfo {
  page?: number;
  size?: number;
  total?: number;
}

export class BaseResponse<T> {
  public code?: number;
  public status?: number;
  public data?: T;
  public error?: string;
  public pageInfo?: PageInfo;

  public static fail(
    statusCode?: number,
    error?: string,
  ): BaseResponse<string> {
    return {
      code: 1,
      status: statusCode,
      error: error,
    };
  }

  public static success<T>(data: T): BaseResponse<T> {
    return {
      code: 1,
      status: ErrorCodes.ERROR_CODE_SUCCESS,
      data: data,
    };
  }
  public static successPaging<T>(pageInfo: PageInfo, data: T): BaseResponse<T> {
    return {
      code: 1,
      status: ErrorCodes.ERROR_CODE_SUCCESS,
      pageInfo: pageInfo,
      data: data,
    };
  }
}
