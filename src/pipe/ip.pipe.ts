import { IPipeTransform } from '../interface'

export class IpPipe implements IPipeTransform {
    transform(req: any) {
        try {
            return req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || req.connection.remoteAddress
        } catch (error) {
            return '0.0.0.0';
        }
    }
}
