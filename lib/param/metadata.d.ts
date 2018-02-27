import { Paramtype } from '../common/paramtype.enum';
import { IPipeTransform } from '../pipe/interface';
export declare class ParamMetadata {
    propery: string;
    fieldname: string[];
    type: Paramtype;
    pipes: IPipeTransform[];
}
export declare class ArgumentMetadata {
    index: number;
    fieldname: string[];
    type: Paramtype;
    pipes: IPipeTransform[];
}
