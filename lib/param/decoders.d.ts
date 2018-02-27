import { IPipeTransform } from '../pipe/interface';
export declare const BodyParam: (fieldname?: string | string[] | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const PathParam: (fieldname?: string | string[] | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const QueryParam: (fieldname?: string | string[] | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const HeaderParam: (fieldname?: string | string[] | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const CookieParam: (fieldname?: string | string[] | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
export declare const RequestParam: (fieldname?: string | string[] | IPipeTransform | undefined, ...pipes: IPipeTransform[]) => (target: object, property: string, parameterIndex?: number | undefined) => void;
