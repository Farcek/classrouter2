

export interface IApiModel {
    name : string
    description : string
}
export function ApiModel(opt: IApiModel) {
    return (target: object) => {

    }
}

export interface IApiModelPropery {

}

export function ApiModelPropery(opt: IApiModelPropery) {
    return (target: object, property: string) => {

    }
}





export class ClientCreateDTO {

    /**
     * client name
     */
    name: string = "";

    /**
     * client token
     */
    token: string = "";
}

