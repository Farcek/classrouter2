import { IResonse } from './interface'
export class FileResponse implements IResonse {

    contentType: string
    statusCode: number
    headers: { [key: string]: string }

    constructor(public filename: string) {

    }
}