
import { IPipeTransform } from '../../src/pipe/interface'
import { InvalidMessageException } from '../../src/exceptions'


export class IntPipe implements IPipeTransform {
    transform(value: string) {

        if (value && typeof value === 'string') {
            return parseInt(value)
        }

        throw new Error("cannot parse object");
    }
}

export interface IPaging {
    offset: number
    limit: number
}
export class PagingPipe implements IPipeTransform {
    transform(queryparams: any): IPaging {

        let page = parseInt(queryparams.page || queryparams.p) || 1
        let limit = parseInt(queryparams.limit) || 10

        return {
            limit, offset: (page - 1) * limit
        }
    }
}


export interface IUser {
    id: number
    name: string
}
export class UserPipe implements IPipeTransform {
    transform(bodyParams: any): IUser {

        return {
            id: 1,
            name: 'foo'
        }
    }
}


export class UserValidationPipe implements IPipeTransform {
    transform(user: IUser): IUser {

        if (!user.name) {
            throw new InvalidMessageException("not allow empty name")
        }

        return user;
    }
}