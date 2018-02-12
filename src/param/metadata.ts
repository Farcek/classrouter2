import { Paramtype } from '../common/paramtype.enum'
import { IPipeTransform } from '../pipe/interface'



export class ParamMetadata {
    propery: string
    fieldname: string | null
    type: Paramtype;
    pipes: IPipeTransform[] = [];
}

export class ArgumentMetadata {
    index: number
    fieldname: string | null
    type: Paramtype;
    pipes: IPipeTransform[] = [];
}