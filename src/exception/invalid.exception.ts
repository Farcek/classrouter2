import { HttpException } from './http.exception';
import { HttpStatus } from '../common/http-status.enum';
import * as names from './names';

export class InvalidMessageException extends HttpException {
    constructor(message: string) {
        super(names.$$InvalidMessageException, message, HttpStatus.BAD_REQUEST);
    }
}

export interface IInvalidProperties {
    [key: string]: string[]
}
export class InvalidPropertiesException extends HttpException {

    constructor(public readonly properties: IInvalidProperties) {
        super(names.$$InvalidPropertiesException, `Invalid properties ${Object.keys(properties).length}`, HttpStatus.BAD_REQUEST);
    }

}