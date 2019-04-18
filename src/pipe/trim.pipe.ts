import { IPipeTransform } from '../interface'

export class TrimPipe implements IPipeTransform {
    transform(value: any) {
        return `${value}`.trim();
    }
}
