import { IPipeTransform } from '../interface'

export class IntPipe implements IPipeTransform {
    transform(value: any) {
        try {
            return parseInt(value);
        } catch (error) {
            return 0;
        }
    }
}
