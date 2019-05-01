import { HttpException } from './http.exception';
import { HttpStatus } from '../common';
import * as names from './names';

export class NotFoundException extends HttpException {
    constructor(message: string) {
        super(names.$$NotFoundException, message, HttpStatus.NOT_FOUND);
    }

   
}