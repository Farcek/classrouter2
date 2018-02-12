import { IPipeTransform } from '../pipe/interface';
export declare const BodyParam: (fieldname?: string | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const PathParam: (fieldname?: string | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const QueryParam: (fieldname?: string | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const HeaderParam: (fieldname?: string | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const CookieParam: (fieldname?: string | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const RequestParam: (fieldname?: string | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
