export interface IApiModel {
}
export declare function ApiModel(opt: IApiModel): (target: object) => void;
export declare class ClientCreateDTO {
    /**
     * client name
     */
    name: string;
    /**
     * client token
     */
    token: string;
}
