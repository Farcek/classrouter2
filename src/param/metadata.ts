import { Paramtype } from '../common/paramtype.enum'
import { IPipeTransform } from '../pipe/interface'



export class ParamMetadata {
    propery: string;
    fieldname: string[];

    refType: Function;
    type: Paramtype;
    pipes: IPipeTransform[] = [];
}

export class ArgumentMetadata {
    index: number
    fieldname: string[]

    refType: Function
    type: Paramtype;
    pipes: IPipeTransform[] = [];
}