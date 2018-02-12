import { IResonse } from './interface'
export class ViewResponse implements IResonse {

    contentType: string
    statusCode: number
    headers: { [key: string]: string }

    constructor(public viewname: string, public data: any) {

    }
}