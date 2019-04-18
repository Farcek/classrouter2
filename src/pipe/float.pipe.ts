import { IPipeTransform } from '../interface'

export class FloatPipe implements IPipeTransform {
    transform(value: any) {
        try {
            return parseFloat(value);
        } catch (error) {
            return 0;
        }
    }
}
