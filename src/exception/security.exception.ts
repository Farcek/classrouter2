import { HttpException } from './http.exception';
import { HttpStatus } from '../common';

import * as names from './names';


export class AuthenticationException extends HttpException {

  constructor() {
    super(names.$$AuthenticationException, 'requared authentication', HttpStatus.UNAUTHORIZED);
  }

  
}

export class AuthorizationException extends HttpException {
  constructor(message: string) {
    super(names.$$AuthorizationException, message, HttpStatus.UNAUTHORIZED);
  }
}