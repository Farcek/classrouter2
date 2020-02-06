
class BaseAction<REQ, RES> {
    validate(group: string) {

    }
}

namespace ClientSide {
    interface IHttpMethod<REQ, RES> {
        action: (param: REQ) => Promise<RES>
    }

    interface ICC<T, RQ, RS> {
        new(): T & IHttpMethod<RQ, RS>
    }

    export function factory<T extends BaseAction<RQ, RS>, RQ, RS>(c: { new(): T }): T & IHttpMethod<RQ, RS> {
        return "" as any;
    }
}

namespace ServerSide {
    interface IHttpAction<REQ, RES> {
        (param: REQ): Promise<RES>
    }

    export function factory<RQ, RS, T extends BaseAction<RQ, RS>>(c: { new(): T }, action: IHttpAction<RQ, RS>) {
        return "" as any;
    }

}




namespace Patt {
    export class Rq1 {
        age: string = '';
        user: string = '';
    }

    export class Rq2 {
        age2: string = '';
        user2: string = '';
    }

    export class Rs1 {
        success: boolean = false;
    }


    export class A1 extends BaseAction<Rq1, Rs1> {
        A1Ok() {
            return 11;
        }

        A1HAA() {
            return new Rq1();
        }
    }
}




async function tClient() {


    const ins1 = ClientSide.factory(Patt.A1);

    ins1

    // let s = await ins1
    // let su= s.success;

}

async function tServer() {


    ServerSide.factory<Patt.Rq1,Patt.Rs1,Patt.A1>(Patt.A1, async (param) => {

    });

    

    // let s = await ins1
    // let su= s.success;

}