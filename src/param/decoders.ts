
import { Paramtype } from '../common/paramtype.enum';
import { IPipeTransform } from '../pipe/interface';
import { getOrCreateActionMetadata } from '../action/metadata';
import { ParamMetadata, ArgumentMetadata } from './metadata';


function createParamDecoder(type: Paramtype) {
    return (fieldname?: string | IPipeTransform, ...pipes: IPipeTransform[]) => {
        return (target: object, property: string , parameterIndex?: number) => {

            let reqName: string | null = null;
            let _pipes: IPipeTransform[];

            if (fieldname && typeof fieldname === 'string') {
                reqName = fieldname;
            }

            if (fieldname && (fieldname as IPipeTransform).transform) {
                _pipes = [fieldname as IPipeTransform, ...pipes];
            } else {
                _pipes = pipes;
            }

            let actionMeta = getOrCreateActionMetadata(target.constructor);
            if (typeof parameterIndex === 'number') {
                let meta = new ArgumentMetadata();
                meta.fieldname = reqName;
                meta.index = parameterIndex;
                meta.pipes = _pipes;
                meta.type = type;

                if (property === 'action') {                    
                    actionMeta.actionArguments[parameterIndex] = meta;
                } else if (property === 'onError') {
                    actionMeta.errorArguments[parameterIndex] = meta;
                }

            } else {
                let paramMeta = new ParamMetadata();
                paramMeta.fieldname = reqName;
                paramMeta.pipes = _pipes;
                paramMeta.propery = property;
                paramMeta.type = type;
                actionMeta.properties.push(paramMeta);
            }
        }
    }
}


export const BodyParam = createParamDecoder(Paramtype.Body);
export const PathParam = createParamDecoder(Paramtype.Path);
export const QueryParam = createParamDecoder(Paramtype.Query);
export const HeaderParam = createParamDecoder(Paramtype.Header);
export const CookieParam = createParamDecoder(Paramtype.Cookie);
export const RequestParam = createParamDecoder(Paramtype.Request);

