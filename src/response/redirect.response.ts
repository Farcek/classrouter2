import { IResonse } from './interface'
export class RedirectResponse implements IResonse {

    contentType: string
    statusCode: number
    headers: { [key: string]: string }

    constructor(public uri: string, temp: boolean = true) {
        this.statusCode = temp ? 302 : 301
    }
}