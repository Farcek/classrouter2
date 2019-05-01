import { HttpException } from './http.exception';
import { HttpStatus } from '../common';
import * as names from './names';

export class InvalidMessageException extends HttpException {
    constructor(message: string) {
        super(names.$$InvalidMessageException, message, HttpStatus.BAD_REQUEST);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message
        }
    }
}

export interface IInvalidProperties {
    [key: string]: string[]
}
export class InvalidPropertiesException extends HttpException {

    constructor(public readonly properties: IInvalidProperties) {
        super(names.$$InvalidPropertiesException, `Invalid properties ${Object.keys(properties).length}`, HttpStatus.BAD_REQUEST);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            properties: this.properties
        }
    }
}