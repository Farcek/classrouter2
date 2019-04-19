import { Controller, Get, Post, BodyParam, QueryParam, ErrorHandle, IntPipe } from "src";
import { bController } from "./b.controller";
import { aAction } from "./a.action";
import { bAction } from "./b.action";
import { jsonBodyparser } from "./parser";


@Controller({
    name: 'a-controller', path: '/a-controller',
    controllers: [bController],
    actions: [aAction, bAction],
})
export class aController {

    @Get({ path: '/list' })
    list(@QueryParam('id3', new IntPipe()) id3: number) {
        return [1, 2, id3];
    }


    @Post({ path: '/save', befores: [jsonBodyparser], errorHandle: 'saveError' })
    save(@BodyParam() body: any) {

        if (body && body.name == 'farcek') {
            return { save: 'ok' }
        }

        throw new Error("valid");
    }

    saveError(err: Error) {
        return {
            err,
            msg: 'save error'
        }
    }

    @Post({ path: '/test', befores: [jsonBodyparser] })
    test(@BodyParam() body: any) {

        if (body && body.name == 'error') {
            throw new Error("name error");
        }

        return { save: 'ok' }
    }

    @ErrorHandle(Error)
    onError(err: Error) {
        return {
            msg: err.message,
            n: 'err',
        }
    }


}