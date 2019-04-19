import { Get, Action, QueryParam, HeaderParam, CookieParam, ErrorHandle, IntPipe } from "src";

class Error1 {
    e = 1
}
class Error2 {
    e = 2
}
@Get({ path: '/b-action', name: 'b-action' })
export class bAction {


    @QueryParam('id', new IntPipe())
    id: number = 0;


    @Action()
    actionOk(@QueryParam('name') name: string) {
        if (name == 'error1') {
            throw new Error1();
        }
        if (name == 'error2') {
            throw new Error2();
        }
        return {
            n: 'n-action',
            id: this.id,
            name
        }
    }

    @ErrorHandle({ instanceOf: Error1 })
    onError1(err: Error1, @QueryParam('name') name: string, @CookieParam() cookie: any) {
        return {
            err,
            n: 'error1',
            id: this.id,
            name, cookie
        }
    }

    @ErrorHandle({ when: (err) => err instanceof Error2 })
    onError2(err: Error2) {
        return {
            err,
            n: 'error2',
            id: this.id
        }
    }


}