import { HttpException } from './http.exception';
import { HttpStatus } from '../common/http-status.enum';

import * as names from './names';
export class ServerException extends HttpException {
  constructor(message: string) {
    super(names.$$ServerException, message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}